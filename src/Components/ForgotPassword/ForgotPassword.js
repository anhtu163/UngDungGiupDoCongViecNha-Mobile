/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {WhiteSpace, Flex, Button, InputItem} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Toast from 'react-native-root-toast';

export default function ForgotPassword({route, navigation}) {
  const [username, setusername] = useState('');
  const [err, seterr] = useState(null);
  const {prevScreen} = route.params;
  const {type} = route.params;
  const {email} = route.params;
  useEffect(() => {
    setusername(email);
  }, [email]);
  const sendRequestResetPassword = () => {
    //console.log('kiểm tr mail ' + email);
    const data = {
      email: username,
      type: type,
    };
    return RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/users/request-reset-password',
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(async res => {
      const t = res.json();
      console.log(t);
      if (t.code === 2020) {
        Toast.show(
          'Gửi yêu cầu thành công. Vui lòng kiểm tra email ' +
            data.email +
            ' và làm theo hướng dẫn để đặt lại mật khẩu!',
          {
            duration: 7000,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
          },
        );
        navigation.goBack();
      } else {
        seterr(t.message);
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        margin: 35,
      }}>
      <Flex justify="center">
        <Text
          style={{
            fontSize: 30,
            color: 'gray',
            fontWeight: '100',
            marginBottom: 20,
          }}>
          Quên mật khẩu?
        </Text>
      </Flex>

      <WhiteSpace size="xl" />
      <Text style={{alignContent: 'center', textAlign: 'center', fontSize: 17}}>
        Lấy lại mật khẩu qua email đăng nhập này.
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#CCCCCC',
          margin: 10,
          padding: 5,
        }}>
        <InputItem
          clear
          placeholder="Nhập email của bạn"
          defaultValue={username}
          onChangeText={value => {
            setusername(value);
            console.log(username);
            seterr(null);
          }}
          editable={type === 'family' ? false : true}
          style={{fontSize: 18}}
        />
      </View>
      {err !== null && (
        <Text style={{fontSize: 18, color: 'red', margin: 10}}>{err}</Text>
      )}
      <Flex justify="between" style={{marginTop: 20}}>
        <Flex.Item>
          <Button
            onPress={() => navigation.goBack()}
            full
            style={{
              margin: 10,
              marginTop: 10,
              backgroundColor: '#A9A9A9', //5D6266
              color: '#5D6266',
            }}>
            Quay lại
          </Button>
        </Flex.Item>
        <Flex.Item>
          <Button
            full
            type="primary"
            style={{margin: 10, marginTop: 10}}
            onPress={() => {
              if (username === '') {
                seterr('Email không được để trống!');
              } else {
                if (prevScreen !== 'Login') {
                  if (username !== email) {
                    seterr('Cần nhập email đăng nhập của bạn!');
                  } else {
                    sendRequestResetPassword();
                  }
                } else {
                  sendRequestResetPassword();
                }
              }
            }}>
            Gửi
          </Button>
        </Flex.Item>
      </Flex>
    </View>
  );
}
