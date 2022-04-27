import React from "react";
import { View, Text, FlatList, ScrollView } from 'react-native';
import { colors, FontSize, h, spacer } from "../../Style/baseStyle";
import { AppContainer } from '../../Utility/AppContainer';
import { AppHeading } from '../../Utility/AppHeading';
import { Header } from '../../Utility/AuctionHeader';
import { AppGridButton } from '../../Utility/AppGridButton';
import { CarAuctions } from '../../Utility/Card/CarAuctions';
import { getMyBid, getBidDetail, getWinnerBidDataPrice } from './Utils';
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { MSG } from '../../Constant/Message';
import { ScreenTypes, BidStatus, AuctionStatusTypes, BidStatusLang } from "../../Constant/Data";
import { FilterConstant, UserConstant } from "../../Constant/AppConstant";
import { AuctionSearchModel } from '../../Utility/Modal/AuctionSearchModel';
import { getDataForLang, getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";



class App extends React.Component {

    state = {
        bid: [],
        bid_list: [],
        selectedTab: 1,
        searchModel: false,
        selectedFilterStatus: undefined,
    }

    navigateToDetail = () => {
        this.props.navigation.navigate('AuctionDetail');
    }

    componentDidMount() {
        this.getBids();
        this.subscribe = this.props.navigation.addListener('focus', () => {
            this.getBids();
        });
    }

    componentWillUnmount() {
        this.subscribe();
    }

    getSelectedTabData = (list = [], filterType = this.state.selectedFilterStatus) => {
        if (this.state.selectedTab == 1) {
            return this.getActiveBids(list, filterType);
        }
        else if (this.state.selectedTab == 2) {
            return this.getWonBids(list, filterType);
        }
        else if (this.state.selectedTab == 3) {
            return this.getLostBids(list, filterType);
        }
    }


    getBids = async () => {
        const res = await getMyBid();
        if (res) {
            this.setState({
                bid: this.getSelectedTabData(res),
                bid_list: res,
            })
        }
        else {
            this.setState({
                bid: [],
                bid_list: [],
            })
        }
    }

    getBidDetail = async (id) => {
        const res = await getBidDetail(id, ScreenTypes.bid_list);
    }

    filterActiveData = (list = []) => {
        if (list) {
            const res = list.filter((item) => {
                const winner = "winner_data" in item ? item?.winner_data : undefined;
                if (winner && String(winner?.user_id) == String(UserConstant.user_id)) {
                    return false
                }
                return true
            });
            return res
        }
        return list
    }

    getActiveBids = (list = [], filterType) => {
        if (list) {
            let res = list.filter((item) => String(item?.status) == AuctionStatusTypes.active);
            if (filterType) {
                res = res.filter((item) => {
                    const statusName = FilterConstant.getStatusById(item?.used_type);
                    return statusName == filterType
                })
            }
            return res;
        }
        return list;
    }

    getWonBids = (list, filterType) => {
        if (list) {
            let res = list.filter((item) => {
                const winner = "winner_data" in item ? item?.winner_data : undefined;
                const statusName = FilterConstant.getStatusById(item?.used_type);
                if (winner && String(winner?.user_id) == String(UserConstant.user_id) && String(item?.status) == AuctionStatusTypes.sold) {
                    return true
                }
                return false
            });
            if (filterType) {
                res = res.filter((item) => {
                    const statusName = FilterConstant.getStatusById(item?.used_type);
                    return statusName == filterType
                })
            }
            return res;
        }
        return list;
    }

    getLostBids = (list = [], filterType) => {
        if (list) {
            let res = list.filter((item) => {
                const winner = "winner_data" in item ? item?.winner_data : undefined;
                if (winner && String(winner?.user_id) !== String(UserConstant.user_id) && String(item?.status) == AuctionStatusTypes.sold) {
                    return true
                }
                else if (String(item?.status) == AuctionStatusTypes.closed) {
                    return true
                }
                else if (String(item?.status) == AuctionStatusTypes.expired_close) {
                    return true
                }
                return false
            });
            if (filterType) {
                res = res.filter((item) => {
                    const statusName = FilterConstant.getStatusById(item?.used_type);
                    return statusName == filterType
                })
            }
            return res;
        }
        return list;
    }

    onTabPress = (index, tab, filterType = this.state.selectedFilterStatus) => {

        if (this.state.bid_list.length > 0) {
            if (index == 2) {
                const res = this.getWonBids(this.state.bid_list, filterType);

                this.setState({
                    bid: res,
                    selectedTab: index
                });
                return
            }
            if (index == 3) {
                const res = this.getLostBids(this.state.bid_list, filterType);
                this.setState({
                    bid: res,
                    selectedTab: index
                });
                return
            }
            else if (index == 1) {
                const res = this.getActiveBids(this.state.bid_list, filterType)
                this.setState({
                    bid: res,
                    selectedTab: index
                });
                return
            }
        }
    }

    searchBid = (txt) => {
        if (txt == "") {
            this.setState({
                bid: this.state.bid_list
            })
            return
        }
        const res = this.state.bid_list.filter((item) => {
            const name = "make_name" in item ? item?.make_name[0]?.name : "";
            if (name && String(name).toLocaleLowerCase().match(String(txt).trim().toLocaleLowerCase())) {
                return true
            }
            return false
        });
        this.setState({
            bid: res
        })
    }

    filterByStatus = (status) => {
        if (status == "All") {
            this.setState({
                searchModel: false,
                selectedFilterStatus: undefined
            }, () => this.onTabPress(this.state.selectedTab, undefined, this.state.selectedFilterStatus));
            return
        }
        this.setState({
            searchModel: false,
            selectedFilterStatus: status
        }, () => this.onTabPress(this.state.selectedTab, undefined, this.state.selectedFilterStatus))
    }

    render() {
        return (
            <AppContainer>
                <ScrollView>
                    <View style={{
                        flex: 1,
                    }}>
                        {
                            this.state.bid_list.length > 0 ?
                                <>
                                    <Header
                                        placeholder={getLangText(TextKey.search_auction)}
                                        onChangeText={this.searchBid}
                                        filterOnPress={() => { this.setState({ searchModel: true }) }}
                                        isFilterActive={["used", "junk", "new"].includes(String(this.state.selectedFilterStatus).toLocaleLowerCase())}
                                    />
                                    <View style={{
                                        paddingHorizontal: spacer
                                    }}>
                                        <AppGridButton
                                            list={getDataForLang(BidStatusLang)}
                                            onPress={this.onTabPress}
                                            selectedTab={this.state.selectedTab}
                                        />

                                        <View style={{
                                            marginTop: spacer * .8
                                        }}>
                                            {
                                                this.state.bid.length > 0 && this.state.selectedTab == 1 && (
                                                    <AppHeading
                                                        title={getLangText(TextKey.MyBids_Description)}
                                                        fontSize={FontSize.md}
                                                    />
                                                )
                                            }
                                        </View>
                                        {
                                            this.state.bid.length > 0 ?
                                                this.state.bid.map((item, index) => {
                                                    const name = "make_name" in item ? item?.make_name[0]?.name : "";
                                                    const your_Bid = "bid_data" in item ? item?.bid_data[item?.bid_data.length - 1].bid_amount : undefined;
                                                    const bid_data = "bid_data" in item && item?.bid_data;
                                                    return <CarAuctions
                                                        key={`key-${index}`}
                                                        onPress={() => this.getBidDetail(item?.id)}
                                                        start_price={item?.bid_price}
                                                        end_price={item?.bid_closed_price}
                                                        status={item?.used_type}
                                                        name={name}
                                                        startDate={item?.bid_start}
                                                        bid_data={bid_data}
                                                        endDate={item?.bid_end}
                                                        your_bid={your_Bid ? your_Bid : false}
                                                        image={item?.auction_image.length > 0 ? item?.auction_image[0]?.media_url : null}
                                                    />
                                                })
                                                :
                                                <AppNoDataFound
                                                    Height={h(65)}
                                                    message={getLangText(TextKey.no_bid_found)}
                                                />
                                        }
                                    </View>
                                </>
                                :
                                <AppNoDataFound
                                    Height={h(90)}
                                    message={getLangText(TextKey.no_bid_found)}
                                />
                        }


                        {
                            this.state.searchModel && (
                                <AuctionSearchModel
                                    statusOnPress={this.filterByStatus}
                                    status={this.state.selectedFilterStatus}
                                    resetStatusOnPress={() => this.filterByStatus(undefined)}
                                />
                            )
                        }
                    </View>
                </ScrollView>
            </AppContainer>
        )
    }
}


export default App;