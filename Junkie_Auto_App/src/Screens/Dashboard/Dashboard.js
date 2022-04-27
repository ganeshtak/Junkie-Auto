import React from "react";
import { View, Text, FlatList, ScrollView, Platform, RefreshControl } from 'react-native';
import { Icons } from '../../Asset/Icon';
import { w, h, colors, totalSize, spacer } from '../../Style/baseStyle';
import { AppContainer } from '../../Utility/AppContainer';
import { DashboardHeader } from '../../Utility/DashboardHeader';
import { AppGridButton } from '../../Utility/AppGridButton';
import { AuctionStatus, CarOfferType, CarOfferTypeLang, ScreenTypes } from '../../Constant/Data';
import { AppHeading } from '../../Utility/AppHeading';
import { CarOffer } from '../../Utility/Card/CarOffer';
import { NewListedCar } from '../../Utility/Card/NewListedCar';
import { Store } from '../../Store';
import { AppConstant, FilterConstant, UserConstant } from "../../Constant/AppConstant";
import { getAuctionDetail } from '../Auctions/Utils';
import { getDashboardData } from '../../Store/Actions/DashboardAction';
import { connect } from "react-redux";
import { AppNoDataFound } from '../../Utility/AppNoDataFound';
import { MSG } from '../../Constant/Message';
import { ExpiredAuctionList } from './ExpiredAuctionList';
import { getDataForLang, getLangText, lang_code, setAppLang } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";

class Dashboard extends React.Component {
  state = {
    demo: "",
    banner: [],
    latest_offer: [],
    newly_listed: [],
    list: [],
    selectedTab: 1,

    //all auctions
    all_auctions: [],
    expired_auction: [],

  }

  componentDidMount() {
    AppConstant.navigation = this.props.navigation;
    this.getHomeData();
    this.subscribe = this.props.navigation.addListener('focus', () => {
      this.getHomeData();
    })
  }

  componentWillUnmount() {
    this.subscribe();
  }

  profileOnPress = () => {
    if (UserConstant.user_id) {
      this.props.navigation.navigate('EditProfile')
    }
  }

  menuOnPress = () => {
    this.props.navigation.navigate('Profile')
  }

  searchPress = () => {
    this.props.navigation.navigate('SearchAuction')
  }

  navigateToDetail = () => {
    //this.setState({ demo: "" });
    this.props.navigation.navigate('AuctionDetail');
  }

  getAuctionDetailByApi = async (id) => {
    await getAuctionDetail(id, ScreenTypes.dashboard);
  }

  getHomeData = async () => {
    const res = await getDashboardData(true);
    if (typeof res == "object") {
      this.setState({
        all_auctions: res.auctions,
        banner: res?.bannerImage,
        latest_offer: res?.latest_offer,
        newly_listed: res?.newly_listed,
        list: this.state.selectedTab == 1 ? res.auctions : this.filterByStatus(res.auctions, this.state.selectedTab),
        expired_auction: res.expiredAuctions,
      });
    }
    else {
      this.setState({
        banner: [],
        latest_offer: [],
        newly_listed: [],
        all_auctions: [],
        expired_auction: [],
      });
    }
  }



  getAllCars = (latest = [], newCars = []) => {
    return [...latest, ...newCars];
  }

  getBanner = () => {
    const banner = this.state.banner;
    if (banner) {
      const res = banner.map((item) => {
        return item?.image_path
      });
      return res
    }
    return []
  }



  filterByStatus = (list = this.state.all_auctions, index) => {
    const status = CarOfferType[index - 1];
    const res = list.filter((item) => {
      if (item?.used_type_name && item?.used_type_name.length > 0 && String(status).toLocaleLowerCase() == String(item?.used_type_name[0].name).toLocaleLowerCase()) {
        return true
      }
      return false
    });
    return res
  }

  onTabPress = (i, tab) => {
    if (i == 1) {
      this.setState({
        list: this.state.all_auctions,
        selectedTab: i
      });
      return
    }

    const res = this.filterByStatus(this.state.all_auctions, i);
    this.setState({
      list: res,
      selectedTab: i
    })
  }



