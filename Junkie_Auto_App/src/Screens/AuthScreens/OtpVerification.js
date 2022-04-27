import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Fonts} from '../../Asset/Font';
import {AlertMessage} from '../../Constant/Helper/AlertMessage';
import {TextKey} from '../../Constant/Language';
import {getLangText} from '../../Store/Actions/LangAction';
import {
  OtpVerifications,
  registerByApi,
  registerOtpVerification,
  setAppStatus,
  VerifyEmail,
} from '../../Store/Actions/UserAction';
import {colors, FontSize, spacer, totalSize} from '../../Style/baseStyle';
import {AppButton} from '../../Utility/AppButton';
import {AppContainer} from '../../Utility/AppContainer';
import {ShowSnakeBar} from '../../Utility/ShowMessage';
const isAndroid = Platform.OS === 'android';
const OtpVerification = ({props, navigation, route}) => {
  const CELL_COUNT = 6;
  const RESEND_OTP_TIME_LIMIT = 60;
  let resendOtpTimerInterval = 1;
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT,
  );
  // const [value, setValue] = useState('');
  //   const {otpRequestData, attempts} = route.params;
  const {attempts, email_id} = route.params;
  let [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const [otpVal, setOtpVal] = useState('');
  // refs to focus input
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  const inputRef5 = useRef(null);
  const inputRef6 = useRef(null);

  //to start resent otp option
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setTimeout(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const getEmail = () => {
    const obj = {};
    obj['email'] = email_id;
    return obj;
  };
  //on click of resend button
  const onResendOtpButtonPress = () => {
    // clear last OTP
    if (inputRef1) {
      setOtpArray(['', '', '', '', '', '']);

      inputRef1.current.focus();
    }
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    if (email_id) {
      //api call
      try {
        const data = getEmail();
        // setOtpArray="",
        // setOtpVal="",
        VerifyEmail({data}, res => {
          if (res && res?.status == true) {
            console.log('todo: Resend OTP');
            ShowSnakeBar(getLangText(TextKey.Otp_Resend_Successfully));
          }

          if (res?.status == false) {
            ShowSnakeBar(getLangText(TextKey.Otp_resend_failed));
          }
        });
      } catch (e) {
        ShowSnakeBar(getLangText(TextKey.Otp_resend_failed));
      }
    }
  };
  // start timer on screen on launch
  useEffect(() => {
    //startResendOtpTimer();
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);
  ///   Otp Change Fuction
  const onOtpChange = index => {
    return value => {
      if (isNaN(Number(value))) {
        return;
      }

      let otpArrayCopy = otpArray.concat();
      otpArrayCopy[index] = value;
      console.log('otp value', otpArrayCopy);
      let ArrValue = otpArrayCopy.join('');

      console.log('join method output', otpArrayCopy.join(''), ArrValue);

      setOtpArray(otpArrayCopy);
      setOtpVal(ArrValue);

      if (value !== '') {
        if (index === 0) {
          inputRef2.current?.focus();
        } else if (index === 1) {
          inputRef3.current?.focus();
        } else if (index === 2) {
          inputRef4.current?.focus();
        } else if (index === 3) {
          inputRef5.current?.focus();
        } else if (index === 4) {
          inputRef6.current?.focus();
        }
      }
    };
  };

  const onOTPKeyPress = index => {
    return ({nativeEvent: {key: value}}) => {
      //autofocus to previous input if the value is blank and existing value is also blank
      if (value === 'Backspace' && otpArray[index] === '') {
        if (index === 1) {
          inputRef1.current?.focus();
        } else if (index === 2) {
          inputRef2.current?.focus();
        } else if (index === 3) {
          inputRef3.current?.focus();
        } else if (index === 4) {
          inputRef4.current?.focus();
        } else if (index === 5) {
          inputRef5.current?.focus();
        } else if (index === 6) {
          inputRef6.current?.focus();
        }
        if (isAndroid && index > 0) {
          const otpArrayCpy = otpArray.concat();
          otpArrayCpy[index - 1] = '';
          setOtpArray(otpArrayCpy);
          // setOtpVal(otpArrayCpy);
        }
      }
    };
  };
  const refCallback = textInputRef => node => {
    textInputRef.current = node;
  };
  const getParams = () => {
    console.log(
      'otp value in new  setOtpVal=>>',
      otpVal,
      '-----OtpArray',
      otpArray,
    );
    const obj = {};
    obj['otp'] = otpVal;
    return obj;
  };

  const checkOtp = () => {
    // console.log('otp value', otpArray,otpArray.length,otpVal.length);

    if (otpArray.length == 0) {
      ShowSnakeBar(getLangText(TextKey.Otp_is_required));
      return false;
    }
    if (otpArray.length < 6) {
      ShowSnakeBar(getLangText(TextKey.Otp_must_be_six_char_long));
      return false;
    }
    return true;
  };

  const Verify = () => {
    // console.log("otp value in new  setOtpVal=>>",otpVal);
    if (!checkOtp()) {
      return;
    }
    if (otpArray) {
      try {
        const data = getParams();
        console.log('otp value+++++++++', data);
        // data={...data}
        OtpVerifications({data}, res => {
          if (res && res.status) {
            ShowSnakeBar(getLangText(TextKey.OTP_Verified_successfully));
            attempts === 'Verification'
              ? setAppStatus(3)
              : navigation.navigate('ChangePassword', {email_id, email_id});
          }
          if (res && 'message' in res && res?.status == false) {
            setTimeout(() => {
              ShowSnakeBar(getLangText(TextKey.Invalid_OTP));
              
            }, 100);
          }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AppContainer>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: spacer * 2,
        }}>
        <Text
          style={{
            fontSize: FontSize.lg,
            fontFamily: Fonts.bold,
            color: colors.primary,
            textAlign: 'center',
          }}>
          {getLangText(TextKey.Otp_Verify)}
          {
            / {attempts == 'Reset Password' ? 'Reset Password ' : 'Verification '}{' '} /
          }
          {/ {otpRequestData.email_id ? 'email' : 'mobile number'}{' '} /}
        </Text>
      </View>

      <View
        style={{
          ...styles.otpBoxesContainer,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: spacer * 2,
        }}>
        {[inputRef1, inputRef2, inputRef3, inputRef4, inputRef5, inputRef6].map(
          (inputRef, i) => (
            <TextInput
              ref={refCallback(inputRef)}
              onChangeText={onOtpChange(i)}
              onKeyPress={onOTPKeyPress(i)}
              value={otpArray[i]}
              keyboardType="numeric"
              textContentType="oneTimeCode"
              maxLength={1}
              key={i}
              autoFocus={i === 0 ? true : undefined}
              inputStyle={styles.inputStyle}
              containerStyle={{flex: 0.15}}
              style={{...styles.otpBox}}
              caretHidden={true}
            />
          ),
        )}
      </View>

      {/ View for resend otp  /}
      {false ? (
        <Text
          style={{
            ...styles.resendCodeText,
            marginLeft: spacer * 6.4,
            color: colors.black,
            opacity: 0.5,
          }}>
          {getLangText(TextKey.Resend_Otp_in)}
          {getLangText(TextKey.second)}
        </Text>
      ) : (
        <TouchableOpacity
          onPress={onResendOtpButtonPress}
          style={styles.otpResendButton}>
          <Text style={styles.otpResendButtonText}>
            {' '}
            {getLangText(TextKey.Resend_Otp)}
          </Text>
        </TouchableOpacity>
      )}

      <View style={{marginTop: totalSize(2)}}>
        <AppButton title={getLangText(TextKey.Verify)} onPress={Verify} />
      </View>
    </AppContainer>
  );
};
export default OtpVerification;
const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  otpBoxesContainer: {
    flexDirection: 'row',
  },
  submitButtonText: {
    color: '#FFFF',
  },
  otpBox: {
    padding: 10,
    marginRight: 10,
    color: colors.black,
    borderWidth: 1,
    borderColor: colors.gray,
    height: 45,
    width: 45,
    paddingLeft: 10,
    textAlign: 'center',
    borderRadius: 5,
  },
  otpResendButton: {
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
  },
  otpResendButtonText: {
    color: colors.primary,
    textTransform: 'none',
    textDecorationLine: 'underline',
  },
  otpText: {
    fontWeight: 'bold',
    color: colors.primary,
    fontSize: 18,
    width: '100%',
  },
  resendCode: {
    color: colors.primary,
    marginStart: 20,
    marginTop: 40,
  },
  resendCodeText: {
    marginStart: 20,
    marginTop: spacer,
  },
  resendCodeContainer: {
    alignItems: 'center',
    marginTop: -spacer * 1.2,
  },
});
