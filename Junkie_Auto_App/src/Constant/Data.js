import React from "react";
import { Icons } from "../Asset/Icon";
import { getEnglishText, getLangText, getSpanishText } from "../Store/Actions/LangAction";
import { colors, totalSize } from "../Style/baseStyle";
import { English, TextKey } from "./Language";

export const AppStatusType = {
  splash: 0,
  language: 1,
  slider: 2,
  auth: 3,
  dashboard: 4,
}



export const CarOfferType = [
  "All",
  "New",
  "Used",
  "Junk"
];

export const CarOfferTypeLang = {
  en: [
    getEnglishText(TextKey.All),
    getEnglishText(TextKey.New),
    getEnglishText(TextKey.Used),
    getEnglishText(TextKey.Junk),
  ],
  es: [
    getSpanishText(TextKey.All),
    getSpanishText(TextKey.New),
    getSpanishText(TextKey.Used),
    getSpanishText(TextKey.Junk),
  ],
}

export const BusinessType = [
  `${getLangText(TextKey.RegisterIndividual)}`,
  `${getLangText(TextKey.RegisterBusiness)}`,
];

export const BusinessTypeLang = {
  en: [
    getEnglishText(TextKey.RegisterIndividual),
    getEnglishText(TextKey.RegisterBusiness)
  ],
  es: [
    getSpanishText(TextKey.RegisterIndividual),
    getSpanishText(TextKey.RegisterBusiness)
  ]
};

export const UserType = {
  seller: `${getLangText(TextKey.Seller)}`,

  buyer: `${getLangText(TextKey.Buyer)}`,
};

export const AuctionStatus = [
  // only static do not change lang
  "Used",
  "Junk",
  "New",
  "All",

  // `${getLangText(TextKey.Used)}`,
  // `${getLangText(TextKey.Junk)}`,
  // `${getLangText(TextKey.New)}`,
  // `${getLangText(TextKey.All)}`,
];


export const ProfileTypes = {
  myAuction: "myAuction",
  myBids: "myBids",
  payment: "payment",
  postNewAuction: "postNewAuction",
  searchAuction: "searchAuction",
  savedSearch: "savedSearch",
  logout: "logout",
  expiredAuction: "expiredAuction",
}

export const ScreenTypes = {
  myAuction: "myAuction",
  dashboard: "dashboard",
  all_auction_list: "all_auction_list",
  bid_list: "bid_list",
  search_auction: "search_auction",
  profile: "profile",
  savedSearch: "savedSearch",
  editAuction: "editAuction",
  addNewAuction: "addNewAuction",
}

export const AuctionStatusTypes = {
  cancel: 0,
  pending: 1,
  active: 2,
  sold: 3,
  closed: 5,
  expired_close: 6,
}

export const UserStatus = {
  pending: 0,
  active: 1,
  reject: 2,
}

export const BidBuyTypes = {
  bid: "bid",
  direct_buy: "direct_buy",
  pre_bid: "pre_bid",
}

export const AuctionStatusTypesText = [
  `${getLangText(TextKey.Pending)}`,

  `${getLangText(TextKey.Sold)}`,

  `${getLangText(TextKey.Active)}`,
  `${getLangText(TextKey.Canceled)}`,

  `${getLangText(TextKey.Closed)}`,
];

export const AuctionStatusTypesTextLang = {
  en: [
    getEnglishText(TextKey.Pending),
    getEnglishText(TextKey.Sold),
    getEnglishText(TextKey.Active),
    getEnglishText(TextKey.Canceled),
    getEnglishText(TextKey.Closed)
  ],
  es: [
    getSpanishText(TextKey.Pending),
    getSpanishText(TextKey.Sold),
    getSpanishText(TextKey.Active),
    getSpanishText(TextKey.Canceled),
    getSpanishText(TextKey.Closed)
  ],
}

export const BidStatus = {
  active: `${getLangText(TextKey.ActiveAuction)}`,
  won: `${getLangText(TextKey.WonAuction)}`,
  lost: `${getLangText(TextKey.LostAuction)}`,
};


export const BidStatusLang = {
  en: [
    getEnglishText(TextKey.ActiveAuction),
    getEnglishText(TextKey.WonAuction),
    getEnglishText(TextKey.LostAuction)
  ],
  es: [
    getSpanishText(TextKey.ActiveAuction),
    getSpanishText(TextKey.WonAuction),
    getSpanishText(TextKey.LostAuction)
  ]
}

export const BidType = {
  active: 1,
  reject: 0,
}

export const AuctionSortTypes = [
  `${getLangText(TextKey.SearchPost_Date)}`,
  //   `${getLangText(TextKey.Car_Name)}`,
  `${getLangText(TextKey.Closing_Time)}`,
  `${getLangText(TextKey.Nearest_Location)}`,
  //   'Post by date',
  //   //"Car name",
  //   'Closing time',
  //   'Nearest car locations',
];

export const AuctionSortTypesLang = {
  en: [
    getEnglishText(TextKey.SearchPost_Date),
    getEnglishText(TextKey.Closing_Time),
    getEnglishText(TextKey.Nearest_Location)
  ],
  es: [
    getSpanishText(TextKey.SearchPost_Date),
    getSpanishText(TextKey.Closing_Time),
    getSpanishText(TextKey.Nearest_Location)
  ]
}

