import React from "react";
import { View, Text, FlatList, InteractionManager, ActivityIndicator, RefreshControl } from 'react-native';
import { colors, FontSize, h, spacer, totalSize, w } from "../../Style/baseStyle";
import { AppContainer } from '../../Utility/AppContainer';
import { AppButton, Button } from '../../Utility/AppButton';
import { SearchInput } from '../../Utility/SearchInput';
import { Icons } from "../../Asset/Icon";
import { AppHeading } from '../../Utility/AppHeading';
import { CarAuctions } from '../../Utility/Card/CarAuctions';
import { AuctionSearchModel } from '../../Utility/Modal/AuctionSearchModel';
import { AuctionSortModel } from '../../Utility/Modal/AuctionSortModel';
import { Header } from '../../Utility/AuctionHeader';
import { AuctionSortTypes, AuctionStatus, ScreenTypes } from "../../Constant/Data";
import {
  getAllAuctionList, getAuctionDetail,
  auctionFilterByQuery, getSearchQuery
} from '../Auctions/Utils';
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { MSG } from '../../Constant/Message';
import { FilterConstant, WishlistConstant } from "../../Constant/AppConstant";
import { AppDatePicker, getCustomDate } from '../../Utility/AppDatePicker';
import { getDateFormat } from "../../Constant/Helper/TimeAndDate";
import moment from "moment";
import { getWishList, addToWishList, removeFromWishList } from '../Wishlist/Utils';
import { TextKey } from "../../Constant/Language";
import { getLangText } from "../../Store/Actions/LangAction";


export const FooterActivity = ({
  size = 10
}) => {
  return (
    <View style={{
      alignItems: 'center',
      marginVertical: spacer
    }}>
      <ActivityIndicator
        size="large"
        color={colors.red}
      />
    </View>
  )
}

class AuctionList extends React.Component {

  state = {
    filterModel: false,
    searchModal: false,
    selectedStatus: "All",
    last_page: undefined,
    all_auction_list: [],
    list: [],
    page: 1,
    datePicker: false,
    wishListIds: [],
    demo: "",
    list_activity: false,
    selectedSearchTypeIndex: undefined,
  }

  navigateToDetail = () => {
    this.props.navigation.navigate('AuctionDetail');
  }



  componentDidMount() {
    this.getAuctionList();
    //this.getWishlist();
    this.subscribe = this.props.navigation.addListener('focus', () => {
      //this.getAuctionList(1, [], true);
    })

  }

  componentWillUnmount() {
    this.subscribe && this.subscribe();
  }

  getWishlist = async () => {
    InteractionManager.runAfterInteractions(async () => {
      const res = await getWishList();
      if (res) {
        this.setState({
          wishListIds: res
        })
      }
    })
  }

  getAuctionList = async (page = this.state.page, prevData = this.state.list, spinner = true, callback) => {
    const res = await getAllAuctionList(page, spinner);
    callback && callback();
    if (res) {
      const list = [...prevData, ...res?.all_auction_list];
      this.setState({
        last_page: res?.last_page,
        //all_auction_list: res?.all_auction_list,
        list: list,
        page: page,
      }, () => {
        this.searchAuctionByStatus(this.state.selectedStatus, list);
      });
    }
    else {
      this.setState({
        last_page: undefined,
        all_auction_list: [],
        list: [],
        page: 1,
      });
    }
  }

  getAuctionDetail = async (id) => {
    const res = await getAuctionDetail(id, ScreenTypes.all_auction_list);
  }

  searchAuctionByStatus = (status, list = this.state.list) => {

    if (status == "All") {
      this.setState({
        all_auction_list: list,
        searchModal: false,
        selectedStatus: status,
      });
      return
    }

    if (list.length > 0) {
      const res = list.filter((item) => {
        const status_name = FilterConstant.getStatusById(item?.used_type);
        if (status_name && String(status_name).toLocaleLowerCase() == String(status).toLocaleLowerCase()) {
          return true
        }
        return false
      });
      this.setState({
        all_auction_list: res,
        searchModal: false,
        selectedStatus: status
      });
      return
    }
    this.setState({
      all_auction_list: [],
      searchModal: false,
      selectedStatus: status
    })
  }

  searchBid = (txt) => {
    if (txt == "") {
      this.searchAuctionByStatus(this.state.selectedStatus, this.state.list);
      // this.setState({
      //     all_auction_list: this.state.list
      // })
      return
    }

    const res = this.state.list.filter((item) => {
      const name = "make_name" in item ? item?.make_name[0]?.name : "";
      if (name && String(name).toLocaleLowerCase().match(String(txt).trim().toLocaleLowerCase())) {
        return true
      }
      return false
    });
    this.searchAuctionByStatus(this.state.selectedStatus, res);
    return
    this.setState({
      all_auction_list: res
    })
  }

  dateOnPress = async (date) => {
    if (date) {
      const _date = getDateFormat(date, true)
      if (_date) {
        const qry = getSearchQuery({ search_end: _date });

        const res = await auctionFilterByQuery(qry);

        if (res && res.status) {
          this.setState({
            last_page: res?.data?.meta?.last_page,
            all_auction_list: res?.data?.data,
            list: res?.data?.data,
            page: 1,
          });
        }
      }
    }
  }

