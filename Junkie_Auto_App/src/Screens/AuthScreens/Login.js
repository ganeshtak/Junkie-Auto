import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, Image,
  KeyboardAvoidingView, Platform, Dimensions
} from 'react-native';
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Icons } from "../../Asset/Icon";
import { setAppStatus } from '../../Store/Actions/UserAction';
import { AppTextInput } from '../../Utility/AppTextInput';
import { colors, FontSize, h, spacer, totalSize, w } from '../../Style/baseStyle'
import { Fonts } from "../../Asset/Font";
import { AppButton, Button } from "../../Utility/AppButton";
import { AppContainer } from "../../Utility/AppContainer";
import { loginByApi } from '../../Store/Actions/UserAction';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { AppStatusType, ScreenTypes } from "../../Constant/Data";
import { AppConstant } from "../../Constant/AppConstant";
import { TextKey } from "../../Constant/Language";
import { getLangText } from "../../Store/Actions/LangAction";





class Login extends React.Component {
  state = {
    email: '',
    password: '',
    secureTextEntry: true,
    from: '',
    loginAttempt: 0,
    sec: 0,
  };

  componentDidMount() {
    this.prevScreenParam();
  }

  prevScreenParam = () => {
    if (this.props?.route?.params) {
      const item = props?.route?.params;
      this.setState({from: item?.from});
    }
  };

  goToRegister = () => {
    this.props.navigation.navigate('Register');
  };

  checkValidation = () => {
    if (this.state.email == '') {
      this.showMessage(getLangText(TextKey.email_req));
      return false;
    } else if (this.state.password == '') {
      this.showMessage(getLangText(TextKey.password_is_req));
      return false;
    }
    return true;
  };

  showMessage = (msg, title = getLangText(TextKey.Required)) => {
    AlertMessage({
      title: title,
      message: msg,
      text1: '',
      text2: getLangText(TextKey.ok),
    });
  };

  getParams = () => {
    const obj = {};
    obj['email'] = this.state.email;
    obj['password'] = this.state.password;
    obj['device_type'] = Platform.OS;
    obj['device_token'] = AppConstant.fcm_token;

    return obj;
  };

  LoginButton = () => {
    const isDetailDone = this.checkValidation();

    if (isDetailDone) {
      const data = this.getParams();
      loginByApi({data}, res => {
        console.log(res);
        if (AppConstant.isParentScreenProfile && res && res?.status) {
          this.props?.navigation.navigate('TabNavigator');
          return;
        }
        if (res && 'success' in res && res?.success == false) {
          this.loginFail(res?.errors?.message);
        }
      });
    }
  };

  loginFail = msg => {
    if (this.state.loginAttempt == 4) {
       this.showMessage(getLangText(TextKey.password_Multiple_try_message));


      this.timerId = setInterval(() => {
        const newSec = parseInt(this.state.sec) + 1;
        if (newSec == 60) {
          //close timer
          clearInterval(this.timerId);
          this.setState({
            loginAttempt: 0,
            sec: 0,
          });
        } else {
          this.setState({sec: String(newSec)});
        }
      }, 1000);
    } else {
      this.setState({loginAttempt: parseInt(this.state.loginAttempt) + 1});
      setTimeout(() => {
        this.showMessage(msg, getLangText(TextKey.Login_failed));
      }, 100);
    }
  };

  guestLogin = () => {
    setAppStatus(AppStatusType.dashboard);
  };

  render() {
    return (
      <AppContainer>
        <KeyboardAvoidingView
          style={{flex: 1}}
          //behavior={Platform.OS == "android" ? "padding" : "padding"}
        >
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                minHeight: Platform.OS == 'android' ? h(88) : h(93),
              }}>
              <View
                style={{
                  //flex: 1,
                  backgroundColor: colors.white,
                }}>
                <View style={styles.icon}>
                  <Image
                    style={{
                      width: w(40),
                      height: w(40),
                      resizeMode: 'contain',
                    }}
                    source={require('../../Asset/Image/app_logo.png')}
                  />
                </View>

