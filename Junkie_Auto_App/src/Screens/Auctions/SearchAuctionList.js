import React from "react";
import { View, Text, FlatList, RefreshControl, ScrollView, InteractionManager } from 'react-native';
import { colors, FontSize, h, spacer } from "../../Style/baseStyle";
import { AppContainer } from '../../Utility/AppContainer';
import { AppHeading } from '../../Utility/AppHeading';
import { Header } from '../../Utility/AuctionHeader';
import { AppGridButton } from '../../Utility/AppGridButton';
import { CarAuctions } from '../../Utility/Card/CarAuctions';
import { getAuction } from './Utils';
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { MSG } from '../../Constant/Message';
import { getAuctionDetail } from '../Auctions/Utils';
import { ScreenTypes } from '../../Constant/Data';
import { getWishList, addToWishList, removeFromWishList } from '../Wishlist/Utils';
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";



class App extends React.Component {
    state = {
        auction_list: [],
        from: "",
        wishListIds: [],
    }

    componentDidMount() {
        this.getWishlist();
        this.getPrevScreenParam();
    }

    getPrevScreenParam = () => {
        if (this.props.route) {
            const item = this.props.route?.params;
            if (item) {
                this.setState({
                    from: item?.from,
                    auction_list: item?.data
                })
            }
        }
    }

    getAuctionDetail = async (id) => {
        const res = await getAuctionDetail(id, ScreenTypes.all_auction_list);
    }

    getWishlist = async () => {
        InteractionManager.runAfterInteractions(async () => {
            const res = await getWishList();
            if (res) {
                this.setState({
                    wishListIds: res
                })
            }
        })
    }

    wishListOnPress = async (id) => {
        if (this.state.wishListIds.includes(id)) {
            const res = await removeFromWishList(id)
            if (res && res.status) {
                this.getWishlist();
            }
            return
        }
        const res = await addToWishList(id);
        if (res && res.status) {
            this.getWishlist();
        }
    }


    render() {

        return (
            <AppContainer>
                <View style={{
                    flex: 1,
                    padding: spacer
                }}>
                    {
                        this.state.auction_list.length > 0 ?
                            <FlatList
                                data={this.state.auction_list}
                                keyExtractor={(I, i) => String(i)}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    const name = "make_name" in item ? item?.make_name[0]?.name : "";
                                    const model_name = "model_name" in item ? item?.model_name[0]?.name : "";
                                    const total_bid = "bid_data" in item && Array.isArray(item?.bid_data) ? item?.bid_data.length : 0;
                                    const isWishlist = this.state.wishListIds.includes(item?.id);

                                    return <CarAuctions
                                        start_price={item?.bid_price}
                                        end_price={item?.bid_closed_price}
                                        status={item?.used_type}
                                        name={name}
                                        model={model_name}
                                        startDate={item?.bid_start}
                                        endDate={item?.bid_end}
                                        total_bid={total_bid}
                                        image={item?.auction_image.length > 0 ? item?.auction_image[0]?.media_url : null}
                                        onPress={() => this.getAuctionDetail(item?.id)}
                                        wishlistOnPress={() => this.wishListOnPress(item?.id)}
                                        is_my_wishlist={isWishlist}
                                    />
                                }}
                            />
                            :
                            <AppNoDataFound
                                message={getLangText(TextKey.no_auction_found)}
                                Height={h(80)}
                            />
                    }
                </View>
            </AppContainer>
        )
    }
}

export default App;