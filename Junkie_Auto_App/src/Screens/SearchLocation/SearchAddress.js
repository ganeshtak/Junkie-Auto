import React from 'react';
import { View, Text, Modal, FlatList, TextInput, StyleSheet, Keyboard } from 'react-native';
import { colors, Font, FontSize, h, shadow, spacer } from '../../Style/baseStyle';
import { Button } from '../../Utility/AppButton';
import { getAddressList, getAddressById } from '../../ServerCommunication/GoogleApiRequest';
import { getAddressByLatLng } from '../../ServerCommunication/Location';
import { getLangText } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';



export const SearchAddress = ({
    closeOnPress,
    onPickAddress,
}) => {

    const [addressList, setAddressList] = React.useState([]);

    const getAddresses = async (txt) => {
        const res = await getAddressList(txt);
        console.log("============res==============", res, txt);
        setAddressList(res);
    }

    const onAddressPress = async (id) => {
        Keyboard.dismiss();
        const res = await getAddressById(id);
        const addr = res?.formatted_address;
        const coord = res?.geometry?.location;
        const addressData = await getAddressByLatLng({ lat: coord?.lat, lng: coord?.lng, spinner: false });
        const obj = {
            latitude: coord?.lat,
            longitude: coord?.lng,
            address: addressData?.formatted_address,
            country: addressData?.address?.countery,
            city: addressData?.address?.city,
            state: addressData?.address?.state,
            addr: addr,
        }
        onPickAddress && onPickAddress(obj);
        closeOnPress && closeOnPress();
    }

    return (
        <Modal
            animationType='slide'
            onRequestClose={closeOnPress}
        >
            <View style={{
                flex: 1,
                marginTop: spacer
            }}>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: spacer,
                }}>
                    <View style={{ flex: 1, }}>
                        <TextInput
                            style={{
                                ...styles.inputStyle,
                                color: colors.gray
                            }}
                            autoFocus
                            placeholder={getLangText(TextKey.Search)}
                            onChangeText={getAddresses}
                            placeholderTextColor={colors.gray}
                        />
                    </View>
                    <View style={{
                        paddingLeft: spacer * .5
                    }}>
                        <RenderButton
                            onPress={closeOnPress}
                        />
                    </View>
                </View>
                <FlatList
                    data={addressList}
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{
                        paddingHorizontal: spacer
                    }}
                    renderItem={({ item, index }) => {
                        return <AddressItem
                            address={item?.description}
                            onPress={() => {
                                onAddressPress(item?.place_id);
                            }}
                        />
                    }}
                />
            </View>
        </Modal>
    )
}

const AddressItem = ({
    address = "Hello",
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                paddingVertical: spacer * .5
            }}>
            <Text style={{
                fontSize: FontSize.md,
                fontFamily: Font.regular,
                color: colors.black
            }}>{address}</Text>
        </Button>
    )
}

const RenderButton = ({
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                ...styles.inputStyle,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text style={{
                color: colors.gray
            }}>
                {getLangText(TextKey.cancel)}
            </Text>
        </Button>
    )
}

const Height = h(5.5);


const styles = StyleSheet.create({
    inputStyle: {
        borderColor: colors.lightWhite,
        borderWidth: 1,
        borderRadius: 10,

        height: Height,
        paddingHorizontal: spacer,
        ...shadow[0],
        backgroundColor: colors.white
    }
})