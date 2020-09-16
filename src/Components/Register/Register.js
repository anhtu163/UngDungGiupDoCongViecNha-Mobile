/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Icon, Flex, Button, InputItem} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import NewFamily from './NewFamily';

export default function Register({navigation}) {
  const [imageF, setImageF] = useState({
    uri: 'http://getdrawings.com/free-icon-bw/gta-v-icon-22.jpg',
  });
  const [loading, setLoading] = useState(null);
  const [err, seterr] = useState('');
  const [nameFamily, setnameFamily] = useState('');
  const [password, setpassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  console.disableYellowBox = true;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });

  const YOUR_CLOUDINARY_NAME = 'datn22020';
  const YOUR_CLOUDINARY_PRESET = 'DATN_HouseHelperApp_Image';
  const pickImageHandler = () => {
    const options = {
      title: 'Chọn hình ảnh',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, res => {
      if (res.didCancel) {
        console.log('User cancelled!');
      } else if (res.error) {
        console.log('Error', res.error);
      } else {
        // setImage({uri: res.uri});
        setLoading(false);
        uploadFile(res).then(async response => {
          let data = await response.json();
          setImageF({
            uri: data.url,
          });
          setLoading(true);
          console.log(data.url);
        });
      }
    });
  };
  const uploadFile = file => {
    return RNFetchBlob.fetch(
      'POST',
      'https://api.cloudinary.com/v1_1/' +
        YOUR_CLOUDINARY_NAME +
        '/image/upload?upload_preset=' +
        YOUR_CLOUDINARY_PRESET,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'file',
          filename: file.fileName,
          data: RNFetchBlob.wrap(file.path),
        },
      ],
    );
  };
  return (
    <View
      style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <View style={{margin: 35}}>
        <Flex justify="center">
          <Text
            style={{
              fontSize: 30,
              color: 'gray',
              fontWeight: '100',
              marginBottom: 20,
            }}>
            Tạo mới gia đình
          </Text>
        </Flex>
        <Flex justify="center">
          {loading === false && (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="green" />
            </View>
          )}
          {(loading === true || loading === null) && (
            <TouchableOpacity onPress={pickImageHandler}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderColor: 'gray',
                  borderWidth: 1,
                  margin: 10,
                }}
                source={{
                  uri: imageF.uri,
                }}
              />
            </TouchableOpacity>
          )}
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
            placeholder="Tên gia đình"
            style={{fontSize: 16}}
            defaultValue={nameFamily}
            onChangeText={value => {
              setnameFamily(value);
              seterr(null);
            }}>
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
            required
            clear
            type="password"
            placeholder="Nhập mật khẩu gia đình"
            style={{fontSize: 16}}
            defaultValue={password}
            onChangeText={value => {
              setpassword(value);
              seterr(null);
            }}>
            <Flex align="center">
              <Icon name="lock" color="gray" />
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
            placeholder="Nhập lại mật khẩu gia đình"
            style={{fontSize: 16}}
            defaultValue={confirmPassword}
            onChangeText={value => {
              setconfirmPassword(value);
              seterr(null);
            }}>
            <Flex align="center">
              <Icon name="lock" color="gray" />
            </Flex>
          </InputItem>
        </View>
        {err !== '' && (
          <Text style={{fontSize: 16, color: 'red', margin: 10}}>{err}</Text>
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
              Back
            </Button>
          </Flex.Item>
          <Flex.Item>
            <Button
              full
              type="primary"
              style={{margin: 10, marginTop: 10}}
              onPress={() => {
                if (
                  nameFamily === '' ||
                  password === '' ||
                  confirmPassword === ''
                ) {
                  seterr('Các trường không được bỏ trống');
                } else if (password !== confirmPassword) {
                  seterr('Nhập lại mật khẩu không đúng');
                } else {
                  navigation.navigate('NewFamily', {
                    nameFamily,
                    password,
                    imageF,
                  });
                }
              }}>
              Next
            </Button>
          </Flex.Item>
        </Flex>
      </View>
    </View>
  );
}
