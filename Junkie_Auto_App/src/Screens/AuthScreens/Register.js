import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Image,
  KeyboardAvoidingView, Platform
} from 'react-native'
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import { colors, Font, FontSize, h, MAXWIDTH, shadow, spacer, totalSize, w } from '../../Style/baseStyle';
import { AppTextInput } from '../../Utility/AppTextInput';
import { AppContainer } from '../../Utility/AppContainer';
import DocumentPicker from 'react-native-document-picker';
import { AppGridButton } from '../../Utility/AppGridButton';
import {
  BusinessDocTypes, BusinessType, DocType, BusinessDocTypesLang,
  DocTypeLang,
  BusinessTypeLang
} from '../../Constant/Data';
import { AppButton, Button } from '../../Utility/AppButton';
import { API } from '../../ServerCommunication/baseUrl';
import { useSelector, useDispatch } from 'react-redux';
import { OptionPicker } from '../../Utility/Modal/OptionPicker';
import { ImagePickerModel } from '../../Utility/Modal/ImagePickerModel';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { AppDatePicker, getCustomDate } from '../../Utility/AppDatePicker';
import { SearchAddress } from '../SearchLocation/SearchAddress';
import { registerByApi } from '../../Store/Actions/UserAction';
import moment from 'moment';
import { getCurrentLatLng, getAddressByLatLng } from '../../ServerCommunication/Location';
import { AppHorizontalImages } from '../../Utility/AppHorizontalImages';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { AppConstant } from '../../Constant/AppConstant';
import { validateIssuingDate, validateExpiryDate } from '../../Constant/Helper/TimeAndDate';
import { YearModel } from '../../Utility/Modal/YearModel';
import { states } from '../../Constant/States';
import { openTermCondition } from '../../Constant/Helper/PhoneCallActivity';
import { getAllCountry, getStateByCountry, getCityByState } from '../../ServerCommunication/AreaRequest';
import { getDataForLang, getLangText, lang_code } from '../../Store/Actions/LangAction';
import { TextKey } from '../../Constant/Language';


const areaType = {
  country: "country",
  state: "state",
  city: "city",
}

const DateType = {
  issue_date: "issue_date",
  expiry_date: "expiry_date",
}

