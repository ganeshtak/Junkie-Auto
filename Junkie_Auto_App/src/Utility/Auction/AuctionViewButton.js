import React from 'react'
import { Image, View } from 'react-native'
import { AuctionImageButton, AuctionImageLeftButton, AuctionImageRightButton } from '../Asset/Icon/Icon';
import { colors, shadow } from '../Style/baseStyle';

export const AuctionViewButton = () => {
    return (
      <View
        style={{
          borderRadius: 55,
          color: colors.white,
          height: 65,
          width: 65,
          alignItems: 'center',
          justifyContent: 'center',
          //   backgroundColor:"red"
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,

          elevation: 24,
        }}>
        <View style={{flexDirection: 'row'}}>
          {/* <AuctionImageLeftButton size={10} color={colors.primary} /> */}
          {/* <AuctionImageRightButton size={10} color={colors.primary} /> */}
          <AuctionImageButton size={24} color={colors.primary} />
        </View>
      </View>
    );
}
