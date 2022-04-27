import React from "react";
import { View, Text, StatusBar, FlatList, Platform, InteractionManager } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Icons } from "../../Asset/Icon";
import { colors, searchInputHeight, spacer, totalSize, w } from "../../Style/baseStyle";
import { AppButton, Button } from "../../Utility/AppButton";
import { LocationSearchInput } from './LocationSearchInput';
import { CarOffer } from '../../Utility/Card/CarOffer';
import { getAddressByLatLng, getCurrentLatLng } from '../../ServerCommunication/Location';
import { duration } from "moment";
import { auctionFilterByLocation } from '../Auctions/Utils';
import { getAuctionDetail } from '../Auctions/Utils';
import { ScreenTypes } from "../../Constant/Data";
import { SearchAddress } from './SearchAddress';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";

const StaticCoords = {
    latitude: 37.78825,
    longitude: -122.4324,
}

const Delta = {
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
}

class App extends React.Component {

    state = {
        coord: {
            latitude: 37.78825,
            longitude: -122.4324,
        },
        auctionList: [],
        addressPicker: false,
        address: "",
        from: "",
        newAuctionLocationData: undefined,
    }

    mapRef = undefined;

    componentDidMount() {
        this.getPrevScreenParams();
    }

    getPrevScreenParams = () => {
        if (this.props.route?.params) {
            const item = this.props.route?.params;
            this.setState({
                from: item?.from
            }, () => {
                this.getCurrentLocation();
            })
        }
        else {
            this.getCurrentLocation();
        }
    }

    getAuctionByLatLng = async (lat, lng) => {
        InteractionManager.runAfterInteractions(async () => {
            if (lat && lng) {
                const res = await auctionFilterByLocation(lat, lng);
                if (res && res.status) {
                    const list = "data" in res?.data ? res?.data?.data : [];
                    if (Array.isArray(list) && list.length > 0) {
                        this.setState({
                            auctionList: list,
                        });
                        return
                    }
                    else {
                        this.setState({
                            auctionList: [],
                        });
                        if (this.state.from !== ScreenTypes.addNewAuction) {
                            this.showMessage();
                        }
                    }
                }

            }
        })
    }

    showMessage = () => {
        ShowSnakeBar(getLangText(TextKey.no_auction_found))
    }

    onGoBack = () => {
        this.props.navigation.goBack();
    }

    getCurrentLocation = () => {
        getCurrentLatLng(async (coord) => {
            const cords = {
                latitude: coord?.lat,
                longitude: coord?.lng,
            }
            if (this.state.from == ScreenTypes.addNewAuction) {
                //only for new auction
                const addressObj = await this.findAddressByCoords(cords.latitude, cords.longitude);

                if (addressObj) {
                    this.setState({
                        address: addressObj?.address,
                        newAuctionLocationData: addressObj,
                        coord: cords
                    }, () => {
                        this.animateToRegion()
                    })
                }
            }
            else {
                this.setState({ coord: cords }, () => {
                    this.animateToRegion()
                })
            }
        })
    }

    animateToRegion = () => {
        this.getAuctionByLatLng(this.state.coord.latitude, this.state.coord.longitude);
        if (this.mapRef) {
            this.mapRef.fitToCoordinates([this.state.coord], {
                animated: true,
                edgePadding: {
                    top: 20,
                    bottom: 20,
                    left: 20,
                    right: 20,
                }
            });

        }
    }

    onPickAddress = (obj) => {
        if (obj) {
            const cords = {
                latitude: obj?.latitude,
                longitude: obj?.longitude
            }
            this.setState({
                coord: cords,
                address: obj?.address,
                newAuctionLocationData: obj,
            }, this.animateToRegion);
        }
    }

    onPickAddressForAuction = () => {
        if (this.state.newAuctionLocationData) {
            if (this.props.route?.params?.onPress) {
                this.props.route?.params?.onPress(this.state.newAuctionLocationData);
                this.props.navigation.goBack();
            }
            return
        }
        ShowSnakeBar(getLangText(TextKey.search_location_for_auction))
        return
    }