const BusinessRegistration = (props) => {

  React.useEffect(() => {
    validateIssuingDate("26-11-2021");
  }, []);

  const dispatch = useDispatch();
  let [businessType, setBusinessType] = useState(1);

  const [optionModel, setOptionModel] = useState(false);
  const [imagePickerModel, setImagePickerModel] = useState(false);
  const [datePicker, setDatePicker] = useState(false);
  const [dateType, setDateType] = useState(undefined);

  const [issueStateModel, setIssueStateModel] = useState(false);
  const [addressModel, setAddressModel] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntry1, setSecureTextEntry1] = useState(true);


  // for country state and city search list
  const [searchList, setSearchList] = useState(false);
  const [searchType, setSearchType] = useState(false);
  const [searchModel, setSearchModel] = useState(false);

  const [lat, setLat] = useState(undefined);
  const [lng, setLon] = useState(undefined);

  let [firstName, setFirstName] = useState("");
  let [lastName, setlastName] = useState("");
  let [email, setemail] = useState('');
  let [mobileNumber, setmobileNumber] = useState("");
  // let [location, setLocation] = useState("");
  let [country, setCountry] = useState("");
  let [state, setState] = useState("");
  let [city, setCity] = useState("");
  let [documents, setDocument] = useState([]);
  let [street, setStreet] = useState("");
  let [issueState, setIssueState] = useState("");
  let [termCondition, setTermCondition] = useState(false);

  let [idNumber, setIdNumber] = useState("");
  let [licenseNumber, setLicenseNumber] = useState("");
  let [licenseCompanyName, setLicenseCompanyName] = useState("");
  let [coverageAmount, setCoverageAmount] = useState("");

  let [expiryDate, setexpiryDate] = useState("");
  let [idCopy, setIdCopy] = useState("");
  let [issue_date, setIssueDate] = useState('');
  let [password, setPassword] = useState("");
  let [confirmPassword, setconfirmPassword] = useState("");
  const [documentType, setDocumentType] = useState("");



  const getParams = () => {
    let formData = new FormData();
    formData.append('type', businessType == 1 ? "individual" : "business")
    formData.append('email', email);
    formData.append('password', password);
    formData.append('mobile_number', mobileNumber);
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('address', "indore");
    formData.append('street', street);
    formData.append('city', city);
    formData.append('state', state);
    formData.append('country', country);
    formData.append('document_type', documentType?.key);
    formData.append('issue_date', moment(issue_date, "DD-MM-YYYY").format('YYYY-MM-DD'));
    formData.append('expire_date', moment(expiryDate, "DD-MM-YYYY").format('YYYY-MM-DD'));
    formData.append('id_number', idNumber);
    formData.append('license_number', licenseNumber);
    formData.append('insurance_company', licenseCompanyName);
    formData.append('inventory_coverage_amount', coverageAmount);
    formData.append('doc_issue_state', issueState);
    if (documents && documents.length > 0) {
      documents.map((item, index) => {
        formData.append(`files[${index}]`, item);
      })
    }
    return formData;

  }

  const isFilledEmpty = (iState, type = undefined) => {
    if (type) {
      if (iState.length == 0) {
        return true
      }
      return false
    }
    else {
      if (["", null, undefined].includes(iState)) {
        return true
      }
      return false
    }
  }

  const checkValidation = () => {
    if (isFilledEmpty(firstName)) {
      showMessage(getLangText(TextKey.first_name_req));
      return false
    }
    else if (isFilledEmpty(lastName)) {
      showMessage(getLangText(TextKey.last_name_req));
      return false
    }
    else if (isFilledEmpty(email)) {
      showMessage(getLangText(TextKey.email_req));
      return false
    }
    else if (isFilledEmpty(mobileNumber)) {
      showMessage(getLangText(TextKey.mobile_no_req));
      return false
    }
    else if (isFilledEmpty(country)) {
      showMessage(getLangText(TextKey.country_req));
      return false
    }
    else if (isFilledEmpty(state)) {
      showMessage(getLangText(TextKey.state_req));
      return false
    }
    else if (isFilledEmpty(city)) {
      showMessage(getLangText(TextKey.city_req));
      return false
    }
    else if (isFilledEmpty(street)) {
      showMessage(getLangText(TextKey.street_req));
      return false
    }
    else if (isFilledEmpty(documentType)) {
      showMessage(getLangText(TextKey.select_document));
      return false
    }
    else if (documentType?.key == BusinessDocTypesLang.en[0].key) {
      // for dealer license
      if (isFilledEmpty(licenseNumber)) {
        showMessage(getLangText(TextKey.license_number_req));
        return false
      }
    }
    else if (documentType?.key == BusinessDocTypesLang.en[1].key) {
      // for Certificate of insurance
      if (isFilledEmpty(licenseCompanyName)) {
        showMessage(getLangText(TextKey.insurance_company_name_req));
        return false
      }
      if (isFilledEmpty(coverageAmount)) {
        showMessage(getLangText(TextKey.inventory_coverage_amount_req));
        return false
      }
    }
    else if (businessType == 1) {
      if (isFilledEmpty(idNumber)) {
        showMessage(getLangText(TextKey.id_number_req));
        return false
      }
    }


    if (isFilledEmpty(issueState)) {
      showMessage(getLangText(TextKey.select_document_issuing_state));
      return false
    }
    else if (isFilledEmpty(expiryDate)) {
      showMessage(getLangText(TextKey.expiry_date_req));
      return false
    }
    // else if (validateExpiryDate(expiryDate) == false) {
    //     showMessage("Your document has been expired, you must have a valid document to register");
    //     return false
    // }
    else if (isFilledEmpty(documents, "image")) {
      showMessage(getLangText(TextKey.select_a_doc));
      return false
    }
    else if (isFilledEmpty(documentType)) {
      showMessage(getLangText(TextKey.select_document_type));
      return false
    }
    else if (isFilledEmpty(issue_date)) {
      showMessage(getLangText(TextKey.issuing_date_req));
      return false
    }

    else if (isFilledEmpty(password)) {
      showMessage(getLangText(TextKey.password_is_req));
      return false
    }
    else if (isFilledEmpty(confirmPassword)) {
      showMessage(getLangText(TextKey.confirm_password_is_req));
      return false
    }
    else if (String(password).toLocaleLowerCase().trim() !== String(confirmPassword).toLocaleLowerCase().trim()) {
      showMessage(getLangText(TextKey.password_confirmPassword_not_match));
      return false
    }
    else if (termCondition == false) {
      showMessage(getLangText(TextKey.accept_term_condition));
      return false
    }
    else {
      return true
    }
  }

  const showMessage = (MSG, error = false) => {
    if (error) {
      AlertMessage({
        title: getLangText(TextKey.error),
        message: MSG,
        text1: "",
        text2: getLangText(TextKey.ok)
      })
    }
    else {
      AlertMessage({
        title: getLangText(TextKey.required),
        message: MSG,
        text1: "",
        text2: getLangText(TextKey.ok)
      })
    }
  }
    
  const Register = async () => {
    const isNotEmpty = await checkValidation();

    if (isNotEmpty) {
      const _data = getParams();

      registerByApi({ data: _data }, (res) => {

        if (res && res.status) {
          if (AppConstant.isParentScreenProfile) {
            props?.navigation.navigate('Login');
            ShowSnakeBar(getLangText(TextKey.you_register_successfully));
            return
          }
          ShowSnakeBar(getLangText(TextKey.you_register_successfully));
          props.navigation.goBack();
        }
        else {
          if (res && res?.errors) {
            const errorData = res?.errors.length > 0 ? res?.errors[0] : "";
            AlertMessage({
              title: getLangText(TextKey.error),
              message: errorData && errorData?.field == "email" ? getLangText(TextKey.email_already_registered) : "",
              text1: '',
              text2: getLangText(TextKey.ok),
            }, () => {

            })
          }
        }

      })
    }
    return
  }

  const onImagePick = (img) => {
    if (img) {
      const d = [...documents, ...img];
      setDocument(d);
    }
  }

  const onRemovePress = (item, index) => {
    const data = documents.filter((I, i) => i !== index);
    setDocument(data);
  }

  const openDatePicker = (type) => {
    setDateType(type);
    setDatePicker(true)
  }

  const onPickDate = (date) => {
    if (dateType == DateType.expiry_date) {
      if (validateExpiryDate(date)) {
        setexpiryDate(date);
        return
      }
      else {
        AlertMessage({
          title: getLangText(TextKey.required),
          message: getLangText(TextKey.your_doc_expired),
          text1: "",
          text2: getLangText(TextKey.ok),
        })
      }
    }
    else {
      setIssueDate(date)
    }
  }

  const onPickAddress = (obj) => {

    if (obj) {
      setStreet(obj?.addr);
      setLat(obj?.latitude);
      setLon(obj?.longitude);
      setCountry(obj?.country);
      setState(obj?.state);
      setCity(obj?.city);
    }
  }

  const pickLocation = () => {
    getCurrentLatLng((data) => {
      if (data) {
        getAddressByLatLng({ lat: data?.lat, lng: data?.lng }).then((res) => {

          if (res) {
            setCountry(res?.address?.countery);
            setState(res?.address?.state);
            setCity(res?.address?.city);
            setStreet(res?.formatted_address)
          }
        });

      }
    })
  }


  const resetDocStates = () => {
    setDocument([]);
  }

  const resetBusinessTypeStates = () => {
    setDocumentType(undefined);
    setDocument([]);
  }

  const searchOnPress = async (type = 0) => {
    if (type == areaType.country) {
      const res = await getAllCountry();
      if (res) {
        setSearchList(res);
        setSearchModel(true);
        setSearchType(type);
        return
      }
      ShowSnakeBar(getLangText(TextKey.country_not_found))
      return
    }
    if (type == areaType.state) {
      if (country) {
        const res = await getStateByCountry(country);
        if (res) {
          setSearchList(res);
          setSearchModel(true);
          setSearchType(type)
          return
        }
        ShowSnakeBar(getLangText(TextKey.state_not_found))
        return
      }
      ShowSnakeBar(getLangText(TextKey.first_select_country))
      return
    }

    if (type == areaType.city) {
      if (state) {
        const res = await getCityByState(country, state);
        if (res) {
          setSearchList(res);
          setSearchModel(true);
          setSearchType(type)
          return
        }
        ShowSnakeBar(getLangText(TextKey.city_not_found))
        return
      }
      ShowSnakeBar(getLangText(TextKey.first_select_state))
      return
    }
  }

  const searchItemOnPress = (item) => {
    if (searchType == areaType.country) {
      setCountry(item);
      return
    }

    if (searchType == areaType.state) {
      setState(item);
      return
    }

    if (searchType == areaType.city) {
      setCity(item);
      return
    }

  }

  return (
    <AppContainer>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS == "android" ? "" : "padding"}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              paddingHorizontal: totalSize(2),
              //alignItems: 'center'
            }}>
            <View
              style={{
                flex: 1,
                paddingTop: totalSize(2),
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: spacer * 2,
              }}>
              <Text
                style={{
                  fontFamily: Fonts.bold,
                  fontSize: FontSize.xlg,
                  color: colors.red,
                }}>
                {getLangText(TextKey.RegisterScreenHeader)}
              </Text>
            </View>
            <AppGridButton
              list={getDataForLang(BusinessTypeLang)}
              onPress={(i, type) => {
                setBusinessType(i);
                resetBusinessTypeStates();
              }}
            />
            <View
              style={{
                marginTop: spacer * 3,
              }}>
              <AppTextInput
                placeholder={
                  businessType == 1
                    ? `${getLangText(TextKey.Register_fName)}`
                    : `${getLangText(TextKey.Company_Name)}`
                }
                value={firstName}
                onChangeText={setFirstName}
              />
              <AppTextInput
                placeholder={
                  businessType == 1
                    ? `${getLangText(TextKey.Register_LName)}`
                    : `${getLangText(TextKey.Owner_name)}`
                }
                value={lastName}
                onChangeText={setlastName}
              />
              <AppTextInput
                placeholder={getLangText(TextKey.Register_Email)}
                value={email}
                onChangeText={setemail}
              />
              <AppTextInput
                placeholder={getLangText(TextKey.Register_MobNo)}
                value={mobileNumber}
                onChangeText={setmobileNumber}
                keyboardType="numeric"
              />
              <AppTextInput
                placeholder={getLangText(TextKey.Register_Country)}
                value={country}
                icon={
                  <Icons.Document size={totalSize(1.5)} color={colors.gray} />
                }
                iconOnPress={() => searchOnPress(areaType.country)}
                animateLabel={false}
                editable={false}
                onPress={() => searchOnPress(areaType.country)}
              // onPress={() => {
              //     //setAddressModel(true)
              //     countryOnPress
              // }}
              />
              <AppTextInput
                placeholder={getLangText(TextKey.Register_State)}
                value={state}
                iconOnPress={() => searchOnPress(areaType.state)}
                animateLabel={false}
                editable={false}
                onPress={() => searchOnPress(areaType.state)}
                icon={
                  <Icons.Document size={totalSize(1.5)} color={colors.gray} />
                }
              />
              <AppTextInput
                placeholder={getLangText(TextKey.Register_City)}
                value={city}
                iconOnPress={() => searchOnPress(areaType.city)}
                animateLabel={false}
                editable={false}
                onPress={() => searchOnPress(areaType.city)}
                icon={
                  <Icons.Document size={totalSize(1.5)} color={colors.gray} />
                }
              />
              <AppTextInput
                placeholder={getLangText(TextKey.Register_Street)}
                value={street}
                onChangeText={setStreet}
                textContentType="fullStreetAddress"
              />

              <>
                <AppTextInput
                  onPress={() => {
                    setOptionModel(true);
                  }}
                  editable={false}
                  value={documentType?.value}
                  placeholder={getLangText(TextKey.Register_Docu_Type)}
                  icon={<Icons.Document size={totalSize(2)} />}
                />

                {businessType == 1 && (
                  <>
                    <AppTextInput
                      placeholder={getLangText(TextKey.Id_Number)}
                      value={idNumber}
                      onChangeText={setIdNumber}
                    />
                  </>
                )}
                <AppTextInput
                  placeholder={getLangText(TextKey.Issuing_state)}
                  value={issueState}
                  editable={false}
                  icon={<Icons.Document size={totalSize(2)} />}
                  onPress={() => setIssueStateModel(true)}
                />
                {documentType?.key == BusinessDocTypesLang.en[0].key ? (
                  <AppTextInput
                    placeholder={getLangText(TextKey.License_Number)}
                    value={licenseNumber}
                    onChangeText={setLicenseNumber} 
                  />
                ) : null}

                {documentType?.key == BusinessDocTypesLang.en[1].key ? (
                  <>
                    <AppTextInput
                      placeholder={getLangText(
                        TextKey.Insurance_company_name,
                      )}
                      value={licenseCompanyName}
                      onChangeText={setLicenseCompanyName}
                    />
                    <AppTextInput
                      placeholder={getLangText(
                        TextKey.Inventory_coverage_amount,
                      )}
                      value={coverageAmount}
                      onChangeText={setCoverageAmount}
                      keyboardType="numeric"
                    />
                  </>
                ) : null}

                <AppTextInput
                  placeholder={getLangText(TextKey.Register_ExpiryDate)}
                  value={expiryDate}
                  editable={false}
                  onPress={() => openDatePicker(DateType.expiry_date)}
                  onChangeText={setexpiryDate}
                  icon={<Icons.CalenderIcon size={totalSize(2)} color={colors.gray} />}
                />

                {
                  <AppTextInput
                    placeholder={getLangText(TextKey.Register_Issue_Date)}
                    editable={false}
                    value={issue_date}
                    onPress={() => openDatePicker(DateType.issue_date)}
                    icon={<Icons.CalenderIcon size={totalSize(2)} color={colors.gray} />}
                  />
                }

                <AppTextInput
                  editable={false}
                  placeholder={getNameForDocPicker(documentType?.key)}
                  onPress={() => setImagePickerModel(true)}
                  //placeholder="Choose Document from Gallery"
                  icon={<Icons.Document size={totalSize(2)} />}
                />

                {documents.length > 0 && (
                  <AppHorizontalImages
                    docs={documents}
                    removeOnPress={onRemovePress}
                  />
                )}
              </>

              <AppTextInput
                placeholder={getLangText(TextKey.Register_Password)}
                // password="secure"
                value={password}
                onChangeText={setPassword}
                keyboardType="default"
                autoCapitalize={false}
                secureTextEntry={secureTextEntry}
                icon={
                  <View style={{ top: -3 }}>
                    {secureTextEntry ? (
                      <Icons.EyeSlashIcon
                        size={totalSize(2.2)}
                        color={colors.gray}
                      />
                    ) : (
                      <Icons.EyeIcon
                        size={totalSize(2.2)}
                        color={colors.gray}
                      />
                    )}
                  </View>
                }
                iconOnPress={() => {
                  setSecureTextEntry(!secureTextEntry);
                }}
              />
              <AppTextInput
                placeholder={getLangText(TextKey.Register_Con_Password)}
                // password="secure"
                keyboardType="default"
                value={confirmPassword}
                onChangeText={setconfirmPassword}
                autoCapitalize={false}
                secureTextEntry={secureTextEntry1}
                icon={
                  <View style={{ top: -3 }}>
                    {secureTextEntry1 ? (
                      <Icons.EyeSlashIcon
                        size={totalSize(2.2)}
                        color={colors.gray}
                      />
                    ) : (
                      <Icons.EyeIcon
                        size={totalSize(2.2)}
                        color={colors.gray}
                      />
                    )}
                  </View>
                }
                iconOnPress={() => {
                  setSecureTextEntry1(!secureTextEntry1);
                }}
              />
            </View>
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: totalSize(5),
                //flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: FontSize.mdl,
                  textAlign: 'center',
                  color: colors.black,
                }}>
                {getLangText(TextKey.Register_footer1)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  openTermCondition();
                }}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Button
                  onPress={() => {
                    setTermCondition(!termCondition);
                  }}
                  style={{
                    marginRight: spacer * 0.5,
                    top: 1,
                  }}>
                  {termCondition ? (
                    <Icons.CheckedCheckboxIcon
                      size={totalSize(2)}
                      color={colors.black}
                    />
                  ) : (
                    <Icons.UncheckedCheckboxIcon
                      size={totalSize(2)}
                      color={colors.black}
                    />
                  )}
                </Button>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.red,
                    fontFamily: Fonts.regular,
                    fontSize: FontSize.mdl,
                  }}>
                  {' '}
                  {getLangText(TextKey.Register_footer2)}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: totalSize(2),
                marginBottom: spacer,
              }}>
              <AppButton
                title={getLangText(TextKey.Register_Button)}
                onPress={Register}
              />
            </View>
            {/* <TouchableOpacity style={styles.button} onPress={Register}>
                        <Text style={styles.textRegisterButton}>REGISTER</Text>
                    </TouchableOpacity> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {optionModel && (
        <OptionPicker
          list={businessType == 1 ? getDataForLang(DocTypeLang) : getDataForLang(BusinessDocTypesLang)}
          closeOnPress={() => {
            setOptionModel(false);
          }}
          itemOnPress={doc => {
            setDocumentType(doc);
            resetDocStates();
          }}
        />
      )}

      {imagePickerModel && (
        <ImagePickerModel
          closeOnPress={() => {
            setImagePickerModel(false);
          }}
          galleryOnPress={onImagePick}
        />
      )}
      {datePicker && (
        <AppDatePicker
          cancelOnPress={() => setDatePicker(false)}
          doneOnPress={onPickDate}
          minDate={
            dateType == DateType.issue_date
              ? getCustomDate({ year: -20, dateRef: true })
              : new Date()
          }
          maxDate={
            dateType == DateType.issue_date
              ? new Date()
              : getCustomDate({ year: 5, dateRef: true })
          }
        />
      )}
      {addressModel && (
        <SearchAddress
          closeOnPress={() => setAddressModel(false)}
          onPickAddress={onPickAddress}
        />
      )}
      {issueStateModel && (
        <YearModel
          list={states}
          itemType="object"
          closeOnPress={() => setIssueStateModel(false)}
          itemOnPress={item => {
            setIssueState(item?.name);
          }}
          keyboardType="default"
          placeholder={getLangText(TextKey.Search_issuing_state)}
        />
      )}

      {searchModel && (
        <YearModel
          list={searchList}
          itemType="string"
          closeOnPress={() => setSearchModel(false)}
          itemOnPress={item => {
            searchItemOnPress(item);
          }}
          keyboardType="default"
          placeholder={
            searchType == areaType.country
              ? `${getLangText(TextKey.Search_country)}`
              : searchType == areaType.state
                ? `${getLangText(TextKey.Search_state)}`
                : `${getLangText(TextKey.Search_city)}`
          }
        />
      )}
    </AppContainer>
  );


}

export default BusinessRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  button: {
    // alignItems: "center",
    backgroundColor: colors.primary,
    height: 64,
    marginHorizontal: 40,
    borderRadius: 10,
    marginVertical: 30,
    padding: 10,
  },
  textRegisterButton: {
    fontFamily: Fonts.regular,
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 8,
    color: colors.white,
  },
});


const getNameForDocPicker = (doc) => {
  if (doc == BusinessDocTypesLang.en[0].key) {
    return `${getLangText(TextKey.Choose_dealer_license)}`
  }
  else if (doc == BusinessDocTypesLang.en[1].key) {
    return `${getLangText(TextKey.Choose_certificate_ofinsurance)}`;

  }
  else {
    return `${getLangText(TextKey.Register_ChooseDoc_fromGallery)}`;

  }
}