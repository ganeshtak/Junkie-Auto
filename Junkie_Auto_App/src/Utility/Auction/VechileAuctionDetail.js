import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Fonts } from '../../Asset/Font';
import { colors, FontSize, totalSize } from '../../Style/baseStyle';

export const VechileAuctionDetail = () => {
  const arrayItem = [
    { id: 1, startPrice: 'Damage Type', EndPrice: 'Rear End' },
    { id: 2, startPrice: 'Secondary damage:', EndPrice: 'Minor', },
    { id: 3, startPrice: 'Odometer: :', EndPrice: '247765', },
    { id: 4, startPrice: 'Driveline type: ', EndPrice: 'Rear-Wheel Drive' },
    { id: 5, startPrice: 'Body type: :', EndPrice: 'Sedan 4d' },
    { id: 6, startPrice: 'VIN: ', EndPrice: 'THBN36F140166328' },
    { id: 7, startPrice: 'Transmission: ', EndPrice: 'Automatic' },
    { id: 8, startPrice: 'Color', EndPrice: 'Black' },
    { id: 9, startPrice: 'Dent/Scratches', EndPrice: 'No' },
  ];
  return (
    <View
      style={{
        flex: 1,
        borderWidth: 1,
        borderRadius: 4,
        borderColor: colors.hexGray,

        // paddingHorizontal: 16,
      }}>
      <View style={{ flexDirection: 'row', justifyContent: "space-around" }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignSelf: 'center',
            // marginRight: 20,
          }}>
          <Text style={{ fontFamily: Fonts.regular, fontSize: FontSize.lg }}>
            Start Price
          </Text>
          <Text style={{ fontFamily: Fonts.bold, textAlign: "center", fontSize: FontSize.lg }}>
            $6000
          </Text>
        </View>

        <View style={styles.verticleLine}></View>

        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-end',
            // marginLeft: 20,
          }}>
          <Text style={{ fontFamily: Fonts.regular, fontSize: FontSize.lg }}>
            End Price
          </Text>
          <Text style={{ fontFamily: Fonts.bold, fontSize: FontSize.lg, textAlign: "center" }}>
            $5000
          </Text>
        </View>
      </View>
      <View
        style={{
          borderWidth: 0.5,
          opacity: .4,
          borderColor: 'black',
          // margin: 10,
          width: "100%"
        }}
      />
      {arrayItem.map((item, value) => {
        return (
          <View key={String(value)} style={{ flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 5, paddingLeft: 20, }}>
            <View style={{ width: '50%', }}>
              <Text
                style={{
                  opacity: .8,
                  fontFamily: Fonts.regular,
                  fontSize: FontSize.mdl,
                }}>
                {item.startPrice}
              </Text>
            </View>
            <View style={{ width: "50%" }
            }>
              <Text
                style={{
                  opacity: .8,
                  paddingLeft: 10,
                  color: colors.hexGray,
                  fontFamily: Fonts.regular,
                  fontSize: FontSize.mdl,
                }}>
                {item.EndPrice}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  verticleLine: {
    height: '100%',
    width: 1,
    opacity: 0.5,
    backgroundColor: colors.hexGray,
  },
  first: {
    height: 40,
    width: 40
  },
  sec: {
    backgroundColor: 'red'
  }
});