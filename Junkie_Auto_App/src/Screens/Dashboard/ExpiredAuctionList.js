import React from "react";
import { View, Text, FlatList, ScrollView, Platform, RefreshControl } from 'react-native';
import { Icons } from '../../Asset/Icon';
import { TextKey } from "../../Constant/Language";
import { getLangText } from "../../Store/Actions/LangAction";
import { w, h, colors, totalSize, spacer } from '../../Style/baseStyle';
import { ExpiredAuction } from '../../Utility/Card/ExpiredAuction';



export const ExpiredAuctionList = ({
    list = [],
    onPress
}) => {

    const getDes = (item) => {
        if (item) {
            const name = "make_name" in item ? item?.make_name[0]?.name : "";
            const model_name = "model_name" in item ? item?.model_name[0]?.name : "";
            return `Your ${name} - ${model_name} ${getLangText(TextKey.post_has_been_expired_today)}`
        }
        return ""
    }
    return (
        <View style={{
            width: w(100),
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <FlatList
                data={list}
                horizontal
                keyExtractor={(I, i) => String(i)}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({ item, index }) => {
                    const title = getDes(item);

                    return <View style={{
                        width: w(100),
                    }}>
                        <ExpiredAuction
                            title={title}
                            image={item?.auction_image && item?.auction_image.length > 0 ? item?.auction_image[0]?.media_url : null}
                            onPress={() => onPress && onPress(item?.id)}
                        />
                    </View>
                }}
            />
        </View>
    )
}