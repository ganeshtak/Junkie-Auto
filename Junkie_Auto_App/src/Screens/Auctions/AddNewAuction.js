import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    InteractionManager,
    RefreshControl,
} from 'react-native';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import {
    colors,
    h,
    spacer,
    totalSize,
} from '../../Style/baseStyle';
import { AppTextInput } from '../../Utility/AppTextInput';
import { AppContainer } from '../../Utility/AppContainer';
import { AppButton, Button } from '../../Utility/AppButton';
import { NewAuctionFieldType, NewAuctionProperty, ScreenTypes } from '../../Constant/Data';
import { AppHorizontalImages } from '../../Utility/AppHorizontalImages';
import { ImagePickerModel } from '../../Utility/Modal/ImagePickerModel';
import {
    getAuctionFilterList, getCurrentAddressFromLatLng,
    addNewAuction,
    getAllCarCategory,
    getSubCategory,
    removeAuctionImage,
    updateAuction
} from '../Auctions/Utils';
import { OptionPicker } from '../../Utility/Modal/OptionPicker';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { MSG } from '../../Constant/Message';
import { YearModel } from '../../Utility/Modal/YearModel';
import { AppDatePicker, getCustomDate } from '../../Utility/AppDatePicker';
import moment from 'moment';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { AppHeader } from '../../Utility/AppHeader';
import { getLangText } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';

const iconSize = totalSize(1.9);



