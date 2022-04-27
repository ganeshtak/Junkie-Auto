// for Splash
import Splash from './Splash';

// for Auth screens
import Login from './AuthScreens/Login';
import Register from './AuthScreens/Register';
import ForgotPassword from './AuthScreens/ForgotPassword';
import OtpVerification from './AuthScreens/OtpVerification';
import ChangePassword from './AuthScreens/ChangePassword';

//Promotional Slider
import Slider from './PromotionalSlider/Slider';

//Dashboard
import Dashboard from './Dashboard/Dashboard';
import AuctionList from './Dashboard/AuctionList';


// Profile
import Profile from './Profile/Profile';
import EditProfile from './Profile/EditProfile';


//Auctions
import MyAuction from './Auctions/MyAuction';
import AuctionDetail from './Auctions/AuctionDetail';
import SearchAuction from './Auctions/SearchAuction';
import AddNewAuction from './Auctions/AddNewAuction';
import SearchAuctionList from '../Screens/Auctions/SearchAuctionList';
import ExpiredAuction from './Auctions/ExpiredAuction';

//Bids
import MyBid from './Bids/MyBid';


// Location
import SearchLocation from './SearchLocation/SearchLocation';
import SavedSearch from './Auctions/SavedSearch';
import { SearchAddress } from './SearchLocation/SearchAddress';

//wishlist
import MyWishList from './Wishlist/MyWishList';


// for Language
import LanguageScreen from '../Screens/Language/index';

export const AppScreens = {
    Splash,

    Login,
    Register,
    ForgotPassword,
    OtpVerification,
    ChangePassword,

    Slider,

    Dashboard,
    AuctionList,
    AddNewAuction,

    Profile,
    EditProfile,

    MyAuction,
    MyBid,

    SearchLocation,

    AuctionDetail,
    SearchAuction,
    SearchAuctionList,

    MyWishList,
    SavedSearch,
    LanguageScreen,
    SearchAddress,
    ExpiredAuction
}