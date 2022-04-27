import React from "react";
import { View, Text, StyleSheet, FlatList, ScrollView, RefreshControl, InteractionManager, Platform } from 'react-native';
import { colors, FontSize, spacer, totalSize } from "../../Style/baseStyle";
import { AppContainer } from '../../Utility/AppContainer';
import { AuctionDetailSlider } from './AuctionDetailSlider';
import { AppHeading } from '../../Utility/AppHeading';
import { Fonts } from "../../Asset/Font";
import { Icons } from "../../Asset/Icon";
import { Price_Format } from '../../Constant/Helper/PriceFormat';
import { AppButton, Button } from '../../Utility/AppButton';
import { SetBidModel } from '../../Utility/Modal/SetBidModel';
import {
    AuctionStatusTypes, NewAuctionProperty, ScreenTypes, UserStatus,
    BidBuyTypes, UserType, AuctionStatus, BidStatus
} from "../../Constant/Data";
import { getImageUrl } from "../../Constant/Helper/ImageUrl";
import { AppConstant, FilterConstant, UserConstant, WishlistConstant } from '../../Constant/AppConstant';
import { makeABid, rejectBidByApi } from '../Bids/Utils';
import { AlertMessage } from "../../Constant/Helper/AlertMessage";
import { getAuctionDetail, getAuctionStatusText, getAuctionStatusColor, getMyAuctionDetail, closeAuctionByApi, cancelExpiredAuctionByApi } from '../Auctions/Utils';
import { isUserLogged } from '../../Constant/Helper/UserHelper';
import { getBidDetail, makeBidWinner, getWinnerBidDataPrice } from '../Bids/Utils';
import { bidDateIsValid, getDateFormat, getDays, getDiffFromDates, isDateExpired, remainingDay } from '../../Constant/Helper/TimeAndDate';
import { MSG } from "../../Constant/Message";
import { openCallActivity } from '../../Constant/Helper/PhoneCallActivity';
import { EventRegister, EventType } from '../../Constant/EventRegister';
import {
    AuctionBasicDetail,
    OtherDetails,
    AdditionalInfo,
    AuctionSellerDetail,
    GridButton,
    BidDetail
} from '../../Utility/AuctionUtility/AuctionBasicDetail';
import { openShareActivity } from "../../Constant/Helper/ShareActivity";
import { addToWishList, removeFromWishList } from '../Wishlist/Utils';
import { SellerMapModel } from './ShowSellerMap';
import moment from "moment";
import { getLangText } from "../../Store/Actions/LangAction";
import { English, languageCode, Spanish, TextKey } from "../../Constant/Language";
import { ShowSnakeBar } from "../../Utility/ShowMessage";
import { setSpinner } from "../../Store/Actions/SpinnerAction";


const borderColor = colors.lightWhite


class App extends React.Component {

    state = {
        bidModel: false,
        from: "",
        detail: undefined,
        isAuctionExpired: false,
        bidType: undefined,
        isMyWishList: undefined,
        demo: "",
        showSellerMap: false,
    }

    componentDidMount() {
        this.getPrevScreenParam();
        EventRegister.on(EventType.new_notification, () => {
            this.onRefreshData();
        })
    }

    componentWillUnmount() {
        EventRegister.rm(EventType.new_notification);
    }



    getPrevScreenParam = () => {
        if (this.props.route.params) {
            const item = this.props.route.params;
            if (item) {

                this.setState({
                    from: item?.from,
                    detail: item?.data
                })
            }
        }
    }

    goToBack = () => {
        this.props.navigation.goBack()
    }

    getDetailByKey = (key) => {
        const detail = this.state.detail;
        if (detail) {
            if (key in detail) {
                return detail[key];
            }
        }
        return undefined
    }

    getImages = () => {
        if (this.state.detail) {
            if (this.state.detail?.auction_image) {
                const res = this.state.detail?.auction_image.map((item) => {
                    return getImageUrl(item?.media_url);
                });

                return res
            }
        }
        return [];
    }

    getParam = (bid_price = 0, bidType) => {
        const obj = {};
        obj['auction_id'] = this.state.detail?.id;
        obj['bid_amount'] = bid_price;
        obj["type"] = bidType;
        return obj
    }

