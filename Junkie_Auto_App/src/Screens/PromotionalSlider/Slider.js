import React from "react";
import { View, Text, FlatList, Image, StyleSheet, Platform } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, FontSize, h, spacer, totalSize, w } from "../../Style/baseStyle";
import { Button } from "../../Utility/AppButton";
import { AppContainer } from '../../Utility/AppContainer';
import { Mask1, Mask2, Mask3 } from './Resources/Icons';
import { Store } from '../../Store';
import { setAppStatus } from '../../Store/Actions/UserAction';
import { setAppLang, getLangText, TextKey, lang_code } from '../../Store/Actions/LangAction';
import { AppText } from '../../Utility/AppText';
import { AppStatusType } from "../../Constant/Data";
import { AppConstant } from "../../Constant/AppConstant";


const imageSize = w(50);


const SliderDataEn = [
    {
        image: require('./Resources/Slider1.png'),
        mask: <Mask1 />,
        scaleImage: 1.1,
        heading: "Get the latest used car at a fair price",
        text: "Ut sit doloremque ducimus. Inventore veniam quibusdam possimus labore corporis veniam aut ut. In pariatur quam. Laboriosam voluptatum tenetur tempora mollitia quas sed. Est labore maiores veniam minus dolor.",
        topSpace: 0,
    },
    {
        image: require('./Resources/Slider2.png'),
        mask: <Mask2 />,
        scaleImage: 1.4,
        heading: "Find your nearby car auctions",
        text: "Ut sit doloremque ducimus. Inventore veniam quibusdam possimus labore corporis veniam aut ut. In pariatur quam. Laboriosam voluptatum tenetur tempora mollitia quas sed. Est labore maiores veniam minus dolor.",
        topSpace: totalSize(8),
    },
    {
        image: require('./Resources/Slider3.png'),
        scaleImage: 1.3,
        mask: <Mask3 />,
        heading: "Sale your used car on your own price",
        text: "Ut sit doloremque ducimus. Inventore veniam quibusdam possimus labore corporis veniam aut ut. In pariatur quam. Laboriosam voluptatum tenetur tempora mollitia quas sed. Est labore maiores veniam minus dolor.",
        topSpace: totalSize(5),
    },
];

const SliderDataSp = [
    {
        image: require('./Resources/Slider1.png'),
        mask: <Mask1 />,
        scaleImage: 1.1,
        heading: "Obtenga el último automóvil usado a un precio justo",
        text: "Ut sit doloremque ducimus. Inventore veniam quibusdam possimus labore corporis veniam aut ut. In pariatur quam. Laboriosam voluptatum tenetur tempora mollitia quas sed. Est labore maiores veniam minus dolor.",
        topSpace: 0,
    },
    {
        image: require('./Resources/Slider2.png'),
        mask: <Mask2 />,
        scaleImage: 1.4,
        heading: "Encuentre sus subastas de autos cercanas",
        text: "Ut sit doloremque ducimus. Inventore veniam quibusdam possimus labore corporis veniam aut ut. In pariatur quam. Laboriosam voluptatum tenetur tempora mollitia quas sed. Est labore maiores veniam minus dolor.",
        topSpace: totalSize(8),
    },
    {
        image: require('./Resources/Slider3.png'),
        scaleImage: 1.3,
        mask: <Mask3 />,
        heading: "Vende tu auto usado a tu propio precio",
        text: "Ut sit doloremque ducimus. Inventore veniam quibusdam possimus labore corporis veniam aut ut. In pariatur quam. Laboriosam voluptatum tenetur tempora mollitia quas sed. Est labore maiores veniam minus dolor.",
        topSpace: totalSize(5),
    },
];



class Slider extends React.Component {

    scrollRef = undefined;

    state = {
        demo: "",
    }


    nextOnPress = (index) => {
        this.scrollRef && this.scrollRef.scrollToIndex({
            index: ++index,
            animated: true,
        })
    }

    componentDidMount() {
        this.setState({ demo: "" });
    }

    continueOnPress = () => {
        setAppStatus(AppStatusType.auth)
    }

    renderSliderCard = ({ item, index }) => {
        const Data = AppConstant.selected_lang == lang_code.en ? SliderDataEn : SliderDataSp;
        return (
            <View style={{
                flex: 1,
            }}>
                <View style={{
                    top: -h(18),
                    position: 'absolute'
                }}>
                    {item?.mask}
                </View>
                <View style={{
                    width: w(100),
                    height: Platform.OS == "android" ? h(32) : h(35),
                    marginTop: totalSize(2),
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>

                    <Image
                        style={{
                            width: imageSize,
                            height: imageSize,
                            resizeMode: 'contain',
                            transform: [{ scale: item?.scaleImage ? item?.scaleImage : 1 }]
                        }}
                        source={item.image}
                    />
                </View>
                <View style={{
                    flex: 1,

                }}>

                    <View style={{
                        position: 'absolute',
                        top: h(17),
                        paddingHorizontal: totalSize(2)
                    }}>
                        <AppText style={{
                            ...styles.heading,
                            marginTop: item?.topSpace ? item?.topSpace : 0,
                        }}>{item?.heading}</AppText>

                        <Text style={{
                            ...styles.text,
                            marginTop: totalSize(2,),

                        }}>{item?.text}</Text>


                    </View>
                    <View style={{
                        position: 'absolute',
                        bottom: totalSize(2),
                        alignItems: 'flex-end',
                        width: w(100),
                        paddingRight: spacer
                    }}>
                        {
                            Data.length - 1 == index ?
                                <Button style={{
                                    alignItems: 'center',
                                    marginTop: totalSize(2),
                                }}
                                    onPress={this.continueOnPress}
                                >
                                    <Text style={{
                                        ...styles.heading,
                                        color: colors.black,
                                        fontSize: FontSize.lg,
                                        fontFamily: Fonts.regular
                                    }}>{getLangText(TextKey.Continue)}</Text>
                                </Button>
                                :
                                <Button style={{
                                    alignItems: 'center',
                                    marginTop: totalSize(2),
                                }}
                                    onPress={() => this.nextOnPress(index)}
                                >
                                    <Text style={{
                                        ...styles.heading,
                                        fontSize: FontSize.lg,
                                        color: colors.black,
                                        fontFamily: Fonts.regular
                                    }}>{getLangText(TextKey.Next)}</Text>
                                </Button>
                        }
                    </View>
                </View>
            </View>
        )
    }

    render() {
        const Data = AppConstant.selected_lang == lang_code.en ? SliderDataEn : SliderDataSp;
        return (
            <AppContainer>
                <FlatList
                    ref={(ref) => this.scrollRef = ref}
                    data={Data}
                    renderItem={this.renderSliderCard}
                    keyExtractor={(I, i) => String(i)}
                    horizontal
                    pagingEnabled
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                />
            </AppContainer>
        )
    }
}


export default Slider;



const styles = StyleSheet.create({
    heading: {
        color: colors.red,
        fontFamily: Fonts.bold,
        fontSize: FontSize.xlg * .9,
    },
    text: {
        color: colors.gray,
        fontFamily: Fonts.regular,
        fontSize: FontSize.md
    }
})