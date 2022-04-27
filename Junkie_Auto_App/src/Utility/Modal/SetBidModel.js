import React from "react";
import { View, Text, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, Font, FontSize, shadow, spacer, w } from "../../Style/baseStyle";
import { AppHeading } from '../AppHeading';
import { AuctionStatus, BidBuyTypes } from '../../Constant/Data';
import { AppButton, Button } from "../AppButton";
import { AppTextInput } from '../../Utility/AppTextInput';
import { Price_Format } from '../../Constant/Helper/PriceFormat';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { MSG } from '../../Constant/Message';
import { getLangText } from "../../Store/Actions/LangAction";
import { English, languageCode, Spanish, TextKey } from "../../Constant/Language";
import { AppConstant } from "../../Constant/AppConstant";



export const SetBidModel = ({
    closeOnPress,
    minBid = 100,
    doneOnPress,
    title = "",
    bidType,

}) => {

    const Title = bidType == BidBuyTypes.pre_bid ? getLangText(TextKey.current_pre_bid) : getLangText(TextKey.minimum_bid)

    const [bidPrice, setBidPrice] = React.useState("");

    const closeModel = () => {
        closeOnPress && closeOnPress()
    }

    const showMessage = () => {
        msg = AppConstant.selected_lang == languageCode.en ? English.your_bid_greater(minBid) : Spanish.your_bid_greater(minBid)
        AlertMessage({
            title: getLangText(TextKey.error),
            message: msg,
            text1: "",
            text2: getLangText(TextKey.ok)
        });
    }

    const setBidOnPress = () => {
        if (bidPrice <= minBid) {
            showMessage();
        }
        else {
            closeModel();
            setTimeout(() => {
                doneOnPress && doneOnPress(bidPrice);
            }, 10)
        }
    }

    return (
        <Modal
            transparent
            animationType='slide'
        >
            <Button
                activeOpacity={1}
                onPress={closeModel}
                style={{
                    flex: 1,
                    backgroundColor: colors.model,
                }}>
                <KeyboardAvoidingView style={{
                    position: 'absolute',
                    width: w(100),
                    //height: 500,
                    backgroundColor: colors.white,
                    bottom: 0,
                    padding: spacer,
                    ...shadow[2],
                }}
                    behavior={Platform.OS == "android" ? "" : "padding"}
                >
                    <AppHeading
                        title={Title}
                        fontSize={FontSize.lg * .8}
                    />
                    <View style={{
                        marginTop: spacer * .5
                    }}>
                        <AppTextInput
                            placeholder={getLangText(TextKey.minimum_bid)}
                            value={Price_Format(minBid)}
                            editable={false}
                        />
                    </View>

                    <AppHeading
                        title={getLangText(TextKey.Your_bid)}
                        fontSize={FontSize.lg * .8}
                    />
                    <View style={{
                        marginTop: spacer * .5
                    }}>
                        <AppTextInput
                            placeholder={getLangText(TextKey.set_your_bid_here)}
                            value={bidPrice}
                            onChangeText={(price) => { setBidPrice(price) }}
                            keyboardType="numeric"
                        />
                    </View>

                    <View>
                        <AppButton
                            title={getLangText(TextKey.set_bid)}
                            onPress={setBidOnPress}
                        />
                    </View>
                    <View style={{
                        marginTop: spacer
                    }}>
                        <Text style={{
                            fontSize: FontSize.md,
                            fontFamily: Font.regular, color: colors.red,
                            textAlign: 'center'
                        }}>
                            * A $60 will be deducted if you win the auction
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </Button>
        </Modal>
    )
}