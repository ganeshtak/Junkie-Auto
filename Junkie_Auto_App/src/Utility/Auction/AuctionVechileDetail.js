import React from 'react'
import { Text, View } from 'react-native'
import { LocationMarker } from '../../Asset/Icon/Icon'
import { colors, Font, FontSize } from '../../Style/baseStyle'

export const AuctionVechileDetail = () => {
  return (
    <View style={{ flexDirection: 'column', paddingLeft: 16 }}>
      <Text
        style={{
          fontFamily: Font.regular,
          FontSize: FontSize.xlg,
          color: colors.black,
        }}>
        Toyota - Prius - 2020
      </Text>
      <Text
        style={{
          fontFamily: Font.regular,
          FontSize: FontSize.mdl,
          opacity: 0.8,
          // textAlign:"center",
          color: '#707070',
        }}>
        Lexus ls430v | 2004 | 247765 mileage
      </Text>
      <View style={{ flexDirection: 'row' }}>
        <LocationMarker size={18} color={colors.primary} />
        <Text
          style={{
            opacity: 0.8,
            color: '#707070',
            fontFamily: Font.regular,
            FontSize: FontSize.mdl,
          }}>
          Apt. 992 431 caesar ports port lucius south
        </Text>
      </View>
    </View>
  )
}
