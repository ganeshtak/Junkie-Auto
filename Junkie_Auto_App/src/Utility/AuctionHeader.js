import React from "react";
import { View, Text } from 'react-native';
import { Icons } from "../Asset/Icon";
import { TextKey } from "../Constant/Language";
import { getLangText } from "../Store/Actions/LangAction";
import { colors, spacer, totalSize, w, searchInputHeight } from "../Style/baseStyle";
import { Button } from "./AppButton";
import { SearchInput } from './SearchInput';



const FilterDot = ({
    size = totalSize(1.2),
    color = colors.green,
}) => {
    return (
        <View
            style={{
                width: size,
                height: size,
                backgroundColor: color,
                borderRadius: size,
                position: 'absolute',
                top: -3,
                right: -3
            }}
        />
    )
}

const HeaderButton = ({
    onPress,
    children,
    size = searchInputHeight,
    isShowDot = false
}) => {
    return (
        <Button
            onPress={onPress}
            style={{
                width: size,
                height: size,
                borderRadius: 5,
                borderColor: colors.gray,
                borderWidth: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: spacer
            }}>
            {
                children
            }
            {
                isShowDot && <FilterDot />
            }
        </Button>
    )
}

export const Header = ({
  filterOnPress,
  searchOnPress,
  onChangeText,
  isFilterActive = false,
  placeholder = `${getLangText(TextKey.DashBoardSearchText)}`,
  editable = true,
  onPress,
  isSearchActive,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacer,
        paddingHorizontal: spacer,
      }}>
      <View style={{flex: 1}}>
        <SearchInput
          placeholder={placeholder}
          textColor={colors.gray}
          onChangeText={onChangeText}
          editable={editable}
          onPress={onPress}
        />
      </View>

      {filterOnPress ? (
        <HeaderButton onPress={filterOnPress} isShowDot={isFilterActive}>
          <Icons.FilterIcon size={totalSize(2)} color={colors.primary} />
        </HeaderButton>
      ) : null}
      {searchOnPress ? (
        <HeaderButton onPress={searchOnPress} isShowDot={isSearchActive}>
          <Icons.SearchIcon size={totalSize(2)} color={colors.primary} />
        </HeaderButton>
      ) : null}
    </View>
  );
};