    gotToMyBid = () => {
        //this.props.navigation.navigate('MyBid');
        this.onRefreshData();
    }

    addNewBid = async (bidPrice, bidType = this.state.bidType) => {

        const data = this.getParam(bidPrice, bidType);
        const res = await makeABid(Platform.OS == "android", data);

        console.log(res, data);
        if (res && res.status) {
            if (this.state.from == ScreenTypes.bid_list) {
                ShowSnakeBar(getLangText(TextKey.your_bid_added_successfully));
                this.getBid_detail();
                return
            }

            if (bidType == BidBuyTypes.bid) {
                ShowSnakeBar(getLangText(TextKey.your_bid_added_successfully));
                this.getBid_detail();
            }
            else if (bidType == BidBuyTypes.pre_bid) {
                ShowSnakeBar(getLangText(TextKey.your_pre_bid_added_successfully));
                this.getBid_detail();
            }
            else if (bidType == BidBuyTypes.direct_buy) {
                ShowSnakeBar(getLangText(TextKey.you_successfully_purchase_auction));
                this.getBid_detail();
            }
        }
    }

    checkUser = () => {
        isUserLogged((res) => {
            if (res) {
                const bidStatus = this.checkBid();
                if (bidStatus) {
                    this.setState({
                        bidModel: true,
                        bidType: BidBuyTypes.bid,
                    })
                }
            }
        })
    }

    showMessage = (msg) => {
        AlertMessage({
            title: "",
            message: msg,
            text2: "ok",
            text1: "",
        });
    }

    checkBid = () => {
        if (this.state.detail) {
            if (String(this.state.detail?.status) == String(AuctionStatusTypes.active)) {
                return true
            }
            else if (String(this.state.detail?.status) == String(AuctionStatusTypes.pending)) {
                this.showMessage(getLangText(TextKey.can_not_make_bid_auction_not_approve));
                return false
            }
            else if (String(this.state.detail?.status) == String(AuctionStatusTypes.cancel)) {
                this.showMessage(getLangText(TextKey.this_auction_cancel_not_make_bid));
                return false
            }
        }
        return false
    }

    getBid_detail = () => {
        InteractionManager.runAfterInteractions(async () => {
            if (this.state.detail) {
                const res = await getBidDetail(this.state.detail?.id, undefined, Platform.OS == "android");
                if (res && res.status) {
                    this.setState({
                        detail: res?.data
                    });
                }
                return
            }
        })
    }



    isMyAuction = (auctionUserId) => {
        //console.log("=========userAuction=====", String(auctionUserId) == UserConstant.user_id)
        if (String(auctionUserId) == UserConstant.user_id) {
            return true
        }
        return false
    }

    makeWinner = async (bid_id, price) => {
        AlertMessage({
            title: getLangText(TextKey.winner),
            message: MSG.make_winner_bid(price),
            text1: getLangText(TextKey.no),
            text2: getLangText(TextKey.yes),
        }, async () => {
            if (bid_id) {
                const res = await makeBidWinner(this.state.detail?.id, bid_id);
                if (res) {
                    AlertMessage({
                        title: getLangText(TextKey.success),
                        message: getLangText(TextKey.you_successfully_made_bid_winner),
                        text2: getLangText(TextKey.ok),
                        text1: "",
                    }, () => {
                        this.getDetail();
                    })
                }
            }
        })

    }

    getDetail = async () => {
        InteractionManager.runAfterInteractions(async () => {
            if (this.state.detail) {
                const res = await getAuctionDetail(this.state.detail?.id, undefined);
                if (res && res.status) {
                    this.setState({
                        detail: res?.data
                    });
                }
            }
        })
    }

    getMyAuctionDetail = () => {
        InteractionManager.runAfterInteractions(async () => {
            if (this.state.detail) {
                const res = await getMyAuctionDetail(this.state.detail?.id, undefined)

                if (res && res.status) {
                    this.setState({
                        detail: res?.data
                    });
                }
            }
        })
    }

    onRefreshData = async () => {

        const bid = this.getDetailByKey('bid_data');
        const isMeWinner = await this.isMeWinner();

        if (isMeWinner) {
            this.getBid_detail();
            return
        }
        else if (this.isMyBidExist(bid)) {
            this.getBid_detail();
            return
        }
        else {
            const isMeSeller = await this.isMeSeller();
            if (isMeSeller) {
                this.getMyAuctionDetail();
                return
            }
            this.getDetail();
        }
    }



