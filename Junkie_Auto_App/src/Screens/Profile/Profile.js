import React from "react";
import { View, Text, FlatList, Platform } from 'react-native';
import { AppContainer } from '../../Utility/AppContainer';
import { Icons } from '../../Asset/Icon';
import { colors, FontSize, h, shadow, spacer, totalSize, w } from "../../Style/baseStyle";
import { AppHeading } from '../../Utility/AppHeading';
import { Button } from '../../Utility/AppButton';
import { AppConstant, UserConstant } from "../../Constant/AppConstant";
import { Fonts } from "../../Asset/Font";

import { logoutFromApp, setAppStatus } from '../../Store/Actions/UserAction';
import { MSG } from '../../Constant/Message';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { ProfileTypes, ScreenTypes } from '../../Constant/Data';
import { isUserLogged } from '../../Constant/Helper/UserHelper';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'
import FastImage from "react-native-fast-image";
import { Store } from "../../Store";
import { ProgressImage } from '../../Utility/ProgressImage';
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";
import { ProfileData } from './Utils';

const iconSize = totalSize(2.6);
const iconColor = colors.red;
const LogoutType = "LogoutType";


export const ProfileHeader = ({
    maskHeight = Platform.OS == "android" ? h(40) : h(45),
    headerHeight = h(6),
    closeOnPress,
    image,
    backOnPress,
    title = getLangText(TextKey.profile),
    editOnPress,
    isImageEditable = false
}) => {
    const focus = useIsFocused();
    const [userImage, setImage] = React.useState(image);

    Store.subscribe(() => {
        setImage(Store.getState().UserReducer.userImage);
    })

    React.useEffect(() => {

    }, [userImage])

    const navigation = useNavigation();

    return (
        <View>
            <View style={{
                top: -maskHeight * .3,
                position: 'absolute',
                transform: [{ scale: Platform.OS == "android" ? 1.1 : 1 }],

            }}>
                <Icons.ProfileMask size={maskHeight} color={colors.primary} />
            </View>

            <View style={{
                width: w(100),
                height: headerHeight,
                position: 'absolute',
                //backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                borderColor: colors.lightWhite,
                borderBottomWidth: .5,
            }}>
                <AppHeading
                    title={title}
                    color={colors.white}

                />
                {
                    closeOnPress ?
                        <Button
                            onPress={closeOnPress}
                            style={{
                                position: 'absolute',
                                right: 0,
                                marginRight: spacer,
                                transform: [{ scale: 0.8 }]
                            }}>
                            <Icons.CrossIcon size={totalSize(2.5)} color={colors.white} />
                        </Button>
                        :
                        null
                }
                {
                    backOnPress ?
                        <Button
                            onPress={backOnPress}
                            style={{
                                position: 'absolute',
                                left: spacer,
                                //transform: [{ scale: 0.8 }]
                            }}>
                            <Icons.BackIcon size={totalSize(2.5)} color={colors.white} />
                        </Button>
                        :
                        null
                }
            </View>

            <View style={{
                top: Platform.OS == "ios" ? headerHeight + AppConstant.statusbar_height + 20 : headerHeight + AppConstant.statusbar_height / 2,
                width: w(100),
                position: 'absolute',
                paddingHorizontal: spacer
            }}>
                <ProfileHeaderDetail
                    loginOnPress={() => {
                        AppConstant.isParentScreenProfile = true;
                        navigation.navigate("AuthNavigator", { screen: "Login" });
                        // navigation.navigate("Login", { from: ScreenTypes.profile });
                    }}
                    registerOnPress={() => {
                        AppConstant.isParentScreenProfile = true;
                        navigation.navigate("AuthNavigator", { screen: "Register" });
                    }}
                    image={isImageEditable ? image : userImage}
                    editOnPress={editOnPress}
                />
            </View>

        </View>
    )
}

const ProfileHeaderDetail = ({
    circleSize = totalSize(8),
    name = `${UserConstant.f_name} ${UserConstant.l_name}`,
    email = UserConstant.email,
    loginOnPress,
    registerOnPress,
    image,
    editOnPress
}) => {
    const isUserLogin = UserConstant.user_id;

    const ImageView = ({ onPress }) => {
        return (
            <Button
                onPress={onPress}
                activeOpacity={1}
                style={{
                    backgroundColor: colors.primary,
                    borderRadius: circleSize,
                    width: circleSize,
                    height: circleSize,
                    borderColor: colors.lightWhite,
                    borderWidth: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    //overflow: "hidden",

                }}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {
                        image && image !== "file:///" ?
                            <ProgressImage
                                style={{
                                    //flex: 1,
                                    width: circleSize,
                                    height: circleSize,
                                    borderRadius: circleSize,
                                    borderColor: colors.lightWhite,
                                    borderWidth: 2,
                                }}
                                resizeMode="cover"
                                //source={{ uri: image }}
                                uri={image}
                            />
                            :
                            <Icons.ProfileIcon size={totalSize(Platform.OS == "android" ? 2.9 : 3.2)} color={colors.white} />
                    }

                </View>
                {
                    editOnPress ?
                        <Button
                            onPress={editOnPress}
                            style={{
                                width: circleSize * .4,
                                height: circleSize * .4,
                                backgroundColor: colors.white,
                                borderRadius: 50,
                                position: 'absolute',
                                bottom: 0,
                                right: -spacer * .3,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            <Icons.ProfileEditIcon size={totalSize(1.8)} color={colors.red} />
                        </Button>
                        :
                        null
                }
            </Button>
        )
    }
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
            <ImageView
                onPress={() => {
                    if (UserConstant.user_id) {
                        AppConstant.navigation &&
                            AppConstant.navigation.navigate('EditProfile');
                    }
                }}
            />

            {isUserLogin ? (
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: spacer,
                    }}>
                    <Text
                        style={{
                            fontFamily: Fonts.regular,
                            fontSize: FontSize.lg * 0.8,
                            color: colors.white,
                            textTransform: 'capitalize',
                        }}
                        numberOfLines={1}>
                        {name}
                    </Text>
                    <Text
                        style={{
                            fontFamily: Fonts.regular,
                            fontSize: FontSize.md,
                            color: colors.lightWhite,
                        }}>
                        {email}
                    </Text>
                </View>
            ) : (
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: spacer,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <RowText
                        title={getLangText(TextKey.Login)}
                        onPress={loginOnPress}
                    />
                    <RowText title=" / " />
                    <RowText
                        title={getLangText(TextKey.Register)}
                        onPress={registerOnPress}
                    />
                </View>
            )}
        </View>
    );
}

