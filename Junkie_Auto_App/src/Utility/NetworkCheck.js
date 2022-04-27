import React from "react";
import NetInfo from '@react-native-community/netinfo';
import { View, Text, Modal } from 'react-native';
import { colors, shadow, spacer, w } from "../Style/baseStyle";
import { Fonts } from "../Asset/Font";
import { AppConstant } from "../Constant/AppConstant";
import FastImage from "react-native-fast-image";
import { getLangText, TextKey } from '../Store/Actions/LangAction';


export const NetworkCheck = ({
    height = 50,
}) => {

    const [isNetworkConnected, setNetwork] = React.useState(true);

    React.useEffect(() => {
        NetInfo.fetch().then((res) => {
            updateNetworkState(res.isConnected)
        })

        const unsubscribe = NetInfo.addEventListener(state => {
            updateNetworkState(state.isConnected)
        });

        return () => {
            unsubscribe();
        }
    }, [isNetworkConnected]);

    const updateNetworkState = (status) => {
        setNetwork(status);
        AppConstant.isNetworkConnected = status;
    }

    if (isNetworkConnected)
        return null
    return (
        <Modal>
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <FastImage
                    source={require('../Asset/Image/network.gif')}
                    style={{
                        width: w(50),
                        height: w(50),
                    }}
                    resizeMode="contain"
                />
                <Text>
                    {getLangText(TextKey.No_internet_connect)}
                </Text>
            </View>
        </Modal>
    )
}