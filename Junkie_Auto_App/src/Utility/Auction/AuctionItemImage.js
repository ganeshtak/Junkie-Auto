import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { MAXHEIGHT, totalSize } from '../Style/baseStyle';
import { AuctionViewButton } from './AuctionViewButton';

export const AuctionItemImage = () => {
  return (
    <View>
      <Image
        source={require('../../Asset/Image/MaskGroup1.png')}
        style={{ height: 250, width: '100%', marginTop: 0 }}
      />
    </View>
  );
}
