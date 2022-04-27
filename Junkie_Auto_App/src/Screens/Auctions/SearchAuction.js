import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import {
    colors,
    h,
    spacer,
    totalSize,
    w,
} from '../../Style/baseStyle';
import { AppTextInput } from '../../Utility/AppTextInput';
import { AppContainer } from '../../Utility/AppContainer';
import { AppButton } from '../../Utility/AppButton';
import {
    getAuctionFilterList, getCurrentAddressFromLatLng,
    addNewAuction,
    getAllCarCategory,
    getSubCategory,
    getSearchQuery,
    auctionFilterByQuery,
    saveSearch,
    updateSearch
} from '../Auctions/Utils';
import { OptionPicker } from '../../Utility/Modal/OptionPicker';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { MSG } from '../../Constant/Message';
import { YearModel } from '../../Utility/Modal/YearModel';
import { AppDatePicker } from '../../Utility/AppDatePicker';
import moment from 'moment';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { NewAuctionProperty, ScreenTypes } from '../../Constant/Data';
import { setSpinner } from '../../Store/Actions/SpinnerAction';
import { UserConstant } from '../../Constant/AppConstant';
import { getLangText } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';


const iconSize = totalSize(1.9)


class App extends React.Component {
    state = {
        data: [],
        optionsList: [],
        selectedOptionField: undefined,
        optionPicker: false,

        //fields
        // for make and model
        all_make: [],
        make: "",
        make_id: "",
        model: "",
        model_id: "",
        from: "",
        id: undefined,
    }

    componentDidMount() {
        this.getPostData();
    }

