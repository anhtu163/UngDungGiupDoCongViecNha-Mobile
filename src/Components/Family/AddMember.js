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
  ScrollView,
} from 'react-native';
import {Icon, Flex, InputItem, Checkbox} from '@ant-design/react-native';
import {Picker, Button} from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';

export default function AddMember({navigation, route}) {
  //   const {nameFamily} = route.params;
  //   const {password} = route.params;
  //   const {imageF} = route.params;
  //   const {signUp} = React.useContext(route.params.AuthContext);
  const [image, setImage] = useState({
    uri: 'http://getdrawings.com/free-icon-bw/gta-v-icon-22.jpg',
  });
  const {token} = route.params;
  const [loading, setLoading] = useState(null);
  const [bgColor, setbgColor] = useState(null);
  const [select, setSelect] = useState('Bố');
  const [err, seterr] = useState(null);
  const [name, setname] = useState('');
  const [age, setage] = useState('');
  const [email, setemail] = useState('');
  const [isAdmin, setisAdmin] = useState(false);
  const listCL = [
    '#e74c3c',
    '#f1c40f',
    '#e67e22',
    '#9b59b6',
    '#3498db',
    '#2ecc71',
  ];

  // console.log(isAdmin);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: 25,
      alignContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'center',
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
          setImage({
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
  const HandleChangeBG = color => {
    setbgColor(color);
  };
  const HandleAddMember = () => {
    const data = {
      mName: name,
      mAvatar: {
        image: image.uri,
        color: bgColor,
      },
      mEmail: email,
      mAge: age,
      mRole: select,
      mIsAdmin: isAdmin,
    };
    if (name === '') {
      seterr('Tên thành viên không được bỏ trống');
    } else if (email === '') {
      seterr('Email không được bỏ trống');
    } else {
      RNFetchBlob.fetch(
        'POST',
        'https://househelperapp-api.herokuapp.com/add-member',
        {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        JSON.stringify(data),
      ).then(res => {
        const t = res.json();
        console.log(t);
        route.params.getlistMember();
        navigation.navigate('FamilyMain');
      });
    }
  };
  console.log(isAdmin);
  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          justifyContent: 'center',
          margin: 20,
        }}>
        <Flex justify="center">
          {loading === false && (
            <Flex>
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="green" />
              </View>
            </Flex>
          )}

          <View
            style={{flex: 1, alignContent: 'center', justifyContent: 'center'}}>
            {(loading === true || loading === null) && (
              <Flex justify="center" style={{marginBottom: 10}}>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderColor: 'gray',
                    borderWidth: 2,
                    margin: 10,
                    backgroundColor: bgColor,
                    opacity: 0.8,
                  }}
                  source={{
                    uri: image.uri,
                  }}
                />
              </Flex>
            )}
          </View>
        </Flex>
        <Flex justify="center">
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              marginBottom: 25,
            }}>
            <Flex justify="around">
              <TouchableOpacity onPress={pickImageHandler}>
                <Flex
                  justify="center"
                  align="center"
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 50,
                    borderColor: 'black',
                    borderWidth: 2,
                  }}>
                  <Icon name="camera" size="md" color="black" />
                </Flex>
              </TouchableOpacity>

              {listCL.map(item => (
                <TouchableOpacity onPress={() => HandleChangeBG(item)}>
                  <Image
                    id={item}
                    style={
                      bgColor === item
                        ? {
                            width: 45,
                            height: 45,
                            borderRadius: 50,
                            borderColor: '#2980b9',
                            borderWidth: 2,
                            backgroundColor: item,
                            opacity: 0.8,
                          }
                        : {
                            width: 45,
                            height: 45,
                            borderRadius: 50,
                            borderColor: item,
                            borderWidth: 2,
                            backgroundColor: item,
                            opacity: 0.4,
                          }
                    }
                  />
                </TouchableOpacity>
              ))}
            </Flex>
          </View>
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
            placeholder="Name"
            style={{fontSize: 18}}
            defaultValue={name}
            onChangeText={value => setname(value)}>
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
            placeholder="Email"
            style={{fontSize: 18}}
            defaultValue={email}
            onChangeText={value => setemail(value)}>
            <Flex align="center">
              <Icon name="mail" color="gray" />
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
            type="number"
            placeholder="Age"
            style={{fontSize: 18}}
            defaultValue={age}
            onChangeText={value => setage(parseInt(value, 10))}>
            <Flex align="center">
              <Icon name="gift" color="gray" />
            </Flex>
          </InputItem>
        </View>
        <Flex style={{padding: 10}}>
          <View style={{borderColor: '#bdc3c7', borderWidth: 1, flex: 4.5}}>
            <Flex justify="around">
              <Flex align="center">
                <Icon name="team" color="gray" style={{marginLeft: 20}} />
              </Flex>
              <Picker
                note
                mode="dropdown"
                style={{marginLeft: 20}}
                textStyle={{fontSize: 25}}
                itemTextStyle={{fontSize: 25}}
                selectedValue={select}
                onValueChange={setSelect.bind(this)}>
                <Picker.Item label="Bố" value="Bố" />
                <Picker.Item label="Mẹ" value="Mẹ" />
                <Picker.Item label="Con Trai" value="Con Trai" />
                <Picker.Item label="Con Gái" value="Con Gái" />
                <Picker.Item label="Ông" value="Ông" />
                <Picker.Item label="Bà" value="Bà" />
                <Picker.Item label="Khác" value="Khác" />
              </Picker>
            </Flex>
          </View>
          <View style={{flex: 3}}>
            <View
              style={{
                width: 133,
              }}>
              <Checkbox.AgreeItem
                checked={isAdmin}
                onChange={event => setisAdmin(event.target.checked)}
                style={{
                  color: 'black',
                }}>
                <Text style={{fontSize: 16}}>Quản trị viên</Text>
              </Checkbox.AgreeItem>
            </View>
          </View>
        </Flex>
        {err !== '' && (
          <Text style={{color: 'red', fontSize: 17, margin: 5}}>{err}</Text>
        )}
        <Button
          full
          default
          style={{margin: 10, marginTop: 0, backgroundColor: '#0099FF'}}
          onPress={() => HandleAddMember()}>
          <Text style={{color: 'white', fontSize: 20}}>
            Thêm mới thành viên
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}
