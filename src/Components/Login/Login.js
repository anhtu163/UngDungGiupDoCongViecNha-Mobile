/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  Icon,
  Checkbox,
  Flex,
  Button,
  InputItem,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function Login({navigation, route}) {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  // // console.log(route.params.isLogin);
  // const HandleLogin = async () => {
  //   // var bcrypt = require('bcryptjs');
  //   const data = {
  //     email: username,
  //     password: password,
  //   };
  //   console.log(data);
  //   RNFetchBlob.fetch(
  //     'POST',
  //     'https://househelperapp-api.herokuapp.com/users/login',
  //     {
  //       'Content-Type': 'application/json',
  //     },
  //     JSON.stringify(data),
  //   ).then(res => {
  //     const t = res.json();
  //     console.log(t.token);
  //     if (t.code === 2020) {
  //       setUser(t.user);
  //       settoken(t.token);
  //       // navigation.setParams({isLogin: true});
  //       // navigation.goBack();
  //     } else {
  //       console.log('Lỗi');
  //     }
  //   });
  // };
  // console.log(route.params.isLogin);
  const {signIn} = React.useContext(route.params.AuthContext);
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
            marginBottom: 30,
          }}>
          Your Account
        </Text>
      </Flex>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#CCCCCC',
          margin: 10,
          padding: 5,
        }}>
        <InputItem
          clear
          placeholder="Email"
          style={{fontSize: 18}}
          defaultValue={username}
          onChangeText={value => setusername(value)}>
          <Flex align="center">
            <Icon name="user" color="gray" />
          </Flex>
        </InputItem>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderColor: '#CCCCCC',
          margin: 10,
          padding: 5,
        }}>
        <InputItem
          clear
          type="password"
          placeholder="Password"
          style={{fontSize: 18}}
          defaultValue={password}
          onChangeText={value => setpassword(value)}>
          <Flex align="center">
            <Icon name="lock" color="gray" />
          </Flex>
        </InputItem>
      </View>
      <Flex justify="between" style={{padding: 5}}>
        <Flex.Item>
          <Checkbox.AgreeItem>
            <Text style={{fontSize: 15}}>Remember me</Text>
          </Checkbox.AgreeItem>
        </Flex.Item>
        <Flex.Item>
          <Flex justify="end">
            <TouchableOpacity>
              <Text style={{color: '#108EE9', marginRight: 10, fontSize: 15}}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </Flex>
        </Flex.Item>
      </Flex>
      <Button
        type="ghost"
        style={{margin: 10, marginTop: 10}}
        onPress={() => signIn({username, password})}>
        {/* onPress={() => HandleLogin()}> */}
        Log in
      </Button>
      <Flex justify="center">
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={{color: '#108EE9', fontSize: 18, marginTop: 20}}>
            Create family now!
          </Text>
        </TouchableOpacity>
      </Flex>
    </View>
  );
}
