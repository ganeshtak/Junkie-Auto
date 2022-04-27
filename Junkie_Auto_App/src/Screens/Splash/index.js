import React from "react";
import { View, Text, Button, StyleSheet, Image, InteractionManager, Animated, ActivityIndicator, Platform } from 'react-native';
import { setAppStatus } from '../../Store/Actions/UserAction';
import { w, MAXWIDTH, h, MAXHEIGHT, totalSize, Font, colors, FontSize, spacer } from "../../Style/baseStyle";
import { setSpinner } from '../../Store/Actions/SpinnerAction';
import { Icons } from '../../Asset/Icon';
import { Fonts } from "../../Asset/Font";
import { AppButton } from "../../Utility/AppButton";
import { AppContainer } from "../../Utility/AppContainer";
import { getAsync } from '../../Store/Actions/UserAction';
import { setAppLang, getLangText, lang_code } from '../../Store/Actions/LangAction';
import { Store } from "../../Store";
import { TextKey } from '../../Constant/Language';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { callNotification, NotificationOnPress } from '../../Constant/notification';
import { EventRegister, EventType } from "../../Constant/EventRegister";
import { getAppStorage } from "../../Store/AsyncStorage/AsyncStorage";


const ShowActivity = () => {
    return (
        <View style={{
            marginBottom: spacer
        }}>
            <ActivityIndicator
                size="large"
                color={colors.red}
            />
        </View>
    )
}

class App extends React.Component {

    state = {
        activity: false,
        selectedLangCode: undefined,
    }

    scale = new Animated.Value(0);

    componentDidMount() {
        this.getLanguage();
        EventRegister.on(EventType.notificationClick, (notification) => {
            if (Platform.OS == "ios") {
                if (notification && notification?.userInteraction == true) {
                    console.log("----------hi from event=============", notification);
                    NotificationOnPress(notification);
                    return
                    getAsync(undefined, false, (status) => {
                        this.setState({ activity: status });

                    });
                }
            }
            else {
                console.log("----------hi from event=============", notification);
                getAsync(undefined, false, (status) => {
                    this.setState({ activity: status });
                    NotificationOnPress(notification);
                });
            }
        })
        callNotification()
        //showAndroidNotification("hello", "hi")
        //ShowSnakeBar("You are registered")
        this.startAnimation(1)
    }



    getLanguage = async () => {
        const res = await getAppStorage();
        if (typeof res == "string") {
            this.setState({
                selectedLangCode: res
            })
            return
        }
        else if (typeof res == "object" && res?.app_lang) {
            this.setState({
                selectedLangCode: res?.app_lang
            })
            return
        }
    }

    componentWillUnmount() {
        EventRegister.rm(EventType.notificationClick);
    }

    startAnimation = (value = 1) => {
        Animated.spring(this.scale, {
            toValue: value,
            useNativeDriver: true,
            delay: 100,
            stiffness: 100,
        }).start();
    }

    goToNext = () => {
        getAsync(undefined, false, (status) => {
            this.setState({ activity: status });
        });
    }

    onStarted = () => {

        this.goToNext();
        // setAppLang(lang_code.sp);
        // console.log(Store.getState().UserReducer)
    }

    renderComponent = () => {
        const scale = this.scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            //extrapolate: 'clamp',
        })

        return (
            <Animated.View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale }]
            }}>
                <Image
                    style={{
                        width: totalSize(21),
                        height: totalSize(21),
                        resizeMode: 'contain'
                    }}
                    source={require('../../Asset/Image/app_logo.png')}
                />
                {/* <Icons.AppLogo size={totalSize(21)} /> */}
            </Animated.View>
        )
    }

    render() {
        return (
            <AppContainer>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.white
                    }}
                >
                    {this.renderComponent()}

                    <View style={{
                        position: 'absolute',
                        bottom: totalSize(2)
                    }}>
                        {
                            this.state.activity && (
                                <ShowActivity />
                            )
                        }
                        <AppButton
                            title={this.state.selectedLangCode == lang_code.sp ? "Empezar" : "Get started"}
                            onPress={this.onStarted}
                        />
                    </View>
                </View>
            </AppContainer>
        )
    }
}


export default App

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.regular,
        color: colors.black,
        fontSize: FontSize.xlg,
        letterSpacing: 1,
        marginTop: 5,
    }
})