  render() {

    const newly_listed = this.state.newly_listed;

    return (
      <AppContainer>
        <ScrollView
          bounces={false}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.getHomeData}
            />
          }>
          <DashboardHeader
            imageOnPress={this.profileOnPress}
            menuOnPress={this.menuOnPress}
            searchOnPress={this.searchPress}
            editable={false}
            images={this.getBanner()}
            userImage={UserConstant.user_image}
          />
          <View
            style={{
              paddingHorizontal: totalSize(2),
              marginTop: Platform.OS == 'android' ? 0 : spacer,
            }}>
            <>
              {this.state.expired_auction &&
                this.state.expired_auction.length > 0 ? (
                <View
                  style={{
                    marginBottom: spacer,
                  }}>
                  <ExpiredAuctionList
                    list={this.state.expired_auction}
                    onPress={id => this.getAuctionDetailByApi(id)}
                  />
                </View>
              ) : null}
              <AppHeading
                title={getLangText(TextKey.DashBoard_LatestOff)}
              />
              <AppGridButton
                list={getDataForLang(CarOfferTypeLang)}
                onPress={this.onTabPress}
              />
            </>
            <View
              style={{
                marginTop: spacer,
              }}>
              {this.state.list.length > 0 ? (
                <FlatList
                  data={this.state.list}
                  horizontal
                  ItemSeparatorComponent={() => (
                    <View style={{ width: totalSize(1) }} />
                  )}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(I, i) => String(i)}
                  renderItem={({ item, index }) => {
                    const name =
                      'make_name' in item ? item?.make_name[0]?.name : '';
                    const model_name =
                      'model_name' in item ? item?.model_name[0]?.name : '';
                    const bidPrice =
                      'bid_data' in item &&
                      item?.bid_data.length > 0 &&
                      item?.bid_data[item?.bid_data.length - 1]?.bid_amount;
                    return (
                      <CarOffer
                        startDate={item?.bid_start}
                        name={name}
                        model={model_name}
                        endDate={item?.bid_end}
                        //bid_price={item?.bid_price}
                        status={item?.used_type}
                        bid_price={bidPrice}
                        image={
                          item?.auction_image &&
                            item?.auction_image.length > 0
                            ? item?.auction_image[0]?.media_url
                            : null
                        }
                        sale_price={item?.sale_price}
                        onPress={() => this.getAuctionDetailByApi(item?.id)}
                      />
                    );
                  }}
                />
              ) : (
                <AppNoDataFound
                  message={getLangText(TextKey.no_auction_found)}
                  Height={h(28)}
                />
              )}
            </View>

            {newly_listed.length > 0 && (
              <AppHeading
                title={getLangText(TextKey.DashBoard_new_listed_Cars)}
              />
            )}
            <View
              style={{
                marginTop: spacer * 0.5,
              }}>
              <FlatList
                data={newly_listed}
                horizontal
                ItemSeparatorComponent={() => (
                  <View style={{ width: totalSize(1) }} />
                )}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(I, i) => String(i)}
                renderItem={({ item, index }) => {
                  const name =
                    'make_name' in item ? item?.make_name[0]?.name : '';
                  const model_name =
                    'model_name' in item ? item?.model_name[0]?.name : '';
                  return (
                    <NewListedCar
                      name={name}
                      model={model_name}
                      bid_price={item?.bid_price}
                      sale_price={item?.sale_price}
                      endDate={item?.bid_end}
                      image={
                        item?.auction_image.length > 0
                          ? item?.auction_image[0]?.media_url
                          : null
                      }
                      onPress={() => this.getAuctionDetailByApi(item?.id)}
                    />
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
      </AppContainer>
    );
  }
}


const mapStateToProps = (state) => {

  return {
    latest_offer: state.DashboardReducer.newly_listed,
    newly_listed: state.DashboardReducer.newly_listed,
    banner: state.DashboardReducer.bannerImage,
  }
}

export default connect(mapStateToProps, {})(Dashboard);