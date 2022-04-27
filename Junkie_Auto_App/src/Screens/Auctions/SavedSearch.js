import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import {
    colors,
    FontSize,
    h,
    spacer,
    totalSize,
    w,
} from '../../Style/baseStyle';
import { AppTextInput } from '../../Utility/AppTextInput';
import { AppContainer } from '../../Utility/AppContainer';
import { AppButton, Button } from '../../Utility/AppButton';
import {
    getSavedSearch,
    saveSearch,
    deleteSearch,
    getAuctionFilterList
} from '../Auctions/Utils';
import { OptionPicker } from '../../Utility/Modal/OptionPicker';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { MSG } from '../../Constant/Message';
import { YearModel } from '../../Utility/Modal/YearModel';
import { AppDatePicker } from '../../Utility/AppDatePicker';
import moment from 'moment';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { NewAuctionProperty, ScreenTypes } from '../../Constant/Data';
import { SwipableItem } from '../../Utility/SwipeableItem';
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { Header } from '../../Utility/AuctionHeader';
import { IconButton } from '../../Utility/IconButton';
import { getLangText } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';
import { AppConstant } from '../../Constant/AppConstant';


class App extends React.Component {

    state = {
        search: [],
        filter: [],
        list: [], //for search input
    }

    componentDidMount() {
        //this.removeSearch(7);
        this.getMySearch();
        this.subscribe = this.props.navigation.addListener('focus', () => {
            this.getMySearch();
        })
    }

    componentWillUnmount() {
        this.subscribe();
    }

    getJson = (str) => {
        const obj = JSON.stringify(String(str));
        return JSON.parse(JSON.parse(obj));
    }

    getFilterData = (filter = [], data = []) => {
        let res = [];
        if (data.length > 0) {
            data.map((item) => {
                const types = Object.keys(item?.json);
                let data = undefined;
                const result = [];
                types.map((i) => {
                    const id = item?.json[i];
                    data = this.findFilterType(filter, i, id);
                    const obj = {
                        ...data,
                    }
                    result.push(obj);
                });

                res.push({
                    ...item,
                    optionsData: result
                })

            })
        }

        if (res.length > 0) {
            this.setState({
                search: res,
                list: res,
            })
        }
    }

    findFilterType = (filter = [], type, value_id) => {

        let selected = undefined;
        for (let i = 0; i < filter.length; i++) {
            const item = filter[i];
            if (String(item?.type).toLocaleLowerCase() == String(type).toLocaleLowerCase()) {
                selected = item;
                break;
            }
        }

        if (selected) {
            const obj = {};
            obj['name'] = selected?.name;
            obj['type'] = selected?.type;
            obj['options'] = selected?.options;
            obj['value'] = value_id;
            obj['child_id'] = this.getValueName(selected?.options, value_id);
            return obj;
        }
        return undefined;
    }

    getValueName = (list = [], value) => {
        let name = undefined;
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (String(item?.name) == String(value)) {
                name = item?.id;
                break;
            }
        }
        return name
    }

    getMySearch = async () => {
        const filter = await getAuctionFilterList();
        const res = await getSavedSearch();
        if (filter && res && res?.status) {
            const data = res?.data.map((item) => {
                const d = this.getJson(item?.search);
                const arr = typeof d == "object" ? Object.values(d) : [];
                if (arr.length > 0) {
                    arr.shift();
                }
                const obj = {};
                obj['id'] = item?.id;
                obj['data'] = arr.join(', ')
                obj['json'] = d;
                return obj
            });
            this.getFilterData(filter, data)

        }
        // const res = await getSavedSearch();
        // if (res && res.status) {

        //     const data = res?.data.map((item) => {
        //         const d = this.getJson(item?.search);
        //         const obj = {};
        //         obj['id'] = item?.id;
        //         obj['data'] = typeof d == "object" ? Object.values(d).join(', ') : "";
        //         obj['json'] = d;
        //         return obj
        //     })

        //     this.setState({
        //         search: data
        //     });
        // }
    }

    removeSearch = async (id) => {
        const res = await deleteSearch(id)
        await this.getMySearch();
        // if (res && res.status) {
        //     this.getMySearch();
        // }
    }

    onSearchPress = (item) => {

        const obj = {
            make: "make" in item?.json ? item?.json?.make : undefined,
            model: "model" in item?.json ? item?.json?.model : undefined,
            other: item?.optionsData,
            id: item?.id,
        }
        this.props.navigation.navigate('SearchAuction', { data: obj, from: ScreenTypes.savedSearch });
    }

    removeOnPress = (id) => {
        AlertMessage({
            title: getLangText(TextKey.remove),
            message: getLangText(TextKey.remove_item),
            text1: getLangText(TextKey.no),
            text2: getLangText(TextKey.yes)
        }, () => {
            if (id) {
                this.removeSearch(id);
                const res = this.state.search.filter((item) => item?.id !== id);
                this.setState({
                    search: res,
                });
            }
        })

    }

    search = (txt) => {
        if (txt == "") {
            this.setState({
                search: this.state.list,
            });
            return
        }
        const res = this.state.list.filter((item) => {
            if (item && String(item?.data).toLocaleLowerCase().match(String(txt).toLocaleLowerCase())) {
                return true
            }
            return false
        })
        this.setState({
            search: res
        })
    }

    render() {

        return (
            <AppContainer>
                <View style={{
                    flex: 1,
                    //padding: spacer
                }}>
                    {
                        this.state.list.length > 0 && (
                            <Header
                                placeholder={getLangText(TextKey.search_saved_searches)}
                                onChangeText={this.search}
                            />
                        )
                    }
                    {
                        this.state.search.length > 0 ?
                            <FlatList
                                contentContainerStyle={{
                                    paddingHorizontal: spacer
                                }}
                                data={this.state.search}
                                ItemSeparatorComponent={() => <View style={{ height: spacer }} />}
                                renderItem={({ item }) => {

                                    return <SwipableItem
                                        swipeOnPress={() => this.removeOnPress(item?.id)}
                                    >
                                        <SavedSearchCard
                                            title={item?.data}
                                            onPress={() => {
                                                this.onSearchPress(item);
                                            }}
                                            editOnPress={() => {
                                                this.onSearchPress(item);
                                            }}
                                            removeOnPress={() => {
                                                this.removeOnPress(item?.id)
                                            }}
                                        />
                                    </SwipableItem>
                                }}
                            />
                            :
                            <AppNoDataFound
                                message={getLangText(TextKey.not_search_history_found)}
                                Height={h(80)}
                            />
                    }

                </View>

            </AppContainer>
        )
    }
}



export default App;



const SavedSearchCard = ({ title = "Used Lexus 2019",
    onPress,
    iconSize = totalSize(2),
    iconColor = colors.gray,
    removeOnPress,
    editOnPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                ...styles.searchContainer
            }}>
            <Text style={{
                ...styles.text,
                width: '80%'
            }} numberOfLines={1}>{title}</Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <IconButton
                    icon={<Icons.EditIcon size={iconSize} color={iconColor} />}
                    size={totalSize(3)}
                    onPress={editOnPress}
                />
                <IconButton
                    icon={<Icons.DeleteIcon size={iconSize} color={iconColor} />}
                    size={totalSize(3)}
                    leftSpace={spacer * .5}
                    onPress={removeOnPress}
                />
            </View>
        </Button>
    )
}




const styles = StyleSheet.create({
    searchContainer: {
        borderRadius: 5,
        borderColor: colors.lightWhite,
        borderWidth: 1,
        padding: spacer * .5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    text: {
        fontFamily: Fonts.regular,
        color: colors.black,
        fontSize: FontSize.md
    }
})