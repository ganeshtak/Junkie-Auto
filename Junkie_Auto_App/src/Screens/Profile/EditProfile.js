import React from "react";
import { View, Text, FlatList, Platform, ScrollView } from 'react-native';
import { AppContainer } from '../../Utility/AppContainer';
import { Icons } from '../../Asset/Icon';
import { colors, FontSize, h, shadow, spacer, totalSize, w } from "../../Style/baseStyle";
import { AppHeading } from '../../Utility/AppHeading';
import { Button, AppButton } from '../../Utility/AppButton';
import { AppConstant, UserConstant } from "../../Constant/AppConstant";
import { Fonts } from "../../Asset/Font";
import { AppTextInput } from '../../Utility/AppTextInput';
import { Header } from "react-native/Libraries/NewAppScreen";
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { ImagePickerModel } from '../../Utility/Modal/ImagePickerModel';
import FastImage from "react-native-fast-image";
import { updateUserProfile, getUserInfo } from "../../Store/Actions/UserAction";
import { getImageUrl } from '../../Constant/Helper/ImageUrl';
import moment from "moment";
import { AppHorizontalImages } from '../../Utility/AppHorizontalImages';
import { ImageZoomModel } from "../../Utility/Modal/ImageZoomerModel";
import { ProgressImage } from '../../Utility/ProgressImage';
import { ProfileHeader } from './Profile';
import { BusinessType } from "../../Constant/Data";
import { getLangText } from "../../Store/Actions/LangAction";
import { TextKey } from "../../Constant/Language";

class App extends React.Component {
  state = {
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    image: "",
    imagePickerModal: false,
    isLocalImageSelected: false,
    address: "",
    city: "",
    state: "",
    country: "",

    idNumber: "",
    businessType: "",
    issuingState: "",
    expiryDate: "",
    licenseNumber: "",
    companyName: "",
    coverageAmount: "",

    documentType: "",
    docs: [],
    selectedImage: undefined,
    zoomModel: false,
  }

  componentDidMount() {
    this.getUserProfile();
    //this.setFieldValue();
  }

  getUserProfile = async () => {
    getUserInfo(true, (status, res) => {
      if (res && res.status) {
        const user = res?.data[0];
        const profile = {
          uri: getImageUrl(user?.profile_url)
        }
        this.setState({
          firstName: user?.first_name,
          lastName: user?.last_name,
          mobile: user?.mobile_number,
          email: user?.email,
          address: user?.street,
          city: user?.city,
          state: user?.state,
          image: profile,
          country: user?.country,
          documentType: user?.document_type,
          idNumber: user?.id_number,
          expiryDate: user?.expire_date ? moment(user?.expire_date).format('DD-MM-YYYY') : "",
          businessType: user?.type,
          licenseNumber: user?.document_data?.license_number,
          companyName: user?.document_data?.insurance_company,
          coverageAmount: user?.document_data?.inventory_coverage_amount,
          docs: user?.document_data?.document_file ? user?.document_data?.document_file : []
        })
      }
    });
  }

  setFieldValue = () => {
    this.setState({
      firstName: UserConstant.f_name,
      lastName: UserConstant.l_name,
      email: UserConstant.email,
      mobile: UserConstant.mobile
    })
  }

  notChangeMessage = (target = 0) => {
    if (target == 1) {
      // for mobile
      ShowSnakeBar(getLangText(TextKey.mobile_number_not_change))
      return
    }
    if (target == 2) {
      // for email
      ShowSnakeBar(getLangText(TextKey.email_number_not_change))
      return
    }
    if (target == 3) {
      // for other
      ShowSnakeBar(getLangText(TextKey.this_field_not_change))
      return
    }
  }

  getParams = () => {
    const form = new FormData();
    form.append("mobile_number", this.state.mobile);
    form.append("first_name", this.state.firstName)
    form.append("last_name", this.state.lastName)
    form.append("address", this.state.address)
    form.append("street", "")
    form.append("city", "")

    if (this.state.isLocalImageSelected) {
      form.append("profile_url", this.state.image);
    }
    return form
  }

