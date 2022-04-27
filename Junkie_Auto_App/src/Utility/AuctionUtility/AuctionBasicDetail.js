import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { Icons } from "../../Asset/Icon";
import { UserConstant } from "../../Constant/AppConstant";
import { AuctionStatusTypes, BidBuyTypes, BidType, UserType } from "../../Constant/Data";
import { openCallActivity, openEmailActivity } from "../../Constant/Helper/PhoneCallActivity";
import { Price_Format } from "../../Constant/Helper/PriceFormat";
import { TextKey } from "../../Constant/Language";
import { getAuctionStatusColor, getAuctionStatusText } from "../../Screens/Auctions/Utils";
import { getLangText } from "../../Store/Actions/LangAction";
import { colors, FontSize, spacer, totalSize, w } from "../../Style/baseStyle";
import { Button, AppButton } from "../AppButton";
import { AppHeading } from "../AppHeading";



const borderColor = colors.lightWhite;


export const AuctionBasicDetail = ({
  name = "Toyto",
  address = "Apt. 992 431 caesar ports port lucius south",
  des = "Lexus ls430v |  2004 |   247765 mileage",
  auction_status,
  isExpired = false,
  cancelReason,
  Status, // this is for cancel,pending etc

  wishListOnPress,
  shareOnPress,
  isMeSeller = false,
  isMyWishlist = false,
}) => {
  React.useEffect(() => { });
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <AppHeading title={name} />
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <ShareButton
            onPress={shareOnPress}
            icon={
              <View
                style={{
                  transform: [{ rotate: '180deg' }],
                }}>
                <Icons.ShareIcon size={totalSize(2)} color={colors.gray} />
              </View>
            }
          />
          {UserConstant.user_id == undefined ? null : isMeSeller ? null : (
            <ShareButton
              leftSpace={spacer}
              onPress={wishListOnPress}
              icon={
                isMyWishlist ? (
                  <Icons.HeartIcon
                    size={totalSize(2)}
                    fill={colors.red}
                    color={colors.red}
                  />
                ) : (
                  <Icons.HeartIcon size={totalSize(2)} color={colors.gray} />
                )
              }
            />
          )}
        </View>
      </View>
      {Status == AuctionStatusTypes.cancel && cancelReason && (
        <CancelReason reason={cancelReason} />
      )}
      <View
        style={{
          marginBottom: spacer * 0.5,
        }}>
        <Text style={{ ...styles.text }}>
          {getLangText(TextKey.Auction_status)}{' '}
          <Text
            style={{
              ...styles.text,
              color: isExpired
                ? colors.red
                : getAuctionStatusColor(auction_status),
            }}>
            {isExpired
              ? `${getLangText(TextKey.Expired)}`
              : getAuctionStatusText(auction_status, isMeSeller)}
          </Text>
        </Text>
      </View>
      <Text style={{ ...styles.text }}>{des}</Text>
      <View
        style={{
          flexDirection: 'row',
          //alignItems: 'center',
          marginTop: spacer * 0.8,
        }}>
        <View style={{ top: 0, marginTop: spacer * 0.1 }}>
          <Icons.LocationMarker size={totalSize(2)} color={colors.primary} />
        </View>
        <Text style={{ ...styles.text }}>{address}</Text>
      </View>
    </View>
  );
}

const ShareButton = ({
  size = totalSize(3.5),
  leftSpace = 0,
  onPress,
  icon
}) => {
  return (
    <Button
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: 5,
        //backgroundColor: 'red',
        marginLeft: leftSpace,
        borderColor: colors.lightWhite,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      {icon}
    </Button>
  )
}

const CancelReason = ({ reason }) => {
  return (
    <View
      style={{
        marginBottom: spacer * 0.5,
      }}>
      <Text
        style={{
          ...styles.text,
          color: colors.red,
        }}>
        {getLangText(TextKey.Cancel_Reason)}
        <Text
          style={{
            ...styles.text,
            color: colors.red,
            fontFamily: Fonts.bold,
          }}>
          {' '}
          {reason}
        </Text>
      </Text>
    </View>
  );
}

