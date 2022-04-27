import React from "react";
import { View, Text, Modal, FlatList } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, FontSize, shadow, spacer, w } from "../../Style/baseStyle";
import { AppHeading } from '../AppHeading';
import { AuctionStatus } from '../../Constant/Data';
import { Button } from "../AppButton";
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";



const Btn = ({
  onPress,
  title,
  isSelected = false
}) => {
  return (
    <Button
      onPress={onPress}
      style={{
        paddingVertical: spacer * .5,
        paddingHorizontal: spacer,
        borderColor: colors.gray,
        borderWidth: 1,
        borderRadius: spacer,
        width: w(25),
        marginRight: w(25) / 4,
        marginBottom: spacer,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isSelected ? colors.primary : colors.white
      }}>
      <Text style={{
        fontFamily: Fonts.regular,
        color: isSelected ? colors.white : colors.black,
        fontSize: FontSize.md
      }}>{title}</Text>
    </Button>
  )
}

export const AuctionSearchModel = ({
  statusList = AuctionStatus,
  num_of_column = 3,
  statusOnPress,
  status,
  defaultStatus = "All",
  closeOnPress,
  resetStatusOnPress,

}) => {

  React.useEffect(() => { }, [])
  const [selectedStatus, setStatus] = React.useState(status);

  const _statusOnPress = (status) => {
    setStatus(status);
    statusOnPress && statusOnPress(status)
  }

  const resetOnPress = () => {
    setStatus(defaultStatus);
    closeModel();
    resetStatusOnPress && resetStatusOnPress();
  }

  const closeModel = () => {
    closeOnPress && closeOnPress();
  }

  return (
    <Modal transparent animationType="slide">
      <Button
        activeOpacity={1}
        onPress={closeModel}
        style={{
          flex: 1,
          backgroundColor: colors.model,
        }}>
        <View
          style={{
            position: 'absolute',
            width: w(100),
            //height: 500,
            backgroundColor: colors.white,
            bottom: 0,
            padding: spacer,
            ...shadow[2],
          }}>
          <AppHeading
            title={getLangText(TextKey.Search_Status)}
            fontSize={FontSize.mdl}
          />
          <FlatList
            data={statusList}
            contentContainerStyle={{
              marginTop: spacer * 0.8,
            }}
            numColumns={num_of_column}
            renderItem={({ item, index }) => {
              return (
                <Btn
                  title={getLangText(item)}
                  isSelected={item == selectedStatus}
                  onPress={() => _statusOnPress(item)}
                />
              );
            }}
          />

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: colors.lightWhite,
              marginVertical: spacer,
            }}
          />

          <View
            style={{
              marginVertical: 0,
              alignItems: 'center',
            }}>
            <Button onPress={resetOnPress}>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  color: colors.red,
                  fontSize: FontSize.lg,
                }}>
                {getLangText(TextKey.Reset)}
              </Text>
            </Button>
          </View>
        </View>
      </Button>
    </Modal>
  );
}