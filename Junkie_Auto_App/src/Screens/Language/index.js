import React from "react";
import { View, Text, FlatList, Animated } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, FontSize, spacer, w } from '../../Style/baseStyle';
import { AppContainer } from '../../Utility/AppContainer';
import { Button, AppButton } from '../../Utility/AppButton';
import { languageCode } from '../../Constant/Language';
import { setAppLang } from '../../Store/Actions/LangAction';

const Data = [
    {
        name: 'English',
        // code: setAppLang(languageCode.en),

        code: languageCode.en
    },
    {
        name: 'Spanish',
        // code: setAppLang(languageCode.sp),

        code: languageCode.sp
    },
    // {
    //     name: "عربي",
    //     code: languageCode.ar
    // }
];

class App extends React.Component {
    state = {
        selectedLang: undefined,
        selectedCode: undefined,
    }

    animValue = new Animated.Value(0);

    onLangPress = (item) => {
        if (item) {
            this.setState({
                selectedLang: item?.name,
                selectedCode: item?.code,
            }, this.startAnimation)
        }
    }

    startAnimation = (value = 1) => {
        Animated.timing(this.animValue, {
            toValue: value,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }

    renderBottomView = () => {
        const translate = this.animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0],
            extrapolate: 'clamp',
        })
        return (
            <Animated.View style={{
                position: 'absolute',
                bottom: spacer,
                width: w(100),
                transform: [{ translateY: translate }]
            }}>
                <AppButton
                    title={this.state.selectedCode == languageCode.en ? "Continue" : "Continuar"}
                    onPress={this.continueOnPress}
                />
            </Animated.View>
        )
    }

    continueOnPress = () => {
        if (this.state.selectedCode) {
            setAppLang(this.state.selectedCode)
        }
    }

    render() {
        return (
            <AppContainer>
                <View style={{
                    flex: 1,
                    paddingHorizontal: spacer,
                    backgroundColor: colors.white
                }}>
                    <FlatList
                        data={Data}
                        keyExtractor={(I, i) => String(i)}
                        ItemSeparatorComponent={() => <View style={{ height: spacer }} />}
                        renderItem={({ item, index }) => {
                            return <LanguageCard
                                title={item?.name}
                                isSelected={this.state.selectedLang == item?.name}
                                onPress={() => {
                                    this.onLangPress(item)
                                }}
                            />
                        }}
                    />
                </View>
                {this.renderBottomView()}
            </AppContainer>
        )
    }
}


const LanguageCard = ({
    title,
    isSelected = true,
    onPress
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                padding: spacer * .6,
                alignItems: 'center',
                borderColor: colors.primary,
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: isSelected ? colors.primary : colors.white
            }}>
            <Text style={{
                fontFamily: Fonts.regular,
                fontSize: FontSize.mdl,
                color: isSelected ? colors.white : colors.black
            }}>{title}</Text>
        </Button>
    )
}

export default App;