import React from "react";
import { View, Text, Modal, FlatList } from 'react-native';
import { Fonts } from "../../Asset/Font";
import { colors, FontSize, shadow, spacer, w } from "../../Style/baseStyle";
import { AppHeading } from '../AppHeading';
import { AuctionSortTypes, AuctionSortTypesLang } from '../../Constant/Data';
import { Button } from "../AppButton";
import { getLangText, lang_code } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";
import { AppConstant } from "../../Constant/AppConstant";


const SearchItem = ({
  title,
  onPress,
  is_selected
}) => {
  return (
    <Button
      onPress={onPress}
      style={{
        paddingVertical: spacer * .5
      }}>
      <Text style={{
        fontSize: FontSize.md,
        fontFamily: Fonts.regular,
        color: is_selected ? colors.green : colors.gray
      }}>{title}</Text>
    </Button>
  )
}


export const AuctionSortModel = ({
  statusList = AppConstant.selected_lang == lang_code.en
    ? AuctionSortTypesLang.en
    : AuctionSortTypesLang.es,
  num_of_column = 3,
  onPress,
  status,
  defaultStatus = 'New',
  closeOnPress,
  resetFilterOnPress,
  selectedSearchTypeIndex,
  resetFilterOnPress,
}) => {
  React.useEffect(() => {}, []);
  const [selectedStatus, setStatus] = React.useState(status);

  const closeModel = () => {
    closeOnPress && closeOnPress();
  };

  const onItemPress = (item, index) => {
    onPress && onPress(item, index);
    closeModel();
  };

  const resetOnPress = () => {
    closeModel();
    resetFilterOnPress && resetFilterOnPress();
  };

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
            title={getLangText(TextKey.Search_Sort_Status)}
            fontSize={FontSize.mdl}
          />
          <FlatList
            data={statusList}
            renderItem={({item, index}) => {
              return (
                <SearchItem
                  title={item}
                  onPress={() => onItemPress(item, index)}
                  is_selected={selectedSearchTypeIndex == index}
                />
              );
            }}
          />

          <View
            style={{
              backgroundColor: colors.lightWhite,
              height: 1,
              width: '100%',
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
                {' '}
                {getLangText(TextKey.Reset)}
              </Text>
            </Button>
          </View>
        </View>
      </Button>
    </Modal>
  );
};