  openDatePicker = () => {
    this.setState({
      datePicker: true
    })
  }



  wishListOnPress = async (id) => {
    if (WishlistConstant.isAddedToMyWishlist(id)) {
      const res = await removeFromWishList(id)
      this.setState({
        demo: ""
      })
      return
    }
    const res = await addToWishList(id);
    this.setState({
      demo: ""
    })
  }

  endReachOnPress = () => {
    if (this.state.page < this.state.last_page) {
      const nextPage = +this.state.page + 1;
      this.setState({ list_activity: true })
      this.getAuctionList(nextPage, this.state.list, false, () => {
        this.setState({ list_activity: false });
      });
    }
    return
  }

  searchPress = () => {
    this.props.navigation.navigate('SearchAuction')
  }

  refreshList = () => {
    this.setState({
      selectedSearchTypeIndex: undefined
    }, () => {
      this.getAuctionList(1, [], true);
    })

  }

  render() {
    return (
      <AppContainer>
        <Header
          onPress={this.searchPress}
          editable={false}
          searchOnPress={() => this.setState({ filterModel: true })}
          filterOnPress={() => this.setState({ searchModal: true })}
          onChangeText={this.searchBid}
          isFilterActive={['used', 'junk', 'new'].includes(
            String(this.state.selectedStatus).toLocaleLowerCase(),
          )}
          isSearchActive={[0, 1].includes(
            this.state.selectedSearchTypeIndex,
          )}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: spacer,
          }}>
          {this.state.all_auction_list.length > 0 && (
            <AppHeading
              title={getLangText(TextKey.Auction_Description)}
              fontSize={FontSize.md}
            />
          )}
          {this.state.all_auction_list.length > 0 ? (
            <FlatList
              data={this.state.all_auction_list}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={this.refreshList}
                />
              }
              keyExtractor={(I, i) => String(i)}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={() => {
                return (
                  <>
                    {this.state.list_activity ? <FooterActivity /> : null}
                  </>
                );
              }}
              onEndReachedThreshold={0.5}
              onEndReached={this.endReachOnPress}
              renderItem={({ item, index }) => {
                const name =
                  'make_name' in item ? item?.make_name[0]?.name : '';
                const model_name =
                  'model_name' in item ? item?.model_name[0]?.name : '';
                const total_bid =
                  'bid_data' in item && Array.isArray(item?.bid_data)
                    ? item?.bid_data.length
                    : 0;
                // const isWishlist = this.state.wishListIds.includes(item?.id);
                const isWishlist = WishlistConstant.isAddedToMyWishlist(
                  item?.id,
                );

                return (
                  <CarAuctions
                    start_price={item?.bid_price}
                    end_price={item?.bid_closed_price}
                    status={item?.used_type}
                    name={name}
                    model={model_name}
                    startDate={item?.bid_start}
                    endDate={item?.bid_end}
                    total_bid={total_bid}
                    image={
                      item?.auction_image.length > 0
                        ? item?.auction_image[0]?.media_url
                        : null
                    }
                    onPress={() => this.getAuctionDetail(item?.id)}
                    wishlistOnPress={() => this.wishListOnPress(item?.id)}
                    is_my_wishlist={isWishlist}
                  />
                );
              }}
            />
          ) : (
            <AppNoDataFound Height={h(70)}
              message={getLangText(TextKey.no_auction_found)} />
          )}
        </View>

        {this.state.searchModal && (
          <AuctionSearchModel
            // statusOnPress={(status) => this.setState({
            // searchModal: false,
            // selectedStatus: status
            // })}
            resetStatusOnPress={() => {
              this.setState({
                all_auction_list: this.state.list,
                selectedStatus: undefined,
              });
            }}
            statusOnPress={this.searchAuctionByStatus}
            status={this.state.selectedStatus}
            closeOnPress={() => this.setState({ searchModal: false })}
          />
        )}

        {this.state.filterModel && (
          <AuctionSortModel
            onPress={(item, index) => {
              if ([0].includes(index)) {
                this.openDatePicker();
                this.setState({
                  selectedSearchTypeIndex: index,
                });
                return;
              } else if (index == 1) {
                const date = moment(new Date()).format('DD-MM-YYYY');
                this.setState({
                  selectedSearchTypeIndex: index,
                });
                this.dateOnPress(date);
              }

              if (index == 2) {
                this.props.navigation.navigate('SearchLocation');
              }
            }}
            selectedSearchTypeIndex={this.state.selectedSearchTypeIndex}
            resetFilterOnPress={this.refreshList}
            closeOnPress={() => this.setState({ filterModel: false })}
          />
        )}
        {this.state.datePicker && (
          <AppDatePicker
            doneOnPress={this.dateOnPress}
            minDate={new Date()}
            maxDate={getCustomDate({ month: 1, dateRef: true })}
            cancelOnPress={() => this.setState({ datePicker: false })}
          />
        )}
      </AppContainer>
    );
  }
}


export default AuctionList;