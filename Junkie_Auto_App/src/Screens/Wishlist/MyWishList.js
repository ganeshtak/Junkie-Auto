import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import {
    colors,
    h,
    spacer,
    totalSize,
    w,
} from '../../Style/baseStyle';
import { AppTextInput } from '../../Utility/AppTextInput';
import { AppContainer } from '../../Utility/AppContainer';
import { AppButton } from '../../Utility/AppButton';
import {
    getAuctionDetail
} from '../Auctions/Utils';
import { NewAuctionProperty, ScreenTypes } from '../../Constant/Data';
import { removeFromWishList, getWishList } from './Utils';
import { CarAuctions } from '../../Utility/Card/CarAuctions';
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { getLangText } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';


class App extends React.Component {
    state = {
        wishlist: [],
    }

    componentDidMount() {
        // this.props.navigation.setOptions({ headerTitle: 'Updated!' })
        this.getWishlist()
    }

    getWishlist = async () => {
        const res = await getWishList(false);
        if (res) {
            this.setState({ wishlist: res })
        }
    }

    getAuctionDetail = async (id) => {
        const res = await getAuctionDetail(id, ScreenTypes.all_auction_list);
    }
    wishListOnPress = async (id) => {
        const res = await removeFromWishList(id)
        if (res && res.status) {
            this.getWishlist();
        }
        return
    }


    render() {
        if (this.state.wishlist.length == 0) {
            return <AppNoDataFound
                message={getLangText(TextKey.no_auction_added_to_wishlist)}
                Height={h(90)}
            />
        }
        return (
            <AppContainer>
                <View style={{
                    flex: 1,
                    paddingHorizontal: spacer
                }}>

                    <FlatList
                        data={this.state.wishlist}
                        keyExtractor={(I, i) => String(i)}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item, index }) => {

                            const name = "make_name" in item ? item?.make_name[0]?.name : "";
                            const model_name = "model_name" in item ? item?.model_name[0]?.name : "";
                            const total_bid = "bid_data" in item && Array.isArray(item?.bid_data) ? item?.bid_data.length : false;


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
                                is_my_wishlist={true}
                            />
                        }}
                    />

                </View>
            </AppContainer>
        )
    }
}


export default App;