class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            from: "",
            id: "", // auction id
            data: [],
            optionsList: [],
            selectedOptionField: undefined,


            // for auction images
            images: [], // for local image
            auction_images: [], // for http images from edit post


            imagePickerModel: false,
            optionPicker: false,
            yearModel: false,
            dateModel: false,

            //fields
            // for make and model
            all_make: [],
            make: "",
            make_id: "",
            model: "",
            model_id: "",

            milage: "",
            location: "",
            startPrice: "",
            endPrice: "",
            salePrice: "",
            lat: "",
            lng: "",
            country: "",
            state: "",
            city: "",
            add_info: "",
            vin: "",
            year: "",
            startDate: "",
            endDate: "",
            titleStatus: "",
            cleanTitle: "",
            timeFrame: "",
        }
    }

    componentDidMount() {

        this.getPostData();
        //this.getAllCarCategory()
    }

    getAllCarCategory = async () => {
        const res = await getAllCarCategory();
        if (res) {
            this.onFieldPress(res, true)
        }
        else {
            this.optionsNotFound();
        }
    }

    getModelByCategory = async () => {
        if (this.state.make_id) {
            const res = await getSubCategory(this.state.make_id);
            if (res) {
                this.onFieldPress(res, false, true)
            }
            else {
                this.optionsNotFound();
            }
        }
        else {
            AlertMessage({
                title: "",
                message: getLangText(TextKey.First_select_make_option),
                text1: "",
                text2: getLangText(TextKey.ok)
            });
        }
    }

    getPostData = async () => {
        if (this.props.route.params) {
            const item = this.props.route.params;
            this.setState({
                ...this.state,
                ...item?.data,
                from: item?.from
            });
            return
        }
        const res = await getAuctionFilterList({ state: this.state.data });
        console.log(JSON.stringify(res))
        this.setState({ data: res });
    }

    optionsNotFound = () => {
        AlertMessage({
            title: getLangText(TextKey.not_available),
            message: getLangText(TextKey.options_not_found),
            text1: "",
            text2: getLangText(TextKey.ok)
        })
    }



    onFieldPress = (item, forMake = false, forModel = false) => {

        //only for make
        if (forMake) {
            if (item.length > 0) {
                this.setState({
                    optionsList: item,
                    selectedOptionField: NewAuctionProperty.make.type,
                    optionPicker: true,
                })
            }
            else {
                this.optionsNotFound();
            }
            return
        }

        //only for model
        if (forModel) {
            if (item.length > 0) {
                this.setState({
                    optionsList: item,
                    selectedOptionField: NewAuctionProperty.model.type,
                    optionPicker: true,
                })
            }
            else {
                this.optionsNotFound();
            }
            return
        }

        if (item && item?.options.length > 0) {
            this.setState({
                optionsList: item?.options,
                selectedOptionField: item?.name,
                optionPicker: true,
            })
        }
        else {
            this.optionsNotFound();
        }

        // if (item?.type == "year") {
        //     //open picker for date
        //     this.setState({
        //         yearModel: true,
        //         selectedOptionField: item?.type,
        //     });
        //     return
        // }

        // // for location

        // if (item?.type == NewAuctionProperty.location.type) {
        //     this.getLocation()
        //     return
        // }

        // if (item?.options && item?.options.length > 0) {
        //     this.setState({
        //         optionsList: item?.options,
        //         selectedOptionField: item?.type,
        //         optionPicker: true,
        //     });
        // }
        // else {

        // }
    }

    renderPostFiled = () => {
        return (
            <View>
                {
                    this.state.data.map((item, index) => {

                        return <AppTextInput
                            key={String(`key-${index}`)}
                            placeholder={item?.name}
                            editable={false}
                            value={item?.value}
                            onPress={() => this.onFieldPress(item)}
                            iconOnPress={() => this.onFieldPress(item)}
                            icon={<Icons.Document size={iconSize} />}
                        />
                    })
                }
            </View>
        )
    }

    onPickImages = (img) => {
        if (Array.isArray(img)) {
            const images = [...this.state.auction_images, ...img];
            this.setState({ auction_images: images });
        }
    }

    onImageRemove = async (item, index) => {

        AlertMessage({
            title: getLangText(TextKey.remove),
            message: getLangText(TextKey.remove_auction_image),
            text1: getLangText(TextKey.no),
            text2: getLangText(TextKey.yes),
        }, async () => {
            if ("media_url" in item) {
                const res = await removeAuctionImage(true, item?.id);
                const img = this.state.auction_images.filter((_item) => _item?.id !== item?.id);
                console.log(res);
                this.setState({
                    auction_images: img
                });
                return
            }

            const images = this.state.auction_images.filter((I, i) => i !== index);
            this.setState({ auction_images: images })
        })

    }

    onPickOptionItem = (selectedItem) => {
        //value set for make
        if (this.state.selectedOptionField == NewAuctionProperty.make.type) {
            this.setState({
                make: selectedItem?.name,
                make_id: selectedItem?.id,
            });
            return
        }
        //value set for model
        if (this.state.selectedOptionField == NewAuctionProperty.model.type) {
            this.setState({
                model: selectedItem?.name,
                model_id: selectedItem?.id,
            });
            return
        }

        this.setOptionsValue(selectedItem);
    }

    setOptionsValue = (Item) => {
        let data = this.state.data;
        data.map((item, index) => {
            if (item?.name == this.state.selectedOptionField) {
                data[index].value = Item?.name;
                data[index].child_id = Item?.id;
            }
        });
        this.setState({ data }, () => { console.log("state======", this.state.data) })
    }

    onYearPress = (year) => {
        this.setState({
            year
        })
    }

    getLocation = () => {
        this.props.navigation.navigate('SearchLocation', {
            from: ScreenTypes.addNewAuction, onPress: (obj) => {
                if (obj) {
                    this.setState({
                        location: obj?.address,
                        lat: obj?.latitude,
                        lng: obj?.longitude,
                        state: obj?.state,
                        city: obj?.city,
                        country: obj?.country
                    });
                }
            }
        });
        // this.setState({ selectedOptionField: NewAuctionProperty.location.type });
        // getCurrentAddressFromLatLng((address, coord, city, state, country) => {
        //     if (address) {
        //         InteractionManager.runAfterInteractions(() => {
        // this.setState({
        //     location: address,
        //     lat: coord?.lat,
        //     lng: coord?.lng,
        //     state: state,
        //     city: city,
        //     country: country
        // });
        //         })
        //     }
        // });
    }



    isEmpty = (iState) => {
        if (["", undefined, null].includes(iState)) {
            return true
        }
        else {
            return false
        }
    }
    checkValidation = () => {
        if (this.state.auction_images.length == 0) {
            this.showMessage(getLangText(TextKey.Select_auction_images));

            return false
        }


        if (this.isEmpty(this.state.make)) {
            this.showMessage(getLangText(TextKey.Make_is_required));
            return false
        }
        else if (this.isEmpty(this.state.model)) {
            this.showMessage(getLangText(TextKey.Model_is_required));
            return false
        }
        else if (this.state.data.length > 0) {
            let selectedItem = undefined
            for (let i = 0; i < this.state.data.length; i++) {
                const item = this.state.data[i];
                if (!item?.value) {
                    selectedItem = item;
                    break;
                }
            }
            if (selectedItem) {
                this.showMessage(
                    `${selectedItem?.name} ${getLangText(TextKey.is_required)}`,
                );
                return false
            }
        }

        if (this.isEmpty(this.state.location)) {
            this.showMessage(getLangText(TextKey.Location_is_required));
            return false
        }
        else if (this.isEmpty(this.state.milage)) {
            this.showMessage(getLangText(TextKey.Milage_is_required));

            return false
        }
        else if (this.isEmpty(this.state.vin)) {
            this.showMessage(getLangText(TextKey.VIN_is_required));

            return false
        }
        else if (this.isEmpty(this.state.year)) {
            this.showMessage(getLangText(TextKey.Year_is_required));

            return false;
        }
        // else if (this.isEmpty(this.state.startDate)) {
        //     this.showMessage("Start date is required");
        //     return false
        // }
        else if (this.isEmpty(this.state.endDate)) {
            this.showMessage(getLangText(TextKey.End_date_is_required));
            return false;
        } else if (this.isEmpty(this.state.startPrice)) {
            this.showMessage(getLangText(TextKey.Start_price_is_required));
            return false;
        } else if (this.isEmpty(this.state.salePrice)) {
            this.showMessage(getLangText(TextKey.Sale_price_is_required));
            return false;
        } else if (this.state.salePrice) {
            if (parseInt(this.state.salePrice) <= parseInt(this.state.startPrice)) {
                this.showMessage(getLangText(TextKey.Sale_price_greater));
                return false;
            }
        }
        return true
    }

    showMessage = (msg) => {
        ShowSnakeBar(msg);
        // AlertMessage({
        //     title: "Required",
        //     message: msg,
        //     text1: "",
        //     text2: "ok"
        // });
    }


    onPostPress = async () => {
        const validationTrue = await this.checkValidation();

        if (validationTrue) {
            const form = await this.getPrams();
            const res = await addNewAuction({ data: form });
            console.log(form, res);

            if (res && res.status) {
                ShowSnakeBar(getLangText(TextKey.Auction_added_successfully));
                this.props.navigation.goBack();
            }
        }
    }

    updateOnPress = async () => {
        const validationTrue = await this.checkValidation();
        if (validationTrue) {
            const form = await this.getPrams();
            const res = await updateAuction(true, this.state.id, form);
            if (res) {
                ShowSnakeBar(getLangText(TextKey.Auction_updated_successfully));
                this.props.navigation.goBack();
            }
        }
    }

    getParamData = (type, getName = false) => {
        let currentData = undefined;

        for (let i = 0; i < this.state.data.length; i++) {
            const item = this.state.data[i];
            if (item?.type == type) {
                currentData = item;
                break;
            }
        }

        if (currentData) {
            if (currentData?.child_id)
                if (getName)
                    return currentData?.value;
                else
                    return currentData?.child_id;
            else
                return ""
        }
        return "";
    }



    getPrams = () => {
        const form = new FormData();

        //Dynamic fields

        // form.append("used_type", this.getParamData(NewAuctionProperty.status.type));
        form.append("used_type", this.getParamData(NewAuctionProperty.used_type.type));
        form.append("bid_start", moment(new Date()).format('YYYY-MM-DD'));
        form.append("bid_end", this.state.endDate);
        form.append("make", this.state.make_id);
        form.append("model", this.state.model_id);
        form.append("year", this.state.year);
        form.append("drive_line_type", this.getParamData(NewAuctionProperty.driveLine_type.type));
        form.append("body_type", this.getParamData(NewAuctionProperty.body_type.type));
        form.append("fuel_type", this.getParamData(NewAuctionProperty.fuel.type));
        form.append("damage_type", this.getParamData(NewAuctionProperty.damage_type.type));
        form.append("transmission", this.getParamData(NewAuctionProperty.transmission.type));
        form.append("color", this.getParamData(NewAuctionProperty.color.type));
        form.append("secondary_damage_type", this.getParamData(NewAuctionProperty.secondary_damage_type.type));
        form.append("catalytic_convertor", this.getParamData(NewAuctionProperty.catalytic_convertor.type));
        form.append("clean_title", this.getParamData(NewAuctionProperty.clean_title.type));
        form.append("title_status", this.getParamData(NewAuctionProperty.title_status.type));

        //local fields
        form.append("mileage", this.state.milage);

        form.append("vin", this.state.vin);
        form.append("engine", 1);
        form.append("details", this.state.add_info);
        form.append("address", this.state.location);
        form.append("city", this.state.city);
        form.append("state", this.state.state);
        form.append("country", this.state.country);
        form.append("lat", this.state.lat);
        form.append("lng", this.state.lng);
        form.append("bid_price", this.state.startPrice);
        form.append("sale_price", this.state.salePrice);
        form.append("bid_closed_price", this.state.salePrice);



        //for images
        if (this.state.auction_images.length > 0) {
            this.state.auction_images.map((item, index) => {
                if ("uri" in item) {
                    form.append(`image_file[${index}]`, item);
                }
            })
        }
        //form.append("video_file[]", "");
        return form
    }



    onPickDate = (date) => {
        const _date = moment(date, "DD-MM-YYYY").format('YYYY-MM-DD');
        if (this.state.selectedOptionField == NewAuctionProperty.end_date.type) {
            this.setState({
                endDate: _date
            })
            return
        }
        this.setState({
            startDate: _date
        })
    }


    render() {
        const allImages = [...this.state.auction_images, ...this.state.images];
        if (this.state.data.length == 0) {
            return null
        }
        return (
            <AppContainer>
                <AppHeader
                    title={
                        this.state.from == ScreenTypes.editAuction
                            ? `${getLangText(TextKey.Update_Auction)}`
                            : `${getLangText(TextKey.Profile_Post_New_Auction)}`
                    }
                />
                <KeyboardAvoidingView style={{ flex: 1 }} behavior="height">
                    <ScrollView
                        style={styles.container}
                        showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                flex: 1,
                                paddingHorizontal: totalSize(2),
                                //alignItems: 'center'
                                marginTop: spacer,
                            }}>
                            <View
                                style={{
                                    //marginVertical: spacer
                                    marginBottom: spacer * 0.1,
                                }}>
                                <AppTextInput
                                    placeholder={getLangText(TextKey.Auction_Photos_Video)}
                                    centerIcon={<Icons.CameraIcon size={totalSize(3)} />}
                                    onPress={() => this.setState({ imagePickerModel: true })}
                                    Height={h(10)}
                                    editable={false}
                                    textAndIconAlignCenter={true}
                                />
                            </View>

                            {allImages.length > 0 && (
                                <AppHorizontalImages
                                    docs={allImages}
                                    removeOnPress={this.onImageRemove}
                                />
                            )}

                            {this.state.imagePickerModel && (
                                <ImagePickerModel
                                    galleryOnPress={this.onPickImages}
                                    cameraOnPress={this.onPickImages}
                                    closeOnPress={() =>
                                        this.setState({ imagePickerModel: false })
                                    }
                                />
                            )}

                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Make)}
                                value={this.state.make}
                                editable={false}
                                onPress={this.getAllCarCategory}
                            />
                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Model)}
                                value={this.state.model}
                                editable={false}
                                onPress={this.getModelByCategory}
                            />

                            {this.renderPostFiled()}

                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Location)}
                                value={this.state.location}
                                onChangeText={location => this.setState({ location })}
                                icon={
                                    <Icons.Document size={iconSize} color={colors.gray} />
                                }
                                editable={false}
                                iconOnPress={this.getLocation}
                                onPress={this.getLocation}
                            />

                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Milage)}
                                value={this.state.milage}
                                onChangeText={milage => this.setState({ milage })}
                                keyboardType="numeric"
                                animateLabel={false}
                            />
                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Vin)}
                                value={this.state.vin}
                                onChangeText={vin => this.setState({ vin })}
                                animateLabel={false}
                            />
                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Year)}
                                value={this.state.year}
                                editable={false}
                                onPress={() => this.setState({ yearModel: true })}
                                icon={
                                    <Icons.Document size={iconSize} color={colors.gray} />
                                }
                            />
                            {/* <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Start_Date)}
                                value={this.state.startDate}
                                editable={false}
                                onPress={() =>
                                    this.setState({
                                        dateModel: true,
                                        selectedOptionField: NewAuctionProperty.start_date.type,
                                    })
                                }
                            /> */}
                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_End_Date)}
                                placeholder={getLangText(TextKey.time_frame)}
                                value={this.state.endDate}
                                editable={false}
                                onPress={() =>
                                    this.setState({
                                        dateModel: true,
                                        selectedOptionField: NewAuctionProperty.end_date.type,
                                    })
                                }
                                icon={<Icons.CalenderIcon size={totalSize(2)} color={colors.gray} />}
                            />

                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Start_Price)}
                                value={this.state.startPrice}
                                onChangeText={startPrice => this.setState({ startPrice })}
                                keyboardType="numeric"
                                animateLabel={false}
                            />

                            {/* <AppTextInput
                                placeholder="End price"
                                value={this.state.endPrice}
                                onChangeText={(endPrice) => this.setState({ endPrice })}
                                keyboardType="numeric"
                                animateLabel={false}
                            /> */}

                            <AppTextInput
                                placeholder={getLangText(TextKey.Sale_Price)}
                                value={this.state.salePrice}
                                onChangeText={salePrice => this.setState({ salePrice })}
                                keyboardType="numeric"
                                animateLabel={false}
                            />

                            {/* <AppTextInput
                                placeholder="Title status"
                                value={this.state.titleStatus}
                                onChangeText={(titleStatus) => this.setState({ titleStatus })}
                            />
                            <AppTextInput
                                placeholder="Clean title"
                                value={this.state.cleanTitle}
                                onChangeText={(cleanTitle) => this.setState({ cleanTitle })}
                            /> */}

                            <AppTextInput
                                placeholder={getLangText(TextKey.Auction_Add_Info)}
                                Height={h(12)}
                                additionalInfoInput
                                value={this.state.add_info}
                                onChangeText={add_info => this.setState({ add_info })}
                                animateLabel={false}
                            />
                            <View
                                style={{
                                    marginVertical: totalSize(2),
                                }}>
                                {this.state.from == ScreenTypes.editAuction ? (
                                    <AppButton
                                        title={getLangText(TextKey.Update_Auction)}
                                        onPress={this.updateOnPress}
                                    />
                                ) : (
                                    <AppButton
                                        title={getLangText(TextKey.POST_Auction)}
                                        onPress={this.onPostPress}
                                    />
                                )}
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
                {this.state.optionPicker && (
                    <OptionPicker
                        closeOnPress={() => this.setState({ optionPicker: false })}
                        itemOnPress={this.onPickOptionItem}
                        list={this.state.optionsList}
                        title={getLangText(TextKey.Select_Option)}
                    />
                )}
                {this.state.yearModel && (
                    <YearModel
                        closeOnPress={() => this.setState({ yearModel: false })}
                        itemOnPress={this.onYearPress}
                    />
                )}
                {this.state.dateModel && (
                    <AppDatePicker
                        cancelOnPress={() => this.setState({ dateModel: false })}
                        doneOnPress={this.onPickDate}
                        minDate={new Date()}
                        //minDate={getCustomDate({ month: -1, dateRef: true })}
                        maxDate={getCustomDate({ month: 1, dateRef: true })}
                    />
                )}
            </AppContainer>
        );
    }
}
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },

    button: {
        // alignItems: "center",
        backgroundColor: '#000EFF',
        height: 64,
        marginHorizontal: 40,
        borderRadius: 10,
        marginVertical: 30,
        padding: 10,
    },
    textRegisterButton: {
        fontFamily: Fonts.regular,
        fontSize: 20,
        textAlign: 'center',
        paddingTop: 8,
        color: colors.white,
    },
});
