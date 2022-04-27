import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import { Price_Format } from '../../Constant/Helper/PriceFormat';
import { colors, FontSize, h, shadow, spacer, totalSize, w } from '../../Style/baseStyle';
import { Button } from '../AppButton';
import { getDiffFromDates, getDateFormat, remainingHour, remainingMinute, remainingDay } from '../../Constant/Helper/TimeAndDate';
import { getImageUrl } from '../../Constant/Helper/ImageUrl';
import { ShowStatus } from './CarAuctions';
import { FilterConstant } from '../../Constant/AppConstant';
import { ProgressImage } from '../ProgressImage';
import { getLangText } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';


const radius = 10

export const CarOffer = ({
  cardWidth = w(46),
  date = "27/02/2021",
  name = "Honda–Acord-2002",
  price = 600,
  onPress,
  bid_price,
  sale_price,
  startDate,
  endDate,
  model = "Carter",
  _spacer = 5,
  image,
  status
}) => {
  const hourText = `${remainingHour()} h / ${remainingMinute()} min`
  const status_name = getLangText(FilterConstant.getStatusById(status));
  const status_key = FilterConstant.getStatusById(status)

  return (
    <Button
      onPress={onPress}
      style={{
        ...styles.container,
        width: cardWidth,
        //alignItems: 'center'
      }}>
      {/* for image */}
      <View
        style={{
          height: h(10),
        }}>
        <ProgressImage
          style={{
            flex: 1,
            borderTopLeftRadius: radius,
            borderTopRightRadius: radius,
          }}
          //source={require('../../Asset/Image/Car.png')}
          //source={{ uri: getImageUrl(image) }}
          uri={getImageUrl(image)}
          resizeMode="cover"
        />
      </View>

      <View
        style={{
          paddingVertical: spacer * 0.4,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: _spacer,
          }}>
          <Text style={{ ...styles.text }}>{`${getLangText(
            TextKey.Submit,
          )} ${getDateFormat(endDate)}`}</Text>
          <Text style={{ ...styles.text }}>{model}</Text>
        </View>
        <View
          style={{
            marginVertical: 2,
            paddingHorizontal: _spacer,
          }}>
          <Text style={{ ...styles.text1 }}>{name}</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.black,
            borderRadius: 5,
            padding: 5,
            marginHorizontal: _spacer,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              ...styles.text1,
              color: colors.white,
            }}>{`${getLangText(TextKey.BUY)} ${Price_Format(
              sale_price,
            )}`}</Text>

          {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{ marginRight: 3 }}>
              <Icons.ClockIcon size={totalSize(1)} color={colors.white} />
            </View>
            <Text
              style={{
                ...styles.text,
                color: colors.white,
              }}>
              {hourText}
            </Text>
          </View> */}
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.gray,
          width: '80%',
          height: 1,
          marginVertical: 2,
          alignSelf: 'center',
        }}
      />

      <View
        style={{
          marginTop: 0,
          paddingHorizontal: 5,
          paddingVertical: 5,
          //alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 5,
          }}>
          <ShowTime title={getLangText(TextKey.day)} time={remainingDay(endDate)} />
          <ShowTime title={getLangText(TextKey.hours)} time={remainingHour()} />
          <ShowTime title={getLangText(TextKey.min)} time={remainingMinute()} />
        </View>
        <View
          style={{
            backgroundColor: colors.red,
            padding: 5,
            borderRadius: 4,
            marginHorizontal: 2,
            marginTop: 5,
            paddingHorizontal: 5,
          }}>
          <Text
            style={{
              ...styles.text1,
              color: colors.white,
            }}>
            {bid_price
              ? `${getLangText(TextKey.DashBoard_Bid)} ${Price_Format(bid_price)}`
              : `${getLangText(TextKey.No_bid)}`}
          </Text>
        </View>

      </View>
      <ShowStatus status={status_name} status_key={status_key} />
    </Button>
  );
}

const ShowTime = ({
  title,
  time = "02"
}) => {
  return (
    <View style={{
      marginRight: 5,
      alignItems: 'center'
    }}>
      <Text style={{
        ...styles.text1,
        fontFamily: Fonts.bold,
        fontSize: FontSize.md * .8
      }}>{time}</Text>
      <Text style={{
        ...styles.text1
      }}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius,
    backgroundColor: colors.white,
    ...shadow[0],
    paddingBottom: 8,
    marginBottom: 10,
    borderColor: colors.lightWhite,
    borderWidth: .8,
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