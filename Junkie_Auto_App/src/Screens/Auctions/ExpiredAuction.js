import React from "react";
import { View, Text, FlatList, RefreshControl, ScrollView, InteractionManager } from 'react-native';
import { colors, FontSize, h, spacer } from "../../Style/baseStyle";
import { AppContainer } from '../../Utility/AppContainer';
import { AppHeading } from '../../Utility/AppHeading';
import { Header } from '../../Utility/AuctionHeader';
import { AppGridButton } from '../../Utility/AppGridButton';
import { CarAuctions } from '../../Utility/Card/CarAuctions';
import { getAuction, getMyAuctionDetail } from './Utils';
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { MSG } from '../../Constant/Message';
import { getAuctionDetail, getMyExpiredAuctions } from '../Auctions/Utils';
import { ScreenTypes, } from '../../Constant/Data';
import { getWishList, addToWishList, removeFromWishList } from '../Wishlist/Utils';
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";





class App extends React.Component {
    state = {
        auction: [],
    }

    componentDidMount() {
        this.getExpireAuction();
    }

    getExpireAuction = async () => {
        const res = await getMyExpiredAuctions(true);
        if (res) {
            this.setState({
                auction: res,
            });
            return
        }
        this.setState({
            auction: [],
        });
    }

    getAuctionDetail = async (id) => {
        const res = await getMyAuctionDetail(id, ScreenTypes.myAuction);
    }

    render() {
        return (
            <AppContainer>
                <View style={{
                    flex: 1,
                    paddingHorizontal: spacer,
                }}>
                    {
                        this.state.auction.length > 0 ?
                            <FlatList
                                data={this.state.auction}
                                keyExtractor={(I, i) => String(i)}
                                //scrollEnabled={false}
                                nestedScrollEnabled
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => {
                                    const name = "make_name" in item ? item?.make_name[0]?.name : "";
                                    const total_bid = "bid_data" in item && Array.isArray(item?.bid_data) ? item?.bid_data.length : false;
                                    const bid_data = "bid_data" in item && item?.bid_data;
                                    return <CarAuctions
                                        onPress={() => this.getAuctionDetail(item?.id)}
                                        start_price={item?.bid_price}
                                        end_price={item?.bid_closed_price}
                                        status={item?.used_type}
                                        name={name}
                                        startDate={item?.bid_start}
                                        endDate={item?.bid_end}
                                        total_bid={total_bid}
                                        bid_data={bid_data}
                                        image={item?.auction_image.length > 0 ? item?.auction_image[0]?.media_url : null}
                                        Status={item?.status}
                                        cancel_reason={item?.cancel_reason}

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