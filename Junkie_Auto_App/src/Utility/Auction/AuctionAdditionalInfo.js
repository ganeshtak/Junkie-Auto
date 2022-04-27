import React from 'react'
import { Text, View } from 'react-native';
import { Fonts } from '../../Asset/Font';
import { colors, FontSize } from '../../Style/baseStyle';

export const AuctionAdditionalInfo = () => {
  return (
    <View
      style={{
        flexDirection: 'column',
        opacity: 1,
        borderColor: '#707070',
        borderRadius: 4,
        borderWidth: 1,
      }}>
      <Text
        style={{
          fontFamily: Fonts.regular,
          padding: 12,
          fontSize: FontSize.md,
          color: colors.hexGray,
          opacity: 0.8,
        }}>
        Additional info:
      </Text>
      <Text
        numberOfLines={2}
        style={{
          fontFamily: Fonts.regular,
          fontSize: FontSize.md,
          color: '#707070',
          paddingHorizontal: 12,
          paddingBottom: 12,

          opacity: 0.6,
        }}>
        Porro facere ut eligendi et quis voluptates. Illo dolorum minima quo
        molestiae consequatur quisquam illo. 3423 Zena Station Lake Greenland
        Lexus ls430v | 2004 | 247765 mileage
      </Text>
    </View>
  );
}
