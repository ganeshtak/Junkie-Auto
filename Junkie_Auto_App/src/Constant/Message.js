import React from "react";
import { Price_Format } from "./Helper/PriceFormat";



export const MSG = {
    logout: "Are you sure want to logout ?",
    not_available: "Not available",
    options_not_found: "No options available",
    no_auction_found: "No auction found yet",
    no_bid_found: "No bids found yet",
    reject_bid: (price) => `Are you sure to reject current bid ${Price_Format(price)}`,
    direct_buy_auction: (price) => `Are you sure want to direct buy this auction in ${Price_Format(price)} ?`,


    you_need_to_login: "You need to login first",
    you_not_verify: "You identity not verified yet, contact admin for more info",
    you_reject: "You are rejected by admin, contact admin for more info",
    make_winner_bid: (price) => `Are you sure to accept current bid ${Price_Format(price)}`,
    remove_auction_image: "Are you sure want to remove auction image ?",
    close_auction: "Are you sure want to close auction permanently ?",
    cancel_auction: "Are you sure want to cancel auction permanently ?",
    remove_item: "Are you sure want to remove selected item ?",
}