    directBuyOnPress = () => {
        isUserLogged((res) => {
            if (res) {

                const salePrice = this.getDetailByKey('sale_price');
                const msg = AppConstant.selected_lang == languageCode.en ? English.direct_buy_auction(salePrice) : Spanish.direct_buy_auction(salePrice);
                AlertMessage({
                    title: "",
                    message: msg,
                    text1: getLangText(TextKey.cancel),
                    text2: getLangText(TextKey.ok),
                }, () => {
                    this.setState({
                        bidType: BidBuyTypes.direct_buy
                    }, () => {
                        this.addNewBid(salePrice);
                    })
                })
            }
        })

    }

    preBidOnPress = () => {
        isUserLogged((res) => {
            if (res) {
                this.setState({
                    bidModel: true,
                    bidType: BidBuyTypes.pre_bid,
                })
            }
        });

    }

    getMaxBidPrice = (bid = []) => {
        if (bid) {
            const Bids = bid.map((item) => item?.bid_amount);
            if (Bids.length > 0) {
                const price = Math.max(...Bids);
                return price
            }
        }
        return undefined
    }

    isMeWinner = (detail = this.state.detail) => {
        if (detail && "winner_data" in detail) {
            const winner = detail?.winner_data;
            if (String(winner?.user_id) == String(UserConstant.user_id)) {
                return true
            }
        }
        return false
    }
    isMeSeller = (detail = this.state.detail) => {
        if (detail) {
            if (String(detail?.user_id) == String(UserConstant.user_id)) {
                return true
            }
        }
        return false
    }

    getCurrentBid = (bid = []) => {
        if (bid) {
            const myBids = ((bid.filter((item) => String(item?.type) == BidBuyTypes.bid)).map((item) => item?.bid_amount));
            if (myBids.length > 0) {
                return myBids[myBids.length - 1];
            }
        }
        return undefined
    }

    getMyPreBid = (bid = []) => {
        if (bid) {
            const myBids = ((bid.filter((item) => String(item?.type) == BidBuyTypes.pre_bid)).filter((item) => String(item?.user_id) == String(UserConstant.user_id))).map((item) => item?.bid_amount);
            if (myBids.length > 0) {
                const price = Math.max(...myBids);
                return price
            }
        }
        return undefined
    }

    getMyBids = (bid = []) => {
        if (bid) {
            const myBids = ((bid.filter((item) => String(item?.type) == BidBuyTypes.bid)).filter((item) => String(item?.user_id) == String(UserConstant.user_id)));
            return myBids
        }
        return undefined
    }

    getMaxPreBid = (bid = [], returnId = false) => {
        if (bid) {
            const preBids = (bid.filter((item) => String(item?.type) == BidBuyTypes.pre_bid));
            const preBidPrice = preBids.map((item) => item?.bid_amount);
            if (preBidPrice.length > 0) {
                const maxBid = Math.max(...preBidPrice);
                if (returnId) {
                    const index = preBidPrice.indexOf(maxBid);
                    const maxPreBidItem = preBids[index];
                    return maxPreBidItem?.id
                }
                return maxBid;
            }
            // const preBids = (bid.filter((item) => String(item?.type) == BidBuyTypes.pre_bid)).map((item) => item?.bid_amount);
            // if (preBids.length > 0) {
            //     const maxBid = Math.max(...preBids);
            //     return maxBid;
            // }
        }
        return undefined;
    }

    getMyOfferMaxBid = (bid = []) => {
        if (bid) {
            const prices = bid.map((item) => item?.bid_amount);
            if (prices.length > 0) {
                const max = Math.max(...prices);
                return max;
            }
        }
        return undefined
    }

    wishListOnPress = async () => {
        if (this.state.detail) {
            if (WishlistConstant.isAddedToMyWishlist(this.state.detail?.id)) {
                await removeFromWishList(this.state.detail?.id)
                this.setState({ isMyWishList: false })
            }
            else {
                await addToWishList(this.state.detail?.id);
                this.setState({ isMyWishList: true });

            }

        }
    }

