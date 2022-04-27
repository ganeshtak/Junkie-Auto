import React from "react";
import { View } from 'react-native';
import { AppScreens } from "../Screens";
import { TabNavigator } from './Tab/TabNavigator';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { StyleSheet } from "react-native";
import { colors, FontSize, spacer, totalSize } from "../Style/baseStyle";
import { Fonts } from "../Asset/Font";
import { Icons } from "../Asset/Icon";
import { Button } from '../Utility/AppButton';
import { AuthNavigator } from './StackNavigator';
import { getLangText } from "../Store/Actions/LangAction";
import { TextKey } from "../Constant/Language";


const Stack = createStackNavigator();


export const AppRouteNavigator = () => (
  <Stack.Navigator
    initialRouteName="TabNavigator"
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      headerTitleAlign: 'center',
    }}>
    <Stack.Screen
      component={TabNavigator}
      name="TabNavigator"
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      name="AuthNavigator"
      component={AuthNavigator}
      options={{
        headerShown: false,
      }}
    />

    {/* <Stack.Screen component={AppScreens.Login} name="Login"
            options={{
                ...HeaderOptions({ title: "Login" })
            }}
        />
        <Stack.Screen component={AppScreens.Register} name="Register"
            options={{
                ...HeaderOptions({ title: "Register" })
            }}
        /> */}

    <Stack.Screen
      component={AppScreens.Profile}
      name="Profile"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      component={AppScreens.SearchLocation}
      name="SearchLocation"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      component={AppScreens.AuctionDetail}
      name="AuctionDetail"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      component={AppScreens.EditProfile}
      name="EditProfile"
      options={{
        headerShown: false,
      }}
    />

    <Stack.Screen
      component={AppScreens.SearchAddress}
      name="SearchAddress"
      options={{
        headerShown: false,
      }}
    />

    {/* for Auctions */}
    <Stack.Screen
      component={AppScreens.MyAuction}
      name="MyAuction"
      options={{
        ...HeaderOptions({ title: `${getLangText(TextKey.Profile_My_Auction)}` }),
      }}
    />
    <Stack.Screen
      component={AppScreens.SearchAuction}
      name="SearchAuction"
      options={{
        ...HeaderOptions({
          title: `${getLangText(TextKey.DashBoardSearchText)}`,
        }),
      }}
    />
    <Stack.Screen
      component={AppScreens.SavedSearch}
      name="SavedSearch"
      options={{
        ...HeaderOptions({ title: `${getLangText(TextKey.Saved_searches)}` }),
      }}
    />
    <Stack.Screen
      component={AppScreens.AddNewAuction}
      name="AddNewAuction"
      options={{
        //...HeaderOptions({ title: "Post new auction" })
        headerShown: false,
      }}
    />
    <Stack.Screen
      component={AppScreens.SearchAuctionList}
      name="SearchAuctionList"
      options={{
        ...HeaderOptions({ title: `${getLangText(TextKey.Auction_List)}` }),
      }}
    />
    <Stack.Screen
      component={AppScreens.ExpiredAuction}
      name="ExpiredAuction"
      options={{
        ...HeaderOptions({ title: `${getLangText(TextKey.Expired_auction)}` }),
      }}
    />

    {/* for my bids */}
    <Stack.Screen
      component={AppScreens.MyBid}
      name="MyBid"
      options={{
        ...HeaderOptions({ title: `${getLangText(TextKey.Profile_My_Bids)}` }),
      }}
    />

    {/* myWishlist */}
    <Stack.Screen
      component={AppScreens.MyWishList}
      name="MyWishList"
      //options={({ route }) => ({ title: route?.params?.name })}
      options={{
        ...HeaderOptions({ title: `${getLangText(TextKey.My_Wishlist)}` }),
      }}
    />
  </Stack.Navigator>
);

export const HeaderOptions = ({ title, route }) => {
  return {
    headerTitle: route?.params?.name ? route?.params?.name : title,
    headerTitleStyle: {
      ...styles.titleStyle,
    },
    headerLeft: (props) => <BackButton {...props} />
  }
}

const BackButton = (props) => {
  return (
    <Button
      onPress={() => props?.onPress()}
      style={{
        marginLeft: spacer,
        top: 3
      }}>
      <Icons.BackIcon size={totalSize(3)}
        color={colors.black}
      />
    </Button>
  )
}



export const styles = StyleSheet.create({
  titleStyle: {
    fontSize: FontSize.lg,
    fontFamily: Fonts.regular,
    color: colors.black
  }
})