    getPostData = async () => {
        if (this.props.route?.params) {
            setSpinner(true)
            const res = await Promise.all([
                getAuctionFilterList(false),
                getAllCarCategory(false),
            ]);
            setSpinner(false)
            if (res.length > 0) {
                const filterList = res[0];
                const carCategory = res[1];

                const itemData = this.props.route?.params;
                const options = itemData?.data?.other;
                const selectedMake = itemData?.data?.make;
                const selectedModel = itemData?.data?.model;

                //for make
                let make = undefined;
                if (selectedMake) {
                    const index = carCategory.findIndex((item) => item?.name == selectedMake);
                    if (index > -1) {
                        make = carCategory[index];
                    }
                }

                let model = undefined;
                if (make && selectedModel) {
                    const carSubcategory = await getSubCategory(make?.id);
                    if (carSubcategory && carSubcategory.length > 0) {
                        const index = carSubcategory.findIndex((item) => item?.name == selectedModel);
                        if (index > -1) {
                            model = carSubcategory[index];
                        }
                    }
                }


                //this is for Other filter options
                const result = [];
                console.log(JSON.stringify(options))
                filterList.map((item) => {
                    const index = options.findIndex((i) => {
                        return i?.type == item?.type
                    })
                    if (index > -1) {
                        result.push(options[index])
                    }
                    else {
                        result.push(item)
                    }
                })
                this.setState({
                    data: result,
                    make: make ? make?.name : "",
                    make_id: make ? make?.id : "",
                    model: model ? model?.name : "",
                    model_id: model ? model?.id : "",
                    from: this.props.route?.params?.from,
                    id: itemData?.data?.id
                });
            }
        }
        else {
            const res = await getAuctionFilterList(true);
            this.setState({ data: res });
        }

        // const res = await getAuctionFilterList(false);
        // if (this.props.route?.params) {

        // const itemData = this.props.route?.params;
        // const options = itemData?.data?.other;
        // const result = [];
        // console.log(JSON.stringify(options))
        // res.map((item) => {
        //     const index = options.findIndex((i) => {
        //         return i?.type == item?.type
        //     })
        //     if (index > -1) {
        //         result.push(options[index])
        //     }
        //     else {
        //         result.push(item)
        //     }
        // })
        // this.setState({ data: result });
        // }
        // else {
        //     this.setState({ data: res });
        // }

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
        this.setState({ data }, () => { })
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
                text2: getLangText(TextKey.ok),
            });
        }
    }

    optionsNotFound = () => {
        AlertMessage({
            title: getLangText(TextKey.not_available),
            message: getLangText(TextKey.options_not_found),
            text1: "",
            text2: getLangText(TextKey.ok),
        })
    }

    renderPostFiled = () => {
        return (
            <View style={{
                marginBottom: UserConstant.user_id == undefined ? h(10) : this.state.from == ScreenTypes.savedSearch ? h(25) : h(17),
            }}>
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
                this.optionsNotFound()
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
                this.optionsNotFound()
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

    }

    checkValidation = () => {
        let isValid = false;
        if (this.state.make) {
            return true
        }
        if (this.state.model) {
            return true
        }
        if (this.state.data.length > 0) {
            for (let i = 0; i < this.state.data.length; i++) {
                const item = this.state.data[i];
                if (item?.value) {
                    isValid = true;
                    break;
                }
            }
        }

        return isValid
    }

    getPropertyId = (type, getName = false) => {
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

    getQuery = (getName = false) => {
        const qry = getSearchQuery({
            damage_type: this.getPropertyId(NewAuctionProperty.damage_type.type, getName),
            secondary_damage_type: this.getPropertyId(NewAuctionProperty.secondary_damage_type.type, getName),
            drive_line_type: this.getPropertyId(NewAuctionProperty.driveLine_type.type, getName),
            body_type: this.getPropertyId(NewAuctionProperty.body_type.type, getName),
            transmission: this.getPropertyId(NewAuctionProperty.transmission.type, getName),
            color: this.getPropertyId(NewAuctionProperty.color.type, getName),
            fuel_type: this.getPropertyId(NewAuctionProperty.fuel.type, getName),
            used_type: this.getPropertyId(NewAuctionProperty.used_type.type, getName),
            catalytic_convertor: this.getPropertyId(NewAuctionProperty.catalytic_convertor.type, getName),
            make: getName ? this.state.make : this.state.make_id,
            model: getName ? this.state.model : this.state.model_id,
        });
        return qry
    }

    searchOnPress = async () => {
        const isValid = this.checkValidation();

        if (isValid) {
            const query = this.getQuery();
            if (query) {
                const res = await auctionFilterByQuery(query);
                console.log(res);
                if (res && res.status) {
                    const list = Array.isArray(res?.data?.data) ? res?.data?.data : [];

                    if (list.length > 0) {
                        this.props.navigation.navigate('SearchAuctionList', {
                            Form: ScreenTypes.search_auction,
                            data: list
                        });
                    }
                    else {
                        ShowSnakeBar(getLangText(TextKey.no_auction_found))
                    }
                }
            }
            return
        }
        ShowSnakeBar(getLangText(TextKey.Select_any_search_filter_to_save))
    }

    saveOnPress = async () => {
        const isValid = this.checkValidation();
        if (isValid) {
            const query = this.getQuery(true);
            if (query) {
                const res = await saveSearch(query);

                if (res && res.status) {
                    ShowSnakeBar(getLangText(TextKey.Your_search_is_saved_successfully))
                }
            }
            return
        }
        ShowSnakeBar(getLangText(TextKey.Select_any_search_filter_to_save))
    }

    updateOnPress = async () => {
        if (this.state.id) {
            const query = this.getQuery(true);
            if (query) {
                const res = await updateSearch(this.state.id, query);
                //console.log(res);
                this.props.navigation.goBack();
            }
        }
    }

    render() {


        if (this.state.data.length == 0) {
            return null
        }
        return (
            <AppContainer>
                <View
                    style={{
                        flex: 1,
                    }}>
                    <ScrollView
                        contentContainerStyle={{
                            padding: spacer,
                        }}>
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
                    </ScrollView>
                    <View
                        style={{
                            position: 'absolute',
                            width: w(100),
                            bottom: 0,
                            backgroundColor: colors.white,
                            paddingVertical: spacer,
                        }}>
                        <AppButton
                            title={getLangText(TextKey.Search)}
                            onPress={this.searchOnPress}
                        />
                        {UserConstant.user_id ? (
                            <View
                                style={{
                                    marginTop: spacer,
                                }}>
                                <AppButton
                                    title={
                                        this.state.from == ScreenTypes.savedSearch
                                            ? `${getLangText(TextKey.Save_as_new)}`
                                            : `${getLangText(TextKey.SearchButtonSave)}`
                                    }
                                    onPress={this.saveOnPress}
                                />
                            </View>
                        ) : null}
                        {this.state.from == ScreenTypes.savedSearch && (
                            <View
                                style={{
                                    marginTop: spacer,
                                }}>
                                <AppButton
                                    title={getLangText(TextKey.Update)}
                                    onPress={this.updateOnPress}
                                />
                            </View>
                        )}
                    </View>
                </View>

                {this.state.optionPicker && (
                    <OptionPicker
                        closeOnPress={() => this.setState({ optionPicker: false })}
                        itemOnPress={this.onPickOptionItem}
                        list={this.state.optionsList}
                        title={getLangText(TextKey.Select_Option)}
                    />
                )}
            </AppContainer>
        );
    }
}

export default App;