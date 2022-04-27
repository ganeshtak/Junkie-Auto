import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import { Price_Format } from '../../Constant/Helper/PriceFormat';
import { colors, FontSize, h, shadow, spacer, totalSize, w } from '../../Style/baseStyle';
import { Button } from '../AppButton';
import { getImageUrl } from '../../Constant/Helper/ImageUrl';
import { getDateFormat, remainingDay, remainingHour, remainingMinute } from '../../Constant/Helper/TimeAndDate';
import { FilterConstant, UserConstant } from '../../Constant/AppConstant';
import { getWinnerBidDataPrice } from '../../Screens/Bids/Utils';
import moment from 'moment';
import { AuctionStatus, AuctionStatusTypes } from '../../Constant/Data';
import { getAuctionStatusColor } from '../../Screens/Auctions/Utils';
import { ProgressImage } from '../../Utility/ProgressImage';
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
        color: colors.white,
        fontSize: FontSize.md * .8
      }}>{title}</Text>
    </View>
  )
}

export const getUsedTypeColor = (status) => {
  if (status == AuctionStatus[0]) {
    return colors.yellow
  }
  else if (status == AuctionStatus[1]) {
    return colors.red
  }
  else if (status == AuctionStatus[2]) {
    return colors.green
  }
  return colors.red
}

export const ShowStatus = ({
  _color = colors.red,
  status = "used",
  status_key
}) => {
  const color = getUsedTypeColor(status_key)
  return (
    <View style={{
      position: 'absolute',
      left: 0,
      top: spacer * .5,
      backgroundColor: color,
      paddingVertical: 3,
      paddingHorizontal: spacer,
      borderTopRightRadius: radius,
      borderBottomRightRadius: radius,
      ...shadow[1],
    }}>
      <Text style={{
        ...styles.text1,
        color: colors.white,
        textTransform: 'uppercase'
      }}>{status}</Text>
    </View>
  )
}