const RowText = ({ title, onPress }) => {
    return (
        <Button onPress={onPress}>
            <Text style={{
                fontFamily: Fonts.regular,
                fontSize: FontSize.lg,
                color: colors.white
            }}>{title}</Text>
        </Button>
    )
}

const ProfileItem = ({
    title, icon,
    circleSize = totalSize(4.5),
    onPress,
    leftSpace = totalSize(.5),
    topSpace = totalSize(0),
    textColor
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                paddingHorizontal: spacer,
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: spacer
            }}>
            <View style={{
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize,
                backgroundColor: 'rgba(0,0,0,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    left: leftSpace,
                    top: topSpace,
                }}>
                    {icon && icon}
                </View>
            </View>

            <View style={{ flex: 1, paddingHorizontal: spacer }}>
                <Text style={{
                    fontSize: FontSize.mdl,
                    color: textColor ? textColor : colors.black,
                    fontFamily: Fonts.regular,
                    top: -2
                }}>{title}</Text>
            </View>
        </Button>
    )
}




class AuctionList extends React.Component {

    state = {
        demo: "",
    }

    componentDidMount() {

        this.subscribe = this.props.navigation.addListener('focus', () => {
            this.setState({ demo: "" })
        })
    }

    componentWillUnmount() {
        this.subscribe();
    }

    loginMessage = (msg = getLangText(TextKey.you_need_to_login_first), title = getLangText(TextKey.required)) => {
        AlertMessage({
            title,
            message: msg,
            text1: "",
            text2: getLangText(TextKey.ok)
        })
    }

    profileItemOnPress = (item) => {
        //For verified user
        if (item?.isLoginRequired) {

            if (UserConstant.user_id == undefined) {
                this.loginMessage();
            }
            else {
                if (item?.isUserVerificationRequired) {
                    isUserLogged((res) => {
                        if (res && item?.screen) {
                            this.props.navigation.navigate(item?.screen)
                        }
                    })
                    return
                }
                else {
                    this.props.navigation.navigate(item?.screen)
                }
            }
            return
        }


        if (item?.isUserVerificationRequired) {
            isUserLogged((res) => {
                if (res && item?.screen) {
                    this.props.navigation.navigate(item?.screen)
                }
            })
            return
        }


        if (item?.type == ProfileTypes.logout) {
            AlertMessage({
                title: getLangText(TextKey.Profile_Logout),
                message: getLangText(TextKey.logout),
                text1: getLangText(TextKey.no),
                text2: getLangText(TextKey.yes),
            }, () => {
                logoutFromApp();
            })
        }
        else {
            if (item?.screen) {
                this.props.navigation.navigate(item?.screen)
            }
        }
    }

    onGoBack = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <AppContainer>
                <ProfileHeader
                    closeOnPress={this.onGoBack}
                    image={UserConstant.user_image}
                />
                <View style={{
                    flex: 1,
                    marginTop: Platform.OS == "android" ? h(30) : h(32),
                    paddingBottom: spacer
                }}>
                    <FlatList
                        data={ProfileData}
                        renderItem={({ item, index }) => {
                            // if (item?.isLoginRequired) {
                            //     if (UserConstant.user_id == undefined) {
                            //         return null
                            //     }
                            // }
                            if (UserConstant.user_id == undefined && index == ProfileData.length - 1) {
                                return null
                            }

                            if (UserConstant.user_id == undefined && item?.type == ProfileTypes.expiredAuction) {
                                return null
                            }

                            if (item?.type == ProfileTypes.expiredAuction && Store.getState().DashboardReducer.expired_auctions.length == 0) {
                                return null
                            }

                            return <ProfileItem
                                title={item?.title}
                                icon={item?.icon}
                                onPress={() => {
                                    this.profileItemOnPress(item)
                                }}
                                leftSpace={item?.leftSpace}
                                topSpace={item?.topSpace}
                                textColor={item?.textColor}

                            />
                        }}
                    />
                </View>
            </AppContainer>
        )
    }
}


export default AuctionList;