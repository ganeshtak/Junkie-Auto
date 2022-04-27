import React from "react";
import { View, Text, Modal, FlatList } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, FontSize, h, shadow, spacer, w } from "../../Style/baseStyle";
import { AppHeading } from '../AppHeading';
import { AuctionSortTypes, DocType } from '../../Constant/Data';
import { Button } from "../AppButton";
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";




export const OptionPicker = ({
    list = DocType,
    closeOnPress,
    itemOnPress,
    title = getLangText(TextKey.select_document_type)
}) => {
    const headerTitle = () => {
        return (
            <View style={{
                alignItems: 'center'
            }}>
                <AppHeading
                    title={title}
                    fontSize={FontSize.mdl}
                    fontFamily={Fonts.bold}
                />
            </View>
        )
    }

    const selectItem = (item) => {
        itemOnPress && itemOnPress(item)
        closeOnPress && closeOnPress();
    }

    return (
        <Modal
            transparent
            onRequestClose={closeOnPress}
        >
            <Button
                activeOpacity={1}
                onPress={closeOnPress}
                style={{
                    flex: 1,
                    backgroundColor: colors.model,
                    justifyContent: 'center'
                }}>
                <View style={{
                    width: w(100),
                    height: h(100),
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute'
                }}>
                    <View style={{
                        backgroundColor: colors.white,
                        ...shadow[1],
                        marginHorizontal: spacer,
                        borderRadius: 10,
                        paddingVertical: spacer,
                        width: '90%',
                    }}>
                        <FlatList
                            ListHeaderComponent={headerTitle}
                            data={list}
                            renderItem={({ item, index }) => {
                                const title = typeof item == "object" && "name" in item ? item?.name : "value" in item ? item?.value : item;
                                return <OptionItem
                                    title={title}
                                    onPress={() => selectItem(item)}
                                />
                            }}
                        //ItemSeparatorComponent={() => <View style={{ height: spacer }} />}
                        />
                    </View>
                </View>
            </Button>
        </Modal>
    )
}

const OptionItem = ({
    title,
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                paddingHorizontal: spacer,
                //backgroundColor: colors.red,
                paddingVertical: spacer * .5
            }}>
            <Text style={{
                fontFamily: Fonts.regular,
                color: colors.black,
                fontSize: FontSize.mdl * .8
            }}>{title}</Text>
        </Button>
    )
}