  updateOnPress = async () => {
    const form = await this.getParams();

    if (form) {
      const res = await updateUserProfile(true, form);
      if (res && res.status) {
        this.props.navigation.goBack();
      }
    }
  }


  renderFields = () => {

    return (
      <>
        <AppTextInput
          placeholder={
            String(this.state.businessType).toLocaleLowerCase() ==
              String(BusinessType[0]).toLocaleLowerCase()
              ? `${getLangText(TextKey.Register_fName)}`
              : `${getLangText(TextKey.Company_Name)}`
          }
          value={this.state.firstName}
          onChangeText={firstName => this.setState({ firstName })}
          animateLabel={false}
        />
        <AppTextInput
          placeholder={
            String(this.state.businessType).toLocaleLowerCase() ==
              String(BusinessType[0]).toLocaleLowerCase()
              ? `${getLangText(TextKey.Register_LName)}`
              : `${getLangText(TextKey.Owner_name)}`
          }
          value={this.state.lastName}
          onChangeText={lastName => this.setState({ lastName })}
          animateLabel={false}
        />
        <AppTextInput
          placeholder={getLangText(TextKey.Register_MobNo)}
          value={this.state.mobile}
          //editable={false}
          onChangeText={mobile => this.setState({ mobile })}
          //onPress={() => this.notChangeMessage(1)}
          animateLabel={false}
        />
        <AppTextInput
          placeholder={getLangText(TextKey.Register_Email)}
          value={this.state.email}
          editable={false}
          onPress={() => this.notChangeMessage(2)}
        />

        {this.state.address ? (
          <AppTextInput
            placeholder={getLangText(TextKey.Address)}
            value={this.state.address}
            onChangeText={address => this.setState({ address })}
            editable={false}
            onPress={() => this.notChangeMessage(3)}
          />
        ) : null}
        {this.state.city ? (
          <AppTextInput
            placeholder={getLangText(TextKey.Register_City)}
            value={this.state.city}
            onChangeText={city => this.setState({ city })}
            editable={false}
            onPress={() => this.notChangeMessage(3)}
          />
        ) : null}
        <AppTextInput
          placeholder={getLangText(TextKey.Register_State)}
          value={this.state.state}
          onChangeText={state => this.setState({ state })}
          editable={false}
          onPress={() => this.notChangeMessage(3)}
        />
        <AppTextInput
          placeholder={getLangText(TextKey.Register_Country)}
          value={this.state.country}
          onChangeText={country => this.setState({ country })}
          editable={false}
          onPress={() => this.notChangeMessage(3)}
        />

        <AppTextInput
          placeholder={getLangText(TextKey.Business_Type)}
          value={this.state.businessType}
          editable={false}
          onPress={() => this.notChangeMessage(3)}
        />
        <AppTextInput
          placeholder={getLangText(TextKey.Register_Docu_Type)}
          value={this.state.documentType}
          editable={false}
          onPress={() => this.notChangeMessage(3)}
        />
        {this.state.idNumber ? (
          <AppTextInput
            placeholder={getLangText(TextKey.Id_Number)}
            value={this.state.idNumber}
            onChangeText={idNumber => this.setState({ idNumber })}
            editable={false}
            onPress={() => this.notChangeMessage(3)}
          />
        ) : null}
        <AppTextInput
          placeholder={getLangText(TextKey.Expiry_Date)}
          value={this.state.expiryDate}
          onChangeText={expiryDate => this.setState({ expiryDate })}
          editable={false}
          onPress={() => this.notChangeMessage(3)}
        />

        {this.state.licenseNumber ? (
          <AppTextInput
            placeholder={getLangText(TextKey.License_Number)}
            value={this.state.licenseNumber}
            editable={false}
            onPress={() => this.notChangeMessage(3)}
          />
        ) : null}
        {this.state.companyName ? (
          <AppTextInput
            placeholder={getLangText(TextKey.Insurance_company_name)}
            value={this.state.companyName}
            editable={false}
            onPress={() => this.notChangeMessage(3)}
          />
        ) : null}
        {this.state.coverageAmount ? (
          <AppTextInput
            placeholder={getLangText(TextKey.Inventory_coverage_amount)}
            value={this.state.coverageAmount}
            editable={false}
            onPress={() => this.notChangeMessage(3)}
          />
        ) : null}
      </>
    );
  }