export const OtherDetails = ({
  startPrice = 0,
  endPrice = 0,
  sale_price = 0,
  maxBid = 0,
  damage_filter_name,
  secondary_damage_name,
  drive_line_name,
  body_name,
  fule_name,
  transmission_name,
  color_name,
  titleStatus,
  cleanTitle,
  startDate,
  endDate,
  current_bid,
  pre_bid,
  maxPreBid,
  isMeSeller = false,
  my_pre_bid,
  catacatalytic_convertor_name,
  userPreBidOnPress,
  maxPreBidId,
  Status,
  timeFrame
}) => {

  return (
    <View
      style={{
        ...styles.otherContainer,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <PriceDetail
          title={getLangText(TextKey.Auction_Start_Price)}
          price={startPrice}
          bottomBorder
        />
        <PriceDetail
          title={getLangText(TextKey.Sale_Price)}
          price={sale_price}
          bottomBorder
          leftBorder
        />
        {/* <PriceDetail
                    title="End Price"
                    price={endPrice}
                    bottomBorder
                    leftBorder
                /> */}
      </View>
      {/* <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>

                {
                    current_bid ?
                        <PriceDetail
                            title="Current Bid"
                            price={current_bid}
                            bottomBorder
                            leftBorder
                        />
                        :
                        null
                }

            </View> */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {isMeSeller ? (
          maxPreBid ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                borderBottomColor: colors.lightWhite,
                borderBottomWidth: 1,
                paddingRight: spacer,
                justifyContent: 'space-between',
              }}>
              <PriceDetail
                title={getLangText(TextKey.pre_bid)}
                price={maxPreBid}
              />
              {Status == AuctionStatusTypes.active ? (
                <MakeWinnerButton
                  onPress={() => {
                    userPreBidOnPress &&
                      userPreBidOnPress(maxPreBid, maxPreBidId);
                  }}
                />
              ) : null}
            </View>
          ) : null
        ) : my_pre_bid ? (
          <PriceDetail
            title={getLangText(TextKey.pre_bid)}
            price={my_pre_bid}
            bottomBorder
          />
        ) : null}
      </View>
      <View
        style={{
          paddingHorizontal: spacer,
          paddingVertical: spacer,
        }}>
        {damage_filter_name ? (
          <Row
            title={getLangText(TextKey.Auction_Damage_Type)}
            value={damage_filter_name}
          />
        ) : null}
        {catacatalytic_convertor_name ? (
          <Row
            title={getLangText(TextKey.Catalytic_converter)}
            value={catacatalytic_convertor_name}
          />
        ) : null}
        {secondary_damage_name ? (
          <Row
            title={getLangText(TextKey.Secondary_damage_type)}
            value={secondary_damage_name}
          />
        ) : null}
        {drive_line_name ? (
          <Row
            title={getLangText(TextKey.DeriveLine)}
            value={drive_line_name}
          />
        ) : null}
        {body_name ? (
          <Row title={getLangText(TextKey.Body_type)} value={body_name} />
        ) : null}
        {fule_name ? (
          <Row
            title={getLangText(TextKey.Auction_Fuel_Type)}
            value={fule_name}
          />
        ) : null}
        {transmission_name ? (
          <Row
            title={getLangText(TextKey.Auction_Transmission)}
            value={transmission_name}
          />
        ) : null}
        {color_name ? (
          <Row
            title={getLangText(TextKey.Auction_Color)}
            value={color_name}
          />
        ) : null}
        {cleanTitle ? (
          <Row
            title={getLangText(TextKey.Auction_CleaN_Title)}
            value={cleanTitle}
          />
        ) : null}
        {titleStatus ? (
          <Row
            title={getLangText(TextKey.Auction_Title_Status)}
            value={titleStatus}
          />
        ) : null}

        {
          timeFrame ?
            <Row
              title={getLangText(TextKey.time_frame)}
              value={timeFrame == 0 ? "Today" : timeFrame}
            />
            :
            null
        }

        {/* {startDate ? (
          <Row
            title={getLangText(TextKey.Auction_Start_Date)}
            value={startDate}
          />
        ) : null}
        {endDate ? (
          <Row
            title={getLangText(TextKey.Auction_End_Date)}
            value={endDate}
          />
        ) : null} */}
      </View>
    </View>
  );
}

export const PriceDetail = ({
  title, price = 10,
  bottomBorder = false,
  leftBorder = false
}) => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: borderColor,
      borderBottomWidth: bottomBorder ? 1 : 0,
      borderLeftWidth: leftBorder ? 1 : 0,
      paddingVertical: spacer
    }}>
      <Text style={{
        ...styles.priceText
      }}>{title}</Text>
      <Text style={{
        ...styles.priceText,
        fontFamily: Fonts.bold
      }}>{Price_Format(price)}</Text>
    </View>
  )
}

