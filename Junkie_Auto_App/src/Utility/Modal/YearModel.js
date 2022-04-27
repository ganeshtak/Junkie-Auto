import React from "react";
import { View, Text, Modal, FlatList, SafeAreaView, } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, FontSize, h, shadow, spacer, w } from "../../Style/baseStyle";
import { AppHeading } from '../AppHeading';
import { AuctionSortTypes, DocType } from '../../Constant/Data';
import { AppButton, Button } from "../AppButton";
import { AppTextInput } from '../AppTextInput';
import { AppStatusBar } from "../AppStatusBar";






const getRandomYear = (min = 2000, max = new Date().getFullYear()) => {
    const diff = max - min;
    const year = [];
    const list = Array(diff).fill(1);

    list.map((ite, index) => {
        const y = min + index;
        year.push(y);
        if (list.length - 1 == index) {
            year.push(max)
        }
    });
    return year.reverse();
}

export const YearModel = ({
    closeOnPress,
    itemOnPress,
    list = getRandomYear(1950),
    placeholder = "Search Year",
    keyboardType = "numeric",
    itemType = "string" || "object"
}) => {

    const [yearList, setYear] = React.useState(list);

    React.useEffect(() => {

    }, []);



    const onYearPress = (item) => {
        itemOnPress && itemOnPress(item)
        closeOnPress && closeOnPress();
    }

    const onSearch = (year) => {
        const res = list.filter((item) => {
            const title = itemType == "string" ? item : item?.name;
            const isFound = String(title).toLocaleLowerCase().match(String(year).trim().toLocaleLowerCase());
            return isFound
        })
        setYear(res);
    }


    return (
        <Modal
            visible={true}
            animationType="slide"
            transparent
        >
            <AppStatusBar />
            <SafeAreaView style={{
                flex: 1,
                backgroundColor: colors.white,
                //padding: spacer
            }}>
                <View style={{
                    width: w(100),
                    backgroundColor: colors.white,
                    ...shadow[1],
                }}>
                    <AppTextInput
                        bottom={0}
                        placeholder={placeholder}
                        keyboardType={keyboardType}
                        onChangeText={onSearch}
                    />
                </View>
                <FlatList
                    data={yearList}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item }) => {
                        const title = itemType == "string" ? item : item?.name;
                        return <RenderYearItem
                            title={title}
                            onPress={() => onYearPress(item)}
                        />
                    }}
                />
                <BottomButton
                    backOnPress={closeOnPress}
                />
            </SafeAreaView>
        </Modal>
    )
}

const BottomButton = ({
    backOnPress,
}) => {
    return (
        <View style={{
            marginVertical: spacer,
        }}>
            <AppButton
                title="Back"
                onPress={backOnPress}
            />
        </View>
    )
}


const RenderYearItem = ({ title, onPress }) => {
    return (
        <Button
            onPress={onPress}
            style={{
                paddingVertical: spacer * .5,
                borderBottomColor: colors.lightWhite,
                borderBottomWidth: 1,
                paddingHorizontal: spacer
            }}>
            <Text style={{
                fontFamily: Fonts.regular,
                color: colors.black,
                fontSize: FontSize.mdl
            }}>{title}</Text>
        </Button>
    )
}