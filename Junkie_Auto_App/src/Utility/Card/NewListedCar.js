import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import { Price_Format } from '../../Constant/Helper/PriceFormat';
import { colors, FontSize, h, shadow, spacer, totalSize, w } from '../../Style/baseStyle';
import { Button } from '../AppButton';
import { getDiffFromDates, getDateFormat } from '../../Constant/Helper/TimeAndDate';
import { getImageUrl } from '../../Constant/Helper/ImageUrl';
import { getLangText } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';



const radius = 10

const Btn = ({
  backgroundColor = colors.red,
  title,

}) => {
  return (
    <View style={{
      padding: 5,
      backgroundColor: backgroundColor,
      borderRadius: 5,
    }}>
      <Text style={{
        ...styles.text1,
        color: colors.white
      }}>{title}</Text>
    </View>
  )
}


export const NewListedCar = ({
  date = "02/03/2021",
  name = "Toyota - Prius - 2020",
  spacer = 8,
  onPress,
  bid_price,
  sale_price,
  endDate,
  model,
  image
}) => {
  return (
    <Button
      onPress={onPress}
      style={{
        ...styles.container,
      }}>
      <View
        style={{
          width: '35%',
        }}>
        <FastImage
          style={{
            flex: 1,
            borderTopLeftRadius: radius,
            borderBottomLeftRadius: radius,
          }}
          //source={require('../../Asset/Image/Car.png')}
          source={{ uri: getImageUrl(image) }}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          flex: 1,
          padding: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
          }}>
          <Text style={{ ...styles.text }}>{`${getLangText(
            TextKey.Submit,
          )} ${getDateFormat(endDate)}`}</Text>
          <Text style={{ ...styles.text }}>{model}</Text>
        </View>
        <View
          style={{
            marginTop: spacer,
          }}>
          <Text
            style={{
              ...styles.text1,
            }}>
            {name}
          </Text>
        </View>
        <View
          style={{
            // flexDirection: 'row',
            // alignItems: 'center',
            marginTop: spacer,
            justifyContent: 'space-between',
          }}>
          <Btn
            title={`${getLangText(TextKey.BUY)} ${Price_Format(sale_price)}`}
            backgroundColor={colors.black}
          />
          <View style={{
            marginTop: 5,
          }}>
            <Btn
              title={`${getLangText(TextKey.BID)} ${Price_Format(bid_price)}`}
            />
          </View>
        </View>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    width: w(65),
    backgroundColor: colors.white,
    //...shadow[1],
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: radius,
    marginRight: 5,
    borderColor: colors.lightWhite,
    borderWidth: .8
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.sm * 1,
    color: colors.gray
  },
  text1: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.md * .9,
    color: colors.black
  }
})