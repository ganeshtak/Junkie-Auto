import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { UserConstant } from '../../Constant/AppConstant';
import { AlertMessage } from '../../Constant/Helper/AlertMessage';
import { TextKey } from '../../Constant/Language';
import { getLangText } from '../../Store/Actions/LangAction';
import { ChangePasswords } from '../../Store/Actions/UserAction';
import { colors, Font, FontSize, spacer, totalSize } from '../../Style/baseStyle';
import { AppButton } from '../../Utility/AppButton';
import { AppContainer } from '../../Utility/AppContainer';
import { AppTextInput } from '../../Utility/AppTextInput';
import { ShowSnakeBar } from '../../Utility/ShowMessage';
import { useNavigation, useRoute } from '@react-navigation/native';


const ChangePassword = ({ props, route }) => {
  const navigation = useNavigation();

  let [newPassword, setNewPassword] = useState('');
  let [confirmNewPassword, setconfirmNewPassword] = useState('');


  const { email_id } = route.params;

  console.log(
    email_id,
    'new password,=>',
    newPassword,
    '  ==>',
    'confirm password==>',
    confirmNewPassword,
    UserConstant.email,
  );


  const checkPasswordValue = () => {
    if (!newPassword || !confirmNewPassword) {
      ShowSnakeBar(getLangText(TextKey.Enter_Password));
      return false;
    }
    if (newPassword !== confirmNewPassword) {
      ShowSnakeBar(getLangText(TextKey.Password_not_matched));
      return false;
    }
    if (newPassword.length < 6 && confirmNewPassword.length < 6) {
      ShowSnakeBar(getLangText(TextKey.Password_six_char_long));
    }
    return true;
  };

  const getParams = () => {
    const obj = {};
    obj['email'] = email_id;
    obj['password'] = newPassword;
    return obj;
  };
  const ChangePassword = () => {
    if (!checkPasswordValue()) {
      return;
    }


    if (newPassword && confirmNewPassword) {
      //call api
      console.log('data==>=>');

      const data = getParams();
      try {
        console.log("data==>", data);

        ChangePasswords({ data }, res => {

          if (res && res?.status == true) {
            ShowSnakeBar(getLangText(TextKey.Password_changed_Successflly));
            navigation.navigate('Login');
          }
        });
      } catch (e) { }
    }
  };



  const showMessage = (error = false, MSG) => {
    ShowSnakeBar(MSG);
  };
  return (
    <AppContainer>
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: spacer,
        }}>
        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              fontSize: FontSize.lg,
              fontFamily: Font.bold,
              color: colors.primary,
            }}>
            {getLangText(TextKey.Change_Password)}
          </Text>
        </View>
        <View style={{ marginTop: spacer * 2 }}>
          <AppTextInput
            placeholder={getLangText(TextKey.new_password)}
            // password="secure"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
          />
          <AppTextInput
            placeholder={getLangText(TextKey.Re_Enter_new_pass)}
            // password="secure"
            value={confirmNewPassword}
            onChangeText={setconfirmNewPassword}
          // secureTextEntry={true}
          />
        </View>

        <View
          style={{
            marginTop: totalSize(2),
            marginBottom: spacer,
          }}>
          <AppButton
            title={getLangText(TextKey.Reset)}
            onPress={ChangePassword}
          />
        </View>
      </View>
    </AppContainer>
  );
};

export default ChangePassword;