    shareOnPress = () => {
        const name = this.getDetailByKey('make_name') ? this.getDetailByKey('make_name')[0]?.name : undefined;
        const image = this.getImages().length > 0 ? this.getImages()[0] : "http";
        const msg = `${image}\n ${name}\n${Price_Format(this.getDetailByKey('bid_price'))}`;
        openShareActivity(msg);
    }

    showSellerMap = () => {
        if (this.state.detail && this.state.detail?.lat && this.state?.detail?.lng) {
            this.setState({
                showSellerMap: true,
            })
        }
    }

    closeAuction = async (id = this.state?.detail?.id) => {
        AlertMessage({
            title: getLangText(TextKey.close),
            message: getLangText(TextKey.close_auction),
            text1: getLangText(TextKey.no),
            text2: getLangText(TextKey.yes),
        }, async () => {
            const res = await closeAuctionByApi(this.state?.detail?.id);

            if (res && res.status) {
                this.getDetail();
            }
        })
    }

    cancelAuction = () => {
        AlertMessage({
            title: getLangText(TextKey.close),
            message: getLangText(TextKey.cancel_auction),
            text1: getLangText(TextKey.no),
            text2: getLangText(TextKey.yes),
        }, async () => {
            const res = await cancelExpiredAuctionByApi(this.state?.detail?.id);
            console.log(res);
            if (res && res.status) {
                this.getDetail();
            }
        })
    }

    rejectOnPress = (id, price) => {
        const msg = AppConstant.selected_lang == languageCode.en ? English.reject_bid(price) : Spanish.reject_bid(price);
        AlertMessage({
            title: getLangText(TextKey.reject),
            message: msg,
            text1: getLangText(TextKey.no),
            text2: getLangText(TextKey.yes),
        }, async () => {
            const res = await rejectBidByApi(id);
            this.getDetail();
        })
    }

    isMyBidExist = (bid = []) => {
        if (bid) {
            let isMyBid = false;
            for (let i = 0; i < bid.length; i++) {
                const item = bid[i];
                if (String(item?.user_id) == String(UserConstant.user_id)) {
                    isMyBid = true;
                    break;
                }
            }
            return isMyBid
        }
        return false
    }

    getNumOfDays = (startDate, endDate, isAuctionExpired) => {
        if (isAuctionExpired) {
            return false
        }
        if (startDate && endDate) {
            return remainingDay(endDate);
        }
        return undefined
    }