export const DocType = [
  `${getLangText(TextKey.Doc_Type_Id)}`,
  `${getLangText(TextKey.Doc_Type_Driving_License)}`,
  `${getLangText(TextKey.Doc_Type_Greeb_card)}`,
  `${getLangText(TextKey.Doc_Type_Passport)}`,
  // "Id card",
  // "Driving license",
  // "Green card",
  // "Passport",
  // "Dealer license",
  // "Certificate of insurance",
];

export const DocTypeLang = {
  en: [
    {
      value: getEnglishText(TextKey.Doc_Type_Id),
      key: "Id card",
    },
    {
      value: getEnglishText(TextKey.Doc_Type_Driving_License),
      key: "Driving license",
    },
    {
      value: getEnglishText(TextKey.Doc_Type_Greeb_card),
      key: "Green card",
    },
    {
      value: getEnglishText(TextKey.Doc_Type_Passport),
      key: "Passport",
    }
  ],
  es: [
    {
      value: getSpanishText(TextKey.Doc_Type_Id),
      key: "Id card",
    },
    {
      value: getSpanishText(TextKey.Doc_Type_Driving_License),
      key: "Driving license",
    },
    {
      value: getSpanishText(TextKey.Doc_Type_Greeb_card),
      key: "Green card",
    },
    {
      value: getSpanishText(TextKey.Doc_Type_Passport),
      key: "Passport",
    }
  ]
}

export const BusinessDocTypes = [
  `${getLangText(TextKey.Doc_Type_Dealer_License)}`,
  `${getLangText(TextKey.Doc_Type_Certificate_Of_Issue)}`,
];

export const BusinessDocTypesLang = {
  en: [
    {
      value: getEnglishText(TextKey.Doc_Type_Dealer_License),
      key: "Dealer license",
    },
    {
      value: getEnglishText(TextKey.Doc_Type_Certificate_Of_Issue),
      key: "Certificate of insurance",
    }
  ],
  es: [
    {
      value: getSpanishText(TextKey.Doc_Type_Dealer_License),
      key: "Dealer license",
    },
    {
      value: getSpanishText(TextKey.Doc_Type_Certificate_Of_Issue),
      key: "Certificate of insurance",
    }
  ]
}


const iconSize = totalSize(1.8);
const iconColor = colors.gray;

export const NewAuctionProperty = {
  status: {
    type: 'status',
    title: 'Status',
  },
  used_type: {
    type: 'used_type',
    title: `${getLangText(TextKey.Used_type)}`,
    editType: 'used_type_name',
  },
  make: {
    type: 'make',
    title: 'Make',
  },
  model: {
    type: 'model',
    title: 'Model',
  },
  year: {
    type: 'year',
    title: 'Year',
  },
  mileage: {
    type: 'mileage',
    title: 'Mileage',
  },
  damage_type: {
    type: 'damage_type',
    title: 'Damage Type',
    editType: 'damage_filter_name',
  },
  vin: {
    type: 'vin',
    title: 'VIN',
  },
  driveLine_type: {
    type: 'drive_line_type',
    title: 'DriveLine type',
    editType: 'drive_line_name',
  },
  fuel: {
    type: 'fuel_type',
    title: 'Fuel Type',
    editType: 'fule_name',
  },
  transmission: {
    type: 'transmission',
    title: 'Transmission',
    editType: 'transmission_name',
  },
  color: {
    type: 'color',
    title: 'Color',
    editType: 'color_name',
  },
  location: {
    type: 'location',
    title: 'Location',
  },
  catalytic_convertor: {
    type: 'catalytic_convertor',
    title: 'Catalytic convertor',
    editType: 'catalytic_convertor_name',
  },
  title_status: {
    type: 'title_status',
    title: 'Title status',
    editType: 'title_status_name',
  },
  clean_title: {
    type: 'clean_title',
    title: 'Clean title',
    editType: 'clean_title_name',
  },
  start_price: {
    type: 'start_price',
    title: 'Start price',
  },
  end_price: {
    type: 'end_price',
    title: 'End price',
  },
  start_date: {
    type: 'start_date',
    title: 'Start date',
  },
  end_date: {
    type: 'end_date',
    title: 'End date',
  },
  body_type: {
    type: 'body_type',
    title: 'body type',
    editType: 'body_name',
  },
  secondary_damage_type: {
    type: 'secondary_damage_type',
    title: 'secondary_damage_type',
    editType: 'secondary_damage_name',
  },
};

export const NewAuctionFieldType = [
  {
    title: NewAuctionProperty.status.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.status.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.make.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.make.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.model.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.model.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.year.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.year.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.mileage.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.mileage.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.damage_type.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.damage_type.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.driveLine_type.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.driveLine_type.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.fuel.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.fuel.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.transmission.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.transmission.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.color.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.color.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.location.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.location.type,
    icon: <Icons.Location size={iconSize * 2 * .8} color={iconColor} />
  },
  {
    title: NewAuctionProperty.catalytic_convertor.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.catalytic_convertor.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.title_status.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.title_status.type,
    icon: <Icons.Document size={iconSize} />
  },

  {
    title: NewAuctionProperty.clean_title.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.clean_title.type,
    icon: <Icons.Document size={iconSize} />
  },
  {
    title: NewAuctionProperty.start_price.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.start_price.type,
    is_local_field: true,
    is_numeric_keyboard: true,
  },
  {
    title: NewAuctionProperty.end_price.title,
    rightArrow: true,
    value: undefined,
    options: [],
    type: NewAuctionProperty.end_price.type,
    is_local_field: true,
    is_numeric_keyboard: true,
  },

]



export const NotificationType = {
  auction_reject: "auction_reject",
  auction_accept: "auction_accept",
  seller: "seller",
  buyer: "buyer",
};