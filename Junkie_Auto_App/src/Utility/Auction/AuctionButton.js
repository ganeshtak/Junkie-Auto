import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, Font, FontSize, h, totalSize, w } from '../../Style/baseStyle';



export const AuctionButton = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={{ ...styles.text }}>Buy now</Text>
      </TouchableOpacity>
      <View style={styles.verticleLine}></View>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        <Text style={{ ...styles.text }}>Pre-Bid</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderColor: colors.hexGray,
    marginTop: totalSize(2),
    width: w(90),
    backgroundColor: colors.white,
    height: h(7),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: .3,
    flexDirection: 'row',
  },
  button: {
    width: w(40),
    height: h(6),
  },
  verticleLine: {
    height: '100%',
    width: 1,
    opacity: .9,
    backgroundColor: colors.hexGray,
  },
  text: {
    paddingTop: 6,
    fontFamily: Font.regular,
    color: colors.black,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
});