    findAddressByCoords = async (_lat, _lng) => {
        const res = await getAddressByLatLng({ lat: _lat, lng: _lng });
        if (res) {
            const obj = {
                latitude: _lat,
                longitude: _lng,
                address: res?.formatted_address,
                country: res?.address?.countery,
                city: res?.address?.city,
                state: res?.address?.state,
                coord: {
                    latitude: _lat,
                    longitude: _lng
                }
            }
            return obj
        }
        return undefined
    }

    onMarkerDragEnd = async (e) => {
        if (e) {
            const obj = await this.findAddressByCoords(e.nativeEvent.coordinate?.latitude, e.nativeEvent.coordinate?.longitude)
            if (obj) {
                this.setState({
                    coord: obj?.coord,
                    address: obj?.address,
                    newAuctionLocationData: obj
                }, () => {
                    this.animateToRegion();
                })
            }
        }
    }


    render() {

        return (
            <View style={{
                flex: 1,
            }}>
                <MapView

                    ref={(ref) => this.mapRef = ref}
                    style={{
                        flex: 1,
                    }}
                    // onLayout={() => {
                    //     this.animateToRegion();
                    // }}
                    initialRegion={{
                        ...this.state.coord,
                        ...Delta
                    }}
                    maxZoomLevel={15}
                >
                    <Marker
                        coordinate={{
                            ...this.state.coord
                        }}
                        draggable={true}
                        onDragEnd={(e) => {
                            this.onMarkerDragEnd(e)
                        }}
                    />
                </MapView>
                <View style={{
                    position: 'absolute',
                    top: spacer,
                    paddingHorizontal: spacer,
                    width: w(100)
                }}>
                    <LocationSearchInput
                        placeholder={getLangText(TextKey.search_location)}
                        backOnPress={this.onGoBack}
                        editable={false}
                        value={this.state.address}
                        searchOnPress={() => this.setState({ addressPicker: true })}
                        changeOnPress={() => this.setState({ addressPicker: true })}
                    />

                </View>

                <LocationPicker
                    onPress={() => {
                        this.getCurrentLocation();
                    }}
                />



                {
                    this.state.from == ScreenTypes.addNewAuction ? (
                        <View style={{
                            position: 'absolute',
                            bottom: spacer,
                            width: w(100),
                        }}>
                            <AppButton
                                title={getLangText(TextKey.Pick_Address)}
                                onPress={this.onPickAddressForAuction}
                            />
                        </View>
                    )
                        :
                        <View style={{
                            position: 'absolute',
                            bottom: spacer,
                        }} >
                            <FlatList
                                horizontal
                                contentContainerStyle={{
                                    paddingHorizontal: spacer
                                }}
                                showsHorizontalScrollIndicator={false}
                                ItemSeparatorComponent={() => <View style={{ width: spacer }} />}
                                data={this.state.auctionList}
                                renderItem={({ item }) => {
                                    const name = "make_name" in item ? item?.make_name[0]?.name : "";
                                    const model_name = "model_name" in item ? item?.model_name[0]?.name : "";
                                    const bidPrice = "bid_data" in item && item?.bid_data.length > 0 && item?.bid_data[item?.bid_data.length - 1]?.bid_amount;
                                    return <CarOffer
                                        startDate={item?.bid_start}
                                        name={name}
                                        model={model_name}
                                        endDate={item?.bid_end}
                                        status={item?.used_type}
                                        bid_price={bidPrice}
                                        image={item?.auction_image.length > 0 ? item?.auction_image[0]?.media_url : null}
                                        sale_price={item?.sale_price}
                                        onPress={() => getAuctionDetail(item?.id, ScreenTypes.all_auction_list)}
                                    />
                                }}
                            />
                        </View>
                }
                {
                    this.state.addressPicker && (
                        <SearchAddress
                            closeOnPress={() => this.setState({ addressPicker: false })}
                            onPickAddress={this.onPickAddress}
                        />
                    )
                }
            </View>
        )
    }
}

const LocationPicker = ({
    size = searchInputHeight,
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                width: size,
                height: size,
                borderRadius: size,
                backgroundColor: colors.red,
                position: 'absolute',
                right: spacer,
                top: Platform.OS == "android" ? StatusBar.currentHeight + searchInputHeight : spacer * 2 + searchInputHeight,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Icons.Location size={Platform.OS == "android" ? totalSize(2.8) : totalSize(3)} color={colors.white} />
        </Button>
    )
}

export default App;