                <View style={{alignSelf: 'center'}}>
                  <Text
                    style={{
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.xlg,
                      color: colors.red,
                      marginVertical: totalSize(5),
                    }}>
                    {getLangText(TextKey.LoginScreenHeader)}
                  </Text>
                </View>

                <AppTextInput
                  placeholder={getLangText(TextKey.LoginScreenEmail)}
                  value={this.state.email}
                  onChangeText={email => {
                    this.setState({email});
                  }}
                  keyboardType="email-address"
                  leftIcon={
                    <Icons.EmailIcon
                      size={totalSize(2.2)}
                      color={colors.primary}
                    />
                  }
                />
                <AppTextInput
                  placeholder={getLangText(TextKey.LoginScreenPassword)}
                  value={this.state.password}
                  onChangeText={pass => {
                    this.setState({password: pass});
                  }}
                  leftIcon={
                    <Icons.PasswordLock
                      size={totalSize(2.3)}
                      color={colors.primary}
                    />
                  }
                  autoCapitalize={false}
                  keyboardType="default"
                  editable={true}
                  secureTextEntry={this.state.secureTextEntry}
                  icon={
                    <View style={{top: -3}}>
                      {this.state.secureTextEntry ? (
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
                    this.setState({
                      secureTextEntry: !this.state.secureTextEntry,
                    });
                  }}
                />
                <Button
                  onPress={() => {
                    this.props.navigation.navigate('forgotPassword');
                  }}>
                  <Text
                    style={{
                      opacity: 0.3,
                      color: colors.black,
                      textAlign: 'center',
                      fontFamily: Fonts.regular,
                      marginTop: 0,
                      fontSize: FontSize.mdl,
                      opacity: 0.3,
                    }}>
                    {getLangText(TextKey.LoginScreenForgotPassword)}
                  </Text>
                </Button>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: spacer,
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={{marginBottom: spacer}}>
                  {this.state.sec == 0 ? null : (
                    <Text style={{...styles.text}}>{this.state.sec}</Text>
                  )}
                </View>
                <Button
                  onPress={this.goToRegister}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      //marginTop: totalSize(4),
                      fontFamily: Fonts.regular,
                      fontSize: FontSize.mdl,
                      color: colors.gray,
                    }}>
                    {getLangText(TextKey.LoginScreenfooterText1)}
                  </Text>
                  <Text
                    style={{
                      color: colors.red,
                      fontFamily: Fonts.bold,
                      fontSize: FontSize.mdl,
                      marginLeft: 2,
                    }}>
                    {getLangText(TextKey.LoginScreenfooterText2)}
                    {/* Register */}
                  </Text>
                </Button>
                <View
                  style={{
                    marginTop: totalSize(2),
                    // position:"absolute",
                    // bottom:2,
                  }}>
                  <AppButton
                    title={getLangText(TextKey.Login)}
                    disabled={this.state.sec == 0 ? false : true}
                    onPress={() => {
                      //setAppStatus(3);
                      this.LoginButton();
                    }}
                  />
                  {AppConstant.isParentScreenProfile ? null : (
                    <Button
                      onPress={this.guestLogin}
                      style={{
                        alignItems: 'center',
                        marginTop: spacer * 0.8,
                      }}>
                      <Text
                        style={{
                          ...styles.text,
                        }}>
                        {getLangText(TextKey.LoginAsGuest)}
                      </Text>
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </AppContainer>
    );
  }
}



export default Login;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   backgroundColor:colors.gray,
    paddingHorizontal: totalSize(2),
    backgroundColor: colors.white,

  },
  icon: {
    flex: 1,
    // display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: spacer * 2,
    alignItems: 'center',
  },
  text: {
    fontSize: FontSize.mdl,
    fontFamily: Fonts.regular,
    color: colors.gray
  }
});