import { StatusBar } from 'react-native';
import {
    languageCode,
    English,
    Spanish
} from './Language';


//============================ this is app constants=======================

class AppConstant {
    static bearer_token = undefined;
    static fcm_token = undefined;

    static selected_lang = languageCode.en

    static statusbar_height = StatusBar.currentHeight;

    static navigation = undefined;

    static isParentScreenProfile = false;

    static isNetworkConnected = true;

    static reSetData = () => {
        this.bearer_token = undefined;
        this.isParentScreenProfile = false;
    }


    static setBearerToken(token) {
        console.log("==================User Token==============", token);
        this.bearer_token = token
    }
}

//================================= user details==========================

class UserConstant {
    static user_id = undefined;
    static f_name = undefined;
    static l_name = undefined;
    static email = undefined;
    static mobile = undefined;
    static image = undefined;
    static address = undefined;
    static city = undefined;
    static state = undefined;
    static country = undefined;
    static user_status = undefined;
    static user_image = undefined;

    static reSetData = () => {
        this.user_id = undefined;
        this.f_name = undefined;
        this.l_name = undefined;
        this.email = undefined;
        this.image = undefined;
        this.address = undefined;
        this.city = undefined;
        this.state = undefined;
        this.country = undefined;
        this.user_status = undefined;
        this.mobile = undefined;
        this.user_image = undefined;
    }

    static isUserLogged = () => {
        if (this.user_id) {
            return true
        }
        return false
    }
}


//================================= for auction used types=========================


class FilterConstant {
    static used_type = undefined;
    // obj={
    // id: "",
    // name: ""
    // }


    static getStatusById = (id) => {
        let name = undefined;
        if (this.used_type) {
            for (let i = 0; i < this.used_type.length; i++) {
                const item = this.used_type[i];
                if (item?.id == id) {
                    name = item?.name;
                    break;
                }
            }
            if (name) {
                return name
            }
        }
        return id
    }
}

//===================================== for my wishlist==========================

class WishlistConstant {
    static wishListId = [];

    static isAddedToMyWishlist = (id) => {
        return this.wishListId.includes(id);
    }
}

export {
    AppConstant,
    UserConstant,
    FilterConstant,
    WishlistConstant
}