export const Row = ({
  title,
  value,
  isCapitalized = true,
  onPress,
}) => {
  return (
    <Button
      onPress={onPress}
      disable={onPress ? false : true}
      style={{
        flexDirection: 'row',
        //alignItems: 'center',
        marginBottom: spacer
      }}>
      <View style={{ flex: 1, paddingRight: spacer }}>
        <Text style={{ ...styles.text }}>{title}:</Text>
      </View>
      <View style={{ flex: 1, }}>
        <Text style={{
          ...styles.text,
          textTransform: isCapitalized ? "capitalize" : "none"
        }}>{value}</Text>
      </View>
    </Button>
  )
}

export const AdditionalInfo = ({
  info = "Porro facere ut eligendi et quis voluptates. Illo dolorum minima quo molestiae consequatur quisquam illo. 3423 Zena Station Lake Greenland Lexus ls430v |  2004 |   247765 mileage",
}) => {

  return (
    <View style={{
      borderRadius: 10,
      borderWidth: 1,
      borderColor: borderColor,
      padding: spacer,
      marginTop: spacer
    }}>
      <Text style={{
        ...styles.text
      }}>{getLangText(TextKey.Auction_Add_Info)}</Text>
      <Text style={{
        ...styles.text,
        marginTop: spacer * .8
      }}>{info}</Text>
    </View>
  )
}

const Btn = ({ text, onPress, leftBorder }) => {
  return (
    <Button
      onPress={onPress}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: borderColor,
        borderLeftWidth: leftBorder ? 1 : 0,
        paddingVertical: spacer
      }}>
      <Text style={{
        ...styles.priceText
      }}>{text}</Text>
    </Button>
  )
}

export const BidDetail = ({
  bid = [],
  makeWinnerOnPress,
  auction_user_id,
  is_my_auction,
  title = `${getLangText(TextKey.Active_bids)}`,
  rejectOnPress,
  status,
}) => {
  const activeBids = bid.filter(item => item?.type == BidBuyTypes.bid);

  if (activeBids.length == 0) {
    return null;
  }
  return (
    <View
      style={{
        borderRadius: 10,
        borderWidth: 1,
        borderColor: borderColor,
        padding: spacer,
        marginTop: spacer,
      }}>
      <Text
        style={{
          fontSize: FontSize.md,
          color: colors.gray,
          fontFamily: Fonts.regular,
        }}>
        {title}
      </Text>
      <View
        style={{
          marginTop: spacer * 0.8,
        }}>
        {Array.isArray(activeBids) &&
          bid.length > 0 &&
          activeBids.map((item, index) => {
            return (
              <BidRow
                key={String(`key-${index}`)}
                bid_price={item?.bid_amount}
                bid_user_id={item?.user_id}
                onPress={() => makeWinnerOnPress(item?.id, item?.bid_amount)}
                auction_user_id={auction_user_id}
                is_my_auction={is_my_auction}
                status={status}
                rejectOnPress={() => {
                  rejectOnPress(item?.id, item?.bid_amount);
                }}
                bid_status={item?.status}
              />
            );
          })}
      </View>
    </View>
  );
};

