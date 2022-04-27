import { forFade } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/HeaderStyleInterpolators';
import React from 'react'
import { TouchableOpacity ,View,Text, StyleSheet} from 'react-native'
import { Fonts } from '../../Asset/Font';
import { colors, Font, FontSize, w } from '../../Style/baseStyle';

export const AuctionImageHeaderleftbutton = ({onPress,title,color}) => {
    return (
      <TouchableOpacity
        style={{...styles.button, backgroundColor: color}}
        onPress={onPress}>
        <Text style={{textAlign:"center",fontFamily:Fonts.regular,color:colors.white,fontSize:FontSize.mdl}}>{title}</Text>
      </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
  button: {
    borderTopLeftRadius:33,
    borderBottomLeftRadius:33,
    height:h(40),
    width:w(2),
  },
});