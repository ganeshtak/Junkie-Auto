import React from "react";
import { View, Modal } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TextKey } from "../../Constant/Language";
import { getLangText } from "../../Store/Actions/LangAction";
import { spacer, w } from "../../Style/baseStyle";
import { AppButton } from '../../Utility/AppButton';

const delta = {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

export const SellerMapModel = ({
    latitude = 37.78825,
    longitude = -122.4324,
    address,
    backOnPress
}) => {

    React.useEffect(() => { }, [])
    const coords = {
        latitude,
        longitude,
        ...delta
    }

    if (latitude && longitude)
        return (
            <Modal
                animationType="slide"
            >
                <MapView
                    style={{ flex: 1, }}
                    initialRegion={coords}
                //scrollEnabled={false}
                >
                    <Marker
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude
                        }}

                    />

                </MapView>
                <ShowFooter
                    onPress={backOnPress}
                />
            </Modal>
        )
    return null
}


const ShowFooter = ({
    onPress
}) => {
    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            marginBottom: spacer,
            width: w(100),
        }}>
            <AppButton
                title={getLangText(TextKey.back)}
                onPress={onPress}
            />
        </View>
    )
}