export const CarAuctions = ({
  date = `${remainingHour()} hour / ${remainingMinute()} min`,
  name = "Toyota - Prius - 2020",
  spacer = 8,
  onPress,
  start_price = 0,
  end_price = 0,
  image,
  status, // this means used or new etc
  startDate,
  endDate,
  your_bid,
  model,
  total_bid,
  bid_complete_price,
  bid_data,
  is_my_wishlist = false,
  wishlistOnPress,
  cancel_reason,
  editOnPress,
  Status // this means cancel,pending or etc
}) => {
  const hoursText = `${remainingDay(endDate)} day / ${remainingHour()} h / ${remainingMinute()} min`
  const status_name = getLangText(FilterConstant.getStatusById(status));
  const status_key = FilterConstant.getStatusById(status);
  const bidWinnerPrice = getWinnerBidDataPrice(bid_data);

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Button
        activeOpacity={0.9}
        onPress={onPress}
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            width: '35%',
          }}>
          <ProgressImage
            style={{
              flex: 1,
              borderTopRightRadius: radius,
              borderBottomRightRadius: radius,
            }}
            //source={require('../../Asset/Image/Car.png')}
            //source={{ uri: getImageUrl(image) }}
            uri={getImageUrl(image)}
            resizeMode="cover"
          />
        </View>

        <View
          style={{
            flex: 1,
            padding: spacer,
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View>
                <Icons.ClockIcon size={totalSize(1)} color={colors.gray} />
              </View>
              <Text
                style={{
                  ...styles.text,
                  marginLeft: 5,
                  fontSize: FontSize.md * 0.8,
                }}>
                {hoursText}
              </Text>
            </View>
          </View>
          <View
            style={{
              // flexDirection: 'row',
              // alignItems: 'center',
              marginTop: spacer,
              justifyContent: 'space-between',
            }}>
            <Btn
              title={`${getLangText(TextKey.StartBid)} ${Price_Format(
                start_price,
              )}`}
              backgroundColor={colors.black}
            />
            <View style={{
              marginTop: 5,
            }}>
              <Btn
                title={`${getLangText(TextKey.EndBid)} ${Price_Format(
                  end_price,
                )}`}
              />
            </View>
          </View>
        </View>
        <ShowStatus status={status_name} status_key={status_key} />
      </Button>

      {[AuctionStatusTypes.cancel, AuctionStatusTypes.expired_close].includes(
        parseInt(Status),
      ) ? (
        <CancelDetail
          reason={cancel_reason}
          editOnPress={editOnPress}
          status={Status}
        />
      ) : bidWinnerPrice ? (
        <ShowBid
          bidText={`${getLangText(
            TextKey.Bid_completed_price,
          )} : ${Price_Format(bidWinnerPrice)}`}
        />
      ) : (
        <>
          {your_bid ? (
            <ShowBid bidText={`${getLangText(TextKey.Your_bid)} : ${Price_Format(your_bid)}`} />
          ) : null}
          {total_bid > -1 ? (
            <ShowBid
              bidText={`${getLangText(TextKey.Total_bid)} : ${total_bid}`}
              wishlistOnPress={wishlistOnPress}
              isMyWishlist={is_my_wishlist}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const CancelDetail = ({
  reason = "text",
  editOnPress,
  status
}) => {
  const cancel_title =
    parseInt(status) == AuctionStatusTypes.cancel
      ? `${getLangText(TextKey.Cancel_by_admin)}`
      : `${getLangText(TextKey.Cancel_by_you)}`;

  return (
    <View style={{
      //...shadow[0],
      backgroundColor: colors.white,
      padding: spacer * .8,
      width: '100%',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <View style={{
        width: '80%',
        paddingRight: 10,
      }}>
        <Text style={{
          ...styles.text,
          color: colors.red,
          fontSize: FontSize.md,

          fontFamily: Fonts.bold
        }}>{cancel_title}</Text>
        <Text style={{
          ...styles.text,
          color: colors.gray,
          fontSize: FontSize.md * .9,
          paddingRight: 10,
        }}>{reason}</Text>
      </View>
      {
        parseInt(status) == AuctionStatusTypes.cancel ?
          <Button
            onPress={editOnPress}
            style={{
              flex: 1,
              borderRadius: 10,
              padding: 5,
              borderColor: colors.primary,
              borderWidth: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Text style={{ ...styles.text1 }}>{getLangText(TextKey.Edit)}</Text>
          </Button>
          :
          null
      }
    </View>
  )
}

const ShowBid = ({
  bidText,
  wishlistOnPress,
  isMyWishlist = false,
  iconSize = totalSize(2)
}) => {
  const isRegisterUser = UserConstant.user_id;

  const Row = ({ value, leftBorder = false, onPress, icon }) => {
    return (
      <Button
        onPress={onPress}
        style={{
          flex: 1,
          borderLeftColor: colors.gray,
          borderLeftWidth: leftBorder ? 1 : 0,
          alignItems: 'center'
        }}>
        {
          icon ? (icon) :
            <Text style={{
              ...styles.text1,
              color: colors.black,
              textAlign: 'center',
              fontSize: FontSize.mdl,
              fontFamily: Fonts.bold,
            }}>{value}</Text>
        }

      </Button>
    )
  }
  return (
    <View style={{
      width: '100%',
      // backgroundColor: colors.red,
      paddingVertical: spacer * .7,
      borderBottomRightRadius: radius,
      flexDirection: 'row',
      alignItems: 'center',
      borderTopColor: colors.lightWhite,
      borderTopWidth: 1,

    }}>
      {
        bidText && (
          <Row
            value={bidText}
            rightBorder
          />
        )
      }
      {
        isRegisterUser && wishlistOnPress && (
          <Row
            value={"Add to wishlist"}
            icon={isMyWishlist ? <Icons.HeartIcon size={iconSize} fill={colors.red} color={colors.red} />
              : <Icons.HeartIcon size={iconSize} color={colors.gray} />}
            onPress={wishlistOnPress}
            leftBorder
          />
        )
      }

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '99.8%',
    backgroundColor: colors.white,
    ...shadow[2],
    //flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    borderRadius: radius,
    marginLeft: '.1%'
  },
  text: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.md * .9,
    color: colors.gray
  },
  text1: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.md,
    color: colors.black
  }
})