import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { Fonts } from '../../Asset/Font';
import { Icons } from '../../Asset/Icon';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { TextKey } from '../../Constant/Language';
import { getLangText } from '../../Store/Actions/LangAction';
import { VerifyEmail, VerifyEmailByOtp } from '../../Store/Actions/UserAction';
import { colors, FontSize, spacer, totalSize } from '../../Style/baseStyle';
import { AppButton } from '../../Utility/AppButton';
import { AppContainer } from '../../Utility/AppContainer';
import { AppTextInput } from '../../Utility/AppTextInput';
import { ShowSnakeBar } from '../../Utility/ShowMessage';


let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;



const ForgotPassword = (props) => {
  let [email, setemail] = useState('');

  function checkInputValue() {
    if (!email) {
      ShowSnakeBar(getLangText(TextKey.Email_is_required));
      return false;
    }
    if (reg.test(email) === false) {
      ShowSnakeBar(getLangText(TextKey.Invalid_Email));
      return false;
    }

    return true;
  }



  const getParams = () => {
    const obj = {};
    obj['email'] = email;
    return obj;
  };

  const OtpVerify = () => {
    if (!checkInputValue()) {
      return;
    }
    if (email) {
      //api call
      const data = getParams();
      try {
        VerifyEmail({ data }, res => {

          if (res && res?.status == true) {
            ShowSnakeBar(getLangText(TextKey.Otp_Sent_Successfully));
            props?.navigation.navigate('OtpVerification', {
              attempts: "Forgot_Password",
              email_id: email
            });
          }
          else
            if (res?.status == false) {
              ShowSnakeBar(getLangText(TextKey.Email_is_wrong));

            }

        });
      } catch (e) { }
    }
  };


  return (
    <AppContainer>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <View style={{ marginTop: spacer * 6 }}>
            <Text
              style={{
                color: colors.primary,
                fontFamily: Fonts.bold,
                fontSize: FontSize.xlg,
              }}>
              {getLangText(TextKey.Forgot_Password)}
            </Text>
          </View>
          <View style={{ marginTop: spacer * 4 }}>
            <AppTextInput
              placeholder={getLangText(TextKey.LoginScreenEmail)}
              value={email}
              onChangeText={setemail}
              keyboardType="email-address"
              leftIcon={
                <Icons.EmailIcon size={totalSize(2.2)} color={colors.primary} />
              }
            />
          </View>
          <View style={{ marginTop: totalSize(2) }}>
            <AppButton
              title={getLangText(TextKey.Send_Otp)}
              onPress={OtpVerify}
            />
          </View>
        </View>
      </ScrollView>
    </AppContainer>
  );
};

export default ForgotPassword;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   backgroundColor:colors.black,
    paddingHorizontal: totalSize(2),
    backgroundColor: colors.white,
  },
});