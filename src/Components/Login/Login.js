/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  Icon,
  Checkbox,
  Flex,
  Button,
  InputItem,
} from '@ant-design/react-native';

export default function Login({navigation, route}) {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('');
  const [err, seterr] = useState('');
  const {signIn} = React.useContext(route.params.AuthContext);
  console.disableYellowBox = true;
  return (
    <View
      style={{
        flex: 1,
        alignContent: 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        source={{
          uri: 'https://i.imgur.com/qUlYOM2.png',
        }}
        style={{
          width: null,
          height: 70,
          resizeMode: 'contain',
        }}
      />
      <View
        style={{
          margin: 25,
          backgroundColor: 'white',
        }}>
        <Flex justify="center">
          <Text
            style={{
              fontSize: 25,
              color: 'gray',
              fontWeight: '100',
              marginBottom: 30,
            }}>
            Đăng Nhập
          </Text>
          <Text
            style={{
              fontSize: 25,
              color: '#0099ff',
              fontWeight: '100',
              marginBottom: 30,
            }}>
            {'  '}
            SMART
          </Text>
          <Text
            style={{
              fontSize: 25,
              color: 'gray',
              fontWeight: '100',
              marginBottom: 30,
            }}>
            FAMILY
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
            style={{fontSize: 16}}
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
            placeholder="Mật khẩu"
            style={{fontSize: 16}}
            defaultValue={password}
            onChangeText={value => setpassword(value)}>
            <Flex align="center">
              <Icon name="lock" color="gray" />
            </Flex>
          </InputItem>
        </View>
        <Flex justify="between" style={{padding: 5}}>
          <View style={{flex: 3}}>
            <Checkbox.AgreeItem checked>
              <Text style={{fontSize: 15}}>Duy trì đăng nhập</Text>
            </Checkbox.AgreeItem>
          </View>
          <View style={{flex: 2}}>
            <Flex justify="end">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ForgotPassword', {
                    type: 'member',
                    prevScreen: 'Login',
                    email: '',
                  })
                }>
                <Text style={{color: '#108EE9', marginRight: 10, fontSize: 15}}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>
            </Flex>
          </View>
        </Flex>
        {err !== '' && (
          <Text style={{color: 'red', fontSize: 17, margin: 10}}>{err}</Text>
        )}
        <Button
          type="ghost"
          style={{margin: 10, marginTop: 10, backgroundColor: 'white'}}
          onPress={() => signIn({username, password, seterr})}>
          {/* onPress={() => HandleLogin()}> */}
          Đăng nhập
        </Button>
        <Flex justify="center">
          <TouchableOpacity
            style={{borderBottomColor: '#0099FF', borderBottomWidth: 1}}
            onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#108EE9', fontSize: 16, marginTop: 20}}>
              Tạo mới gia đình ngay bây giờ!!!
            </Text>
          </TouchableOpacity>
        </Flex>
      </View>
    </View>
  );
}
