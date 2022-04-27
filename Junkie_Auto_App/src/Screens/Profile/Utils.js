import React from "react";
import { Icons } from "../../Asset/Icon";
import { ProfileTypes } from "../../Constant/Data";
import { TextKey } from "../../Constant/Language";
import { getLangText } from "../../Store/Actions/LangAction";
import { colors, totalSize } from "../../Style/baseStyle";
import {
    DollarIcon,
    PostNewAuctionIcon, SearchIcon,
    BidIcon,
    SavedSearchIcon,
    LogoutIcon,
    AuctionIcon
} from './ProfileIcons';

const iconSize = totalSize(2.6);
const iconColor = colors.red;
const LogoutType = "LogoutType";



export const ProfileData = [
    {
        title: `${getLangText(TextKey.My_Profile)}`,
        icon: <Icons.UserIcon size={iconSize} color={iconColor} />,
        type: ProfileTypes.payment,
        screen: 'EditProfile',
        isLoginRequired: true,
        //isUserVerificationRequired: true,
    },
    {
        title: `${getLangText(TextKey.Profile_payment)}`,
        icon: <DollarIcon size={iconSize} color={iconColor} />,
        type: ProfileTypes.payment,
        //screen: "Payment",
        isLoginRequired: true,
        isUserVerificationRequired: true,
    },
    {
        title: `${getLangText(TextKey.Profile_Post_New_Auction)}`,
        icon: <PostNewAuctionIcon size={iconSize} color={iconColor} />,
        type: ProfileTypes.postNewAuction,
        screen: 'AddNewAuction',
        isLoginRequired: true,
        isUserVerificationRequired: true,
    },
    {
        title: `${getLangText(TextKey.Expired_auction)}`,
        icon: <Icons.ExpireIcon size={iconSize} color={iconColor} />,
        type: ProfileTypes.expiredAuction,
        screen: 'ExpiredAuction',
        isLoginRequired: true,
        isUserVerificationRequired: true,
        textColor: colors.red,
        leftSpace: totalSize(-0.2),
        topSpace: totalSize(0),
    },
    {
        title: `${getLangText(TextKey.Profile_Search_Auction)}`,
        icon: <SearchIcon size={iconSize} color={iconColor} />,
        leftSpace: totalSize(0.3),
        topSpace: totalSize(0.2),
        type: ProfileTypes.searchAuction,
        screen: 'SearchAuction',
        //isLoginRequired: true
    },

    {
        title: `${getLangText(TextKey.Profile_Saved_Search)}`,
        icon: <SavedSearchIcon size={iconSize} color={iconColor} />,
        leftSpace: totalSize(0.1),
        type: ProfileTypes.savedSearch,
        screen: 'SavedSearch',
        isLoginRequired: true,
    },
    {
        title: `${getLangText(TextKey.Profile_My_Bids)}`,
        icon: <BidIcon size={iconSize} color={iconColor} />,
        leftSpace: totalSize(0.2),
        type: ProfileTypes.myBids,
        screen: 'MyBid',
        isLoginRequired: true,
    },
    {
        title: `${getLangText(TextKey.Profile_My_Auction)}`,
        icon: <AuctionIcon size={iconSize} color={iconColor} />,
        leftSpace: totalSize(0.3),
        type: ProfileTypes.myAuction,
        screen: 'MyAuction',
        isLoginRequired: true,
    },
    {
        title: `${getLangText(TextKey.My_Wishlist)}`,
        icon: <Icons.HeartIcon size={iconSize * 0.8} color={iconColor} />,
        leftSpace: totalSize(0),
        type: ProfileTypes.myAuction,
        screen: 'MyWishList',
        isLoginRequired: true,
    },
    {
        title: `${getLangText(TextKey.Profile_Logout)}`,
        icon: <LogoutIcon size={iconSize} color={iconColor} />,
        leftSpace: totalSize(0.4),
        topSpace: totalSize(0.3),
        type: ProfileTypes.logout,
    },
];