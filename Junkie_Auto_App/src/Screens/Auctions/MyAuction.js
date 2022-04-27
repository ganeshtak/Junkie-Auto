import React from "react";
import { View, Text, FlatList, RefreshControl, ScrollView } from 'react-native';
import { colors, FontSize, h, spacer } from "../../Style/baseStyle";
import { AppContainer } from '../../Utility/AppContainer';
import { AppHeading } from '../../Utility/AppHeading';
import { Header } from '../../Utility/AuctionHeader';
import { AppGridButton } from '../../Utility/AppGridButton';
import { CarAuctions } from '../../Utility/Card/CarAuctions';
import { getAuction } from './Utils';
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { MSG } from '../../Constant/Message';
import { getMyAuctionDetail, getAuctionEditData } from '../Auctions/Utils';
import {
  ScreenTypes, AuctionStatusTypesText, AuctionStatusTypes,
  AuctionStatusTypesTextLang
} from '../../Constant/Data';
import { getDateFormat } from "../../Constant/Helper/TimeAndDate";
import { AuctionSearchModel } from '../../Utility/Modal/AuctionSearchModel'
import { AppConstant, FilterConstant } from "../../Constant/AppConstant";
import { getDataForLang, getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";


class App extends React.Component {
  state = {
    my_auction: [],
    list: [],
    selectedTab: 1,
    filterModel: false,
    selectedFilterStatus: undefined,
  }

  componentDidMount() {
    this.getAuctionList();
    this.subscribe = this.props.navigation.addListener('focus', () => {
      this.getAuctionList();
    });
  }

  componentWillUnmount() {
    this.subscribe();
  }

  getAuctionList = async () => {
    const res = await getAuction();
    if (res && res.status) {
      const status = this.getSelectedTabStatus(this.state.selectedTab);
      const list = await this.filterAuctionByStatus(res?.data, status);
      this.setState({
        my_auction: list,
        list: res?.data,
      })
    }
  }

  getSelectedTabStatus = (index) => {
    const tab = parseInt(index);
    if (tab == 1) {
      return [AuctionStatusTypes.pending]
    }
    else if (tab == 2) {
      return [AuctionStatusTypes.sold]
    }
    else if (tab == 3) {
      return [AuctionStatusTypes.active]
    }
    else if (tab == 4) {
      return [AuctionStatusTypes.cancel, AuctionStatusTypes.expired_close]
    }
    else if (tab == 5) {
      return [AuctionStatusTypes.closed]
    }
  }

  navigateToDetail = (detail) => {
    this.props.navigation.navigate('AuctionDetail', { data: detail, from: ScreenTypes.myAuction });
  }


  getAuctionDetail = async (id) => {
    const res = await getMyAuctionDetail(id, ScreenTypes.myAuction);
  }

  filterAuctionByStatus = (list = [], status = [], filterType = this.state.selectedFilterStatus) => {

    if (list) {
      let res = list.filter((item) => {
        return [...status].includes(parseInt(item?.status));
      });

      if (filterType) {
        res = res.filter((item) => {
          const statusName = FilterConstant.getStatusById(item?.used_type);
          return statusName == filterType
        })
      }
      return res
    }
    return list
  }

  onTabPress = (i, tabItem, filterType = this.state.selectedFilterStatus) => {
    const list = this.state.list;
    let res = [];
    if (i == 1) {
      res = this.filterAuctionByStatus(list, [AuctionStatusTypes.pending], filterType)
    }
    else if (i == 2) {
      res = this.filterAuctionByStatus(list, [AuctionStatusTypes.sold], filterType)
    }
    else if (i == 3) {
      res = this.filterAuctionByStatus(list, [AuctionStatusTypes.active], filterType)
    }
    else if (i == 4) {
      res = this.filterAuctionByStatus(list, [AuctionStatusTypes.cancel, AuctionStatusTypes.expired_close], filterType);
    }
    else if (i == 5) {
      res = this.filterAuctionByStatus(list, [AuctionStatusTypes.closed], filterType)
    }

    this.setState({
      my_auction: res,
      selectedTab: i
    }, () => {

    })
  }

  searchBid = (txt) => {
    if (txt == "") {
      this.onTabPress(this.state.selectedTab, undefined, this.state.selectedFilterStatus);
      return
    }
    const res = this.state.list.filter((item) => {
      const name = "make_name" in item ? item?.make_name[0]?.name : "";
      if (name && String(name).toLocaleLowerCase().match(String(txt).trim().toLocaleLowerCase())) {
        return true
      }
      return false
    });
    this.setState({
      my_auction: res
    })

  }

  editOnPress = async (item) => {
    const res = await getAuctionEditData(item)
    if (res) {
      this.props.navigation.navigate('AddNewAuction', { data: res, from: ScreenTypes.editAuction });
    }
  }

  onStatusPress = (status) => {
    this.setState({
      filterModel: false,
      selectedFilterStatus: status == "All" ? undefined : status
    }, () => {
      this.onTabPress(this.state.selectedTab);
    });
  }

  render() {
    console.log(this.state.selectedTab)
    return (
      <AppContainer>
        <ScrollView
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                this.getAuctionList();
              }}
              refreshing={false}
            />
          }
        // nestedScrollEnabled
        >
          {this.state.list.length > 0 ? (
            <>
              <Header
                onChangeText={this.searchBid}
                filterOnPress={() => {
                  this.setState({ filterModel: true });
                }}
                isFilterActive={['used', 'junk', 'new'].includes(
                  String(
                    this.state.selectedFilterStatus,
                  ).toLocaleLowerCase(),
                )}
              />
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: spacer,
                }}>
                <AppGridButton
                  list={getDataForLang(AuctionStatusTypesTextLang)}
                  onPress={this.onTabPress}
                  selectedTab={this.state.selectedTab}
                />
                {this.state.my_auction.length > 0 ? (
                  <>
                    <View
                      style={{
                        marginTop: spacer * 0.8,
                      }}>
                      <AppHeading
                        title={getLangText(TextKey.Active_Auction_desc)}
                        fontSize={FontSize.md}
                      />
                    </View>
                    {
                      this.state.my_auction.map((item, index) => {
                        const name =
                          'make_name' in item
                            ? item?.make_name[0]?.name
                            : '';
                        const total_bid =
                          'bid_data' in item &&
                            Array.isArray(item?.bid_data)
                            ? item?.bid_data.length
                            : false;
                        const bid_data =
                          'bid_data' in item && item?.bid_data;
                        return (
                          <CarAuctions
                            key={String(index)}
                            onPress={() => this.getAuctionDetail(item?.id)}
                            start_price={item?.bid_price}
                            end_price={item?.bid_closed_price}
                            status={item?.used_type}
                            name={name}
                            startDate={item?.bid_start}
                            endDate={item?.bid_end}
                            total_bid={total_bid}
                            bid_data={bid_data}
                            image={
                              item?.auction_image.length > 0
                                ? item?.auction_image[0]?.media_url
                                : null
                            }
                            Status={item?.status}
                            cancel_reason={item?.cancel_reason}
                            editOnPress={() => {
                              this.editOnPress(item);
                            }}
                          />
                        )
                      })
                    }
                  </>
                ) : (
                  <AppNoDataFound
                    Height={h(60)}
                    message={getLangText(TextKey.no_auction_found)}
                  />
                )}
              </View>
            </>
          ) : (
            <AppNoDataFound Height={h(80)} message={getLangText(TextKey.no_auction_found)} />
          )}
          {this.state.filterModel && (
            <AuctionSearchModel
              closeOnPress={() => this.setState({ filterModel: false })}
              resetStatusOnPress={() => {
                this.setState(
                  {
                    filterModel: false,
                    selectedFilterStatus: undefined,
                  },
                  () => {
                    this.onTabPress(this.state.selectedTab);
                  },
                );
              }}
              statusOnPress={this.onStatusPress}
            />
          )}
        </ScrollView>
      </AppContainer>
    );
  }
}


export default App;