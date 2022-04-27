import React from "react";
import { View, Image, ScrollView } from 'react-native';
import { Icons } from "../Asset/Icon";
import { colors, w, h, totalSize, shadow, spacer } from '../Style/baseStyle';
import { Button } from "./AppButton";
import { getImageUrl } from '../Constant/Helper/ImageUrl';


export const AppHorizontalImages = ({
    docs = [],
    removeOnPress,
    size = h(15),
    showRemove = true,
    onPress,
}) => {
    const RenderItem = ({ url, removeOnPress, showRemove, onPress }) => {
        return (
            <Button
                onPress={() => {
                    onPress && onPress(url)
                }}
                style={{
                    width: size,
                    height: size,
                    borderRadius: 10,
                    backgroundColor: colors.white,
                    ...shadow[1],
                    marginRight: spacer,
                    marginBottom: 2,
                    marginLeft: 2,
                }}>
                <Image
                    style={{
                        flex: 1,
                        resizeMode: 'cover',
                        borderRadius: 10,

                    }}
                    source={{ uri: url }}
                />

                {
                    showRemove ?
                        <Button
                            onPress={removeOnPress}

                            style={{
                                position: 'absolute',
                                right: 0,
                                padding: spacer * .3,
                                top: 3,
                            }}>
                            <Icons.CrossIcon size={totalSize(3)} color={colors.red} />
                        </Button>
                        :
                        null
                }
            </Button>
        )
    }
    return (
        <ScrollView
            horizontal
            style={{
                marginBottom: spacer * 2 * .6
            }}
        >
            {
                docs.map((item, index) => {
                    const url = "media_url" in item ? getImageUrl(item?.media_url) : "document_url" in item ? getImageUrl(item?.document_url) : item?.uri;
                    return <RenderItem
                        url={url}
                        key={String(index)}
                        removeOnPress={() => {
                            removeOnPress && removeOnPress(item, index);
                        }}
                        showRemove={showRemove}
                        onPress={onPress}
                    />
                })
            }
        </ScrollView>
    )
}