    render() {
        const status = this.getDetailByKey('used_type');
        const auctionStatus = this.getDetailByKey('status');
        const name = this.getDetailByKey('make_name') ? this.getDetailByKey('make_name')[0]?.name : undefined;
        const model = this.getDetailByKey('model_name') ? this.getDetailByKey('model_name')[0]?.name : undefined;
        const year = this.getDetailByKey('year');
        const milage = this.getDetailByKey('mileage');
        const address = this.getDetailByKey('address');
        const startPrice = this.getDetailByKey('bid_price');
        const sale_price = this.getDetailByKey('sale_price');
        const endPrice = this.getDetailByKey('bid_closed_price');
        const damage_filter_name = this.getDetailByKey('damage_filter_name') ? this.getDetailByKey('damage_filter_name')[0]?.name : undefined;
        const secondary_damage_name = this.getDetailByKey('secondary_damage_name') ? this.getDetailByKey('secondary_damage_name')[0]?.name : undefined;
        const drive_line_name = this.getDetailByKey('drive_line_name') ? this.getDetailByKey('drive_line_name')[0]?.name : undefined;
        const body_name = this.getDetailByKey('body_name') ? this.getDetailByKey('body_name')[0]?.name : undefined;
        const fule_name = this.getDetailByKey('fule_name') ? this.getDetailByKey('fule_name')[0]?.name : undefined;
        const transmission_name = this.getDetailByKey('transmission_name') ? this.getDetailByKey('transmission_name')[0]?.name : undefined;
        const catacatalytic_convertor_name = this.getDetailByKey('catalytic_convertor_name') ? this.getDetailByKey('catalytic_convertor_name')[0]?.name : undefined;
        const color_name = this.getDetailByKey('color_name') ? this.getDetailByKey('color_name')[0]?.name : undefined;
        const add_info = this.getDetailByKey('details');
        const cleanTitle = this.getDetailByKey('clean_title');
        const titleStatus = this.getDetailByKey('title_status');
        const startDate = this.getDetailByKey('bid_start');
        const endDate = this.getDetailByKey('bid_end');

        const bid = this.getDetailByKey('bid_data');
        const seller = this.getDetailByKey('seller') ? this.getDetailByKey('seller')[0] : undefined;
        const winnerDetail = this.getDetailByKey('winner_data') ? this.getDetailByKey('winner_data')?.userdata[0] : undefined;
        const winnerBid = this.getDetailByKey('winner_data') ? this.getDetailByKey('winner_data') : undefined;
        const maxBid = this.getMaxBidPrice(bid);
        const isMeWinner = this.isMeWinner();
        const isMeSeller = this.isMeSeller();
        const pre_bid = maxBid;
        const currentBid = this.getCurrentBid(bid);

        // Pre bids
        const my_pre_bid = this.getMyPreBid(bid);
        const maxPreBid = this.getMaxPreBid(bid);
        const maxPreBidId = this.getMaxPreBid(bid, true);

        //my offer bids
        const myBids = this.getMyBids(bid);
        const myOfferMaxBid = this.getMyOfferMaxBid(myBids);
        const isAuctionExpired = isDateExpired(endDate);
        const timeFrame = this.getNumOfDays(startDate, endDate, isAuctionExpired);
        const cancelReason = this.getDetailByKey('cancel_reason');
        const myWishlist = this.state.isMyWishList ? this.state.isMyWishList : WishlistConstant.isAddedToMyWishlist(this.state?.detail?.id);

        console.log("==========detail========", this.state.detail?.id, this.state.detail?.status);
        return (
            <AppContainer>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.onRefreshData}
                        />
                    }>
                    <AuctionDetailSlider
                        backOnPress={this.goToBack}
                        status={FilterConstant.getStatusById(status)}
                        _images={this.getImages()}
                    />
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: spacer,
                            top: -totalSize(6),
                        }}>
                        <AuctionBasicDetail
                            name={name}
                            address={address}
                            des={`${model} | ${year} | ${milage}`}
                            auction_status={this.state.detail?.status}
                            isExpired={
                                this.state.detail?.status == AuctionStatusTypes.active &&
                                    isAuctionExpired
                                    ? true
                                    : false
                            }
                            cancelReason={cancelReason}
                            Status={this.state.detail?.status}
                            isMeSeller={isMeSeller}
                            wishListOnPress={this.wishListOnPress}
                            shareOnPress={this.shareOnPress}
                            isMyWishlist={myWishlist}
                        />

                        <OtherDetails
                            maxPreBidId={maxPreBidId}
                            startPrice={startPrice}
                            sale_price={sale_price}
                            maxBid={maxBid}
                            my_pre_bid={my_pre_bid}
                            maxPreBid={maxPreBid}
                            endPrice={endPrice}
                            isMeSeller={isMeSeller}
                            current_bid={currentBid ? currentBid : false}
                            damage_filter_name={damage_filter_name}
                            secondary_damage_name={secondary_damage_name}
                            drive_line_name={drive_line_name}
                            body_name={body_name}
                            fule_name={fule_name}
                            transmission_name={transmission_name}
                            color_name={color_name}
                            cleanTitle={cleanTitle}
                            titleStatus={titleStatus}
                            catacatalytic_convertor_name={catacatalytic_convertor_name}
                            startDate={getDateFormat(startDate)}
                            endDate={getDateFormat(endDate)}
                            userPreBidOnPress={(price, id) => {
                                this.makeWinner(id, price);
                            }}
                            Status={this.state.detail?.status}
                            timeFrame={timeFrame}
                        />
                        <AdditionalInfo info={add_info} />
                        {String(auctionStatus) == String(AuctionStatusTypes.sold) &&
                            isMeWinner && (
                                <AuctionSellerDetail
                                    heading={getLangText(TextKey.Seller_detail)}
                                    f_name={seller?.first_name}
                                    l_name={seller?.last_name}
                                    email={seller?.email}
                                    mobile={seller?.mobile_number}
                                    type={UserType.seller}
                                    street={seller && 'street' in seller ? seller.street : ''}
                                    city={seller?.city}
                                    state={seller?.state}
                                />
                            )}

                        {String(auctionStatus) == String(AuctionStatusTypes.sold) &&
                            winnerDetail &&
                            isMeSeller && (
                                <AuctionSellerDetail
                                    heading={getLangText(TextKey.Winner_detail)}
                                    f_name={winnerDetail?.first_name}
                                    l_name={winnerDetail?.last_name}
                                    email={winnerDetail?.email}
                                    mobile={winnerDetail?.mobile_number}
                                    type={UserType.buyer}
                                    street={winnerDetail.street}
                                    city={winnerDetail?.city}
                                    state={winnerDetail?.state}
                                />
                            )}
                        {bid && isMeSeller && (
                            <BidDetail
                                title={getLangText(TextKey.Bid_History)}
                                bid={bid}
                                auction_user_id={this.state.detail?.user_id}
                                is_my_auction={this.isMyAuction(this.state.detail?.user_id)}
                                makeWinnerOnPress={(bid_id, price) =>
                                    this.makeWinner(bid_id, price)
                                }
                                rejectOnPress={this.rejectOnPress}
                                status={this.state.detail.status}
                            />
                        )}

                        {isMeSeller == false && myBids && (
                            <BidDetail
                                title={getLangText(TextKey.Your_offered_bids)}
                                bid={myBids}
                                auction_user_id={this.state.detail?.user_id}
                                is_my_auction={false}
                            //makeWinnerOnPress={(bid_id) => this.makeWinner(bid_id)}
                            />
                        )}

                        {isMeWinner &&
                            this.state.detail.status == AuctionStatusTypes.sold && (
                                <View
                                    style={{
                                        marginTop: spacer,
                                    }}>
                                    <AppButton
                                        title={getLangText(TextKey.View_Location)}
                                        onPress={this.showSellerMap}
                                    />
                                </View>
                            )}

                        {isMeSeller &&
                            isAuctionExpired == false &&
                            +this.state.detail.status !== AuctionStatusTypes.sold &&
                            +this.state.detail.status !== AuctionStatusTypes.closed && (
                                <View
                                    style={{
                                        marginTop: spacer,
                                    }}>
                                    <AppButton
                                        title={getLangText(TextKey.Close_auction)}
                                        onPress={this.closeAuction}
                                    />
                                </View>
                            )}

                        {isMeSeller &&
                            isAuctionExpired &&
                            +this.state.detail.status == AuctionStatusTypes.active && (
                                <View
                                    style={{
                                        marginTop: spacer,
                                    }}>
                                    <AppButton
                                        title={getLangText(TextKey.Cancel_auction)}
                                        onPress={this.cancelAuction}
                                    />
                                </View>
                            )}

                        {String(this.state.detail?.status) ==
                            AuctionStatusTypes.active ? (
                            <>
                                {isAuctionExpired ||
                                    this.isMyAuction(this.state.detail?.user_id) ? null : (
                                    <>
                                        <GridButton
                                            title1={getLangText(TextKey.buy_now)}
                                            title2={getLangText(TextKey.pre_bid)}
                                            onPress1={this.directBuyOnPress}
                                            onPress2={this.preBidOnPress}
                                        />

                                        <View
                                            style={{
                                                marginTop: spacer,
                                            }}>
                                            <AppButton
                                                title={getLangText(TextKey.Make_Offer)}
                                                //onPress={() => this.setState({ bidModel: true })}
                                                onPress={this.checkUser}
                                            />
                                        </View>
                                    </>
                                )}
                            </>
                        ) : null}
                    </View>
                </ScrollView>
                {this.state.bidModel && (
                    <SetBidModel
                        bidType={this.state.bidType}
                        closeOnPress={() => this.setState({ bidModel: false })}
                        doneOnPress={price => this.addNewBid(price)}
                        minBid={
                            this.state.bidType == BidBuyTypes.pre_bid
                                ? maxPreBid
                                    ? maxPreBid
                                    : this.state.detail?.bid_price
                                : myOfferMaxBid
                                    ? myOfferMaxBid
                                    : this.state.detail?.bid_price
                        }
                    />
                )}
                {this.state.showSellerMap && (
                    <SellerMapModel
                        latitude={this.state.detail?.lat}
                        longitude={this.state.detail?.lng}
                        backOnPress={() => this.setState({ showSellerMap: false })}
                    />
                )}
            </AppContainer>
        );


    }
}

export default App