export const BidRow = ({
  bid_price = 0,
  bid_user_id,
  onPress,
  auction_user_id,
  is_my_auction,
  rejectOnPress,
  bid_status,
  status
}) => {
  const is_my_bid = String(bid_user_id) == String(UserConstant.user_id);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacer * 0.5,
        borderBottomColor: colors.lightWhite,
        borderBottomWidth: 1,
        paddingBottom: spacer * 0.5,
      }}>
      <View
        style={{
          paddingRight: spacer,
          transform: [{ rotate: '45deg' }],
          top: spacer * 0.5,
        }}>
        <Icons.BidIcon size={totalSize(2.9)} color={colors.primary} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ ...styles.text }}>{Price_Format(bid_price)}</Text>
        {/* {
                    !is_my_auction && (
                        <Text style={{
                            ...styles.text,
                            textTransform: 'none'
                        }}>{is_my_bid ? "Bid by you" : "Bid by Other"}</Text>
                    )
                } */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {parseInt(status) == AuctionStatusTypes.active
            ? +bid_status == BidType.active && (
              <>
                {is_my_auction && <MakeWinnerButton onPress={onPress} />}
                {is_my_auction && (
                  <MakeWinnerButton
                    onPress={rejectOnPress}
                    title={getLangText(TextKey.Reject)}
                    leftSpace={spacer}
                  />
                )}
              </>
            )
            : null}
          {is_my_auction && +bid_status == BidType.reject && (
            <View>
              <Text style={{ ...styles.text }}>
                {getLangText(TextKey.Rejected)}
              </Text>
            </View>
          )}

          {is_my_bid && +bid_status == BidType.reject && (
            <View>
              <Text style={{ ...styles.text }}>
                {getLangText(TextKey.Rejected)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const MakeWinnerButton = ({ onPress, title = `${getLangText(TextKey.Accept)}`, leftSpace = 0 }) => {
  return (
    <Button
      onPress={onPress}
      style={{
        padding: spacer * .5,
        backgroundColor: colors.primary,
        borderRadius: 5,
        marginLeft: leftSpace,
      }}>
      <Text style={{
        ...styles.text,
        color: colors.white
      }}>{title}</Text>
    </Button>
  )
}

export const BidCompleteCart = ({
  bid_close_price = 10
}) => {
  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: colors.primary,
        marginTop: spacer,
        padding: spacer * 0.8,
      }}>
      <Text
        style={{
          fontFamily: Fonts.regular,
          fontSize: FontSize.mdl,
          color: colors.lightWhite,
        }}>
        {getLangText(TextKey.Bid_completed_price)}{' '}
        <Text
          style={{
            fontFamily: Fonts.bold,
            fontSize: FontSize.mdl,
            color: colors.white,
            top: 2,
          }}>
          {' '}
          {Price_Format(bid_close_price)}
        </Text>
      </Text>
    </View>
  );
}

export const AuctionSellerDetail = ({
  type,
  f_name = "Mohan",
  l_name,
  email,
  mobile,
  heading,

  bid_price,

  street,
  city,
  state,
}) => {
  return (
    <View
      style={{
        borderRadius: 10,
        marginTop: spacer,
        padding: spacer * 0.8,
        borderColor: colors.lightWhite,
        borderWidth: 1,
      }}>
      <Text style={{ ...styles.text }}>{heading}</Text>
      <View
        style={{
          marginTop: spacer * 0.8,
        }}>
        {f_name ? (
          <Row title={getLangText(TextKey.Register_fName)} value={f_name} />
        ) : null}
        {l_name ? (
          <Row title={getLangText(TextKey.Register_LName)} value={l_name} />
        ) : null}
        {email ? (
          <Row
            title={getLangText(TextKey.Register_Email)}
            value={email}
            isCapitalized={false}
            onPress={() => {
              openEmailActivity(email);
            }}
          />
        ) : null}
        {mobile ? (
          <Row
            title={getLangText(TextKey.mobile)}
            value={mobile}
            onPress={() => {
              openCallActivity(mobile);
            }}
          />
        ) : null}
        {street ? (
          <Row title={getLangText(TextKey.Register_Street)} value={street} />
        ) : null}
        {city ? <Row title={getLangText(TextKey.Register_City)} value={city} /> : null}
        {state ? <Row title={getLangText(TextKey.Register_State)} value={state} /> : null}
        {bid_price ? (
          <Row title={getLangText(TextKey.Bid_price)} value={Price_Format(bid_price)} />
        ) : null}
      </View>
      {/* <View>
                <AppButton
                    title={type == UserType.seller ? "Contact seller" : "Contact winner"}
                    onPress={() => {
                        openCallActivity(mobile)
                    }}
                />
            </View> */}
    </View>
  );
}

export const GridButton = ({
  title1,
  title2,
  onPress1,
  onPress2,
}) => {

  return (
    <View style={{
      borderRadius: 10,
      borderWidth: 1,
      borderColor: borderColor,
      marginTop: spacer,
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      <Btn
        text={title1}
        onPress={onPress1}
      />
      <Btn
        text={title2}
        leftBorder
        onPress={onPress2}
      />
    </View>
  )
}



const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.regular,
    color: colors.gray,
    fontSize: FontSize.md,
    textTransform: 'capitalize'
  },
  otherContainer: {
    //flex: 1,
    borderRadius: 10,
    borderColor: borderColor,
    borderWidth: 1,
    marginTop: spacer,
    //paddingHorizontal: spacer,
    //paddingVertical: spacer
  },
  priceText: {
    fontFamily: Fonts.regular,
    color: colors.black,
    fontSize: FontSize.mdl
  }
})