  pickImage = (img) => {
    if (img && img.length > 0) {
      this.setState({
        isLocalImageSelected: true,
        image: img[0],
      })
    }
  }

  getImageUrl = () => {
    if (this.state.image && this.state.image?.uri) {
      return this.state.image?.uri
    }
    return undefined
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    if (this.state.firstName == "") {
      return null
    }
    return (
      <AppContainer>
        <ScrollView>
          <ProfileHeader
            backOnPress={this.goBack}
            title={getLangText(TextKey.Edit_Profile)}
            editOnPress={() => {
              this.setState({
                imagePickerModal: true,
              });
            }}
            image={this.getImageUrl()}
            isImageEditable={true}
          />
          {/* <HeaderView
                        onPress={() => this.setState({ imagePickerModal: true })}
                        image={this.getImageUrl()}
                    /> */}
          <View
            style={{
              flex: 1,
              paddingHorizontal: spacer,
              marginTop: Platform.OS == 'android' ? h(32) : h(32),
              marginBottom: h(10),
            }}>
            {this.renderFields()}
            {this.state.docs.length > 0 ? (
              <RenderDocs
                docs={this.state.docs}
                onPress={img =>
                  this.setState({
                    zoomModel: true,
                    selectedImage: img,
                  })
                }
              />
            ) : null}
          </View>
        </ScrollView>
        <BottomView onPress={this.updateOnPress} />
        {this.state.imagePickerModal && (
          <ImagePickerModel
            closeOnPress={() => this.setState({ imagePickerModal: false })}
            galleryOnPress={this.pickImage}
            cameraOnPress={this.pickImage}
            isMultiple={false}
          />
        )}
        {this.state.zoomModel && (
          <ImageZoomModel
            url={this.state.selectedImage}
            closeOnPress={() => this.setState({ zoomModel: false })}
          />
        )}
      </AppContainer>
    );
  }
}

const BottomView = ({ onPress }) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        paddingBottom: spacer,
        width: w(100),
        backgroundColor: colors.white,
      }}>
      <AppButton title={getLangText(TextKey.Update)} onPress={onPress} />
    </View>
  );
}

export default App;



const HeaderView = ({
  size = w(40),
  onPress,
  image
}) => {

  return (
    <Button
      onPress={onPress}
      style={{
        alignItems: 'center',
        marginTop: spacer
      }}>
      <View style={{
        width: size,
        height: size,
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: colors.white,
        borderRadius: size,
        overflow: 'hidden',
        //justifyContent: 'center',
        //alignItems: 'center'
      }}>
        {
          image && image !== "file:///" ?
            <ProgressImage
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                //borderRadius: size
              }}
              resizeMode="cover"
              //source={{ uri: image ? image : "http" }}
              uri={image ? image : "http"}
            />
            :
            <View style={{
              flex: 1, justifyContent: 'center',
              alignItems: 'center',
              transform: [{ scale: 2, }]
            }}>
              <Icons.ProfileIcon size={totalSize(3)} color={colors.black} />
            </View>
        }


      </View>
    </Button>
  )
}

const RenderDocs = ({
  docs = [],
  onPress
}) => {
  return (
    <View>
      <AppHeading
        title={getLangText(TextKey.Documents)}
        color={colors.black}
        fontSize={FontSize.lg}
      />
      <View>
        <AppHorizontalImages
          docs={docs}
          showRemove={false}
          onPress={onPress}
        />
      </View>
    </View>
  )
}