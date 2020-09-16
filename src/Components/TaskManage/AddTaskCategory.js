/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {Icon, Flex, Button, InputItem, Card} from '@ant-design/react-native';
import {Picker} from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';

export default function AddTaskCategory({navigation, route}) {
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
  const [err, seterr] = useState(null);
  const [name, setname] = useState('');
  const [listIcon, setlistIcon] = useState(null);
  const [icon, seticon] = useState(null);
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
  const getTaskCategoryListIcon = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-task-category-icon',
      {
        Authorization: 'Bearer ' + token,
      },
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setlistIcon(t.list);
      }
    });
  };
  useEffect(() => {
    getTaskCategoryListIcon();
  }, []);

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
  // const HandleChangeBG = color => {
  //   setbgColor(color);
  // };
  const HandleAddCategory = () => {
    const data = {
      name: name,
      image: image.uri,
    };
    RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/add-task-category',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t = res.json();
      console.log(t);
      route.params.getlistCat();
      navigation.goBack();
    });
  };
  return (
    <ScrollView>
      <View
        style={{
          margin: 5,
          backgroundColor: 'white',
        }}>
        {/* <Flex justify="center">
          {loading === false && (
            <Flex>
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
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
        </Flex> */}
        <Card style={{padding: 5, elevation: 10}}>
          <Flex justify="center" style={{padding: 10, paddingBottom: 5}}>
            <TouchableOpacity onPress={pickImageHandler}>
              <Image
                style={{
                  height: 60,
                  width: 60,
                  borderColor: '#0099FF',
                  borderWidth: 2,
                  borderRadius: 50,
                  backgroundColor: 'white',
                }}
                source={{uri: image.uri}}
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Tên loại công việc"
              onChangeText={value => setname(value)}
              style={{
                fontSize: 18,
                padding: 10,
              }}
            />
          </Flex>
        </Card>
        <Card style={{padding: 5, elevation: 10, marginTop: 10}}>
          {listIcon === null ? (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#0099FF" />
            </View>
          ) : (
            <Flex justify="between" wrap="wrap">
              {listIcon &&
                listIcon.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      setImage({uri: item});
                    }}>
                    <Image
                      style={
                        image.uri === item
                          ? {
                              height: 60,
                              width: 60,
                              borderWidth: 2,
                              borderColor: '#0099FF',
                              borderRadius: 50,
                            }
                          : {height: 60, width: 60}
                      }
                      source={{
                        uri: item,
                      }}
                    />
                  </TouchableOpacity>
                ))}
            </Flex>
          )}
        </Card>
        {/* <View
          style={{
            borderWidth: 1,
            borderColor: '#CCCCCC',
            margin: 10,
            padding: 5,
          }}>
          <InputItem
            clear
            placeholder="Tên loại công việc"
            style={{fontSize: 18}}
            defaultValue={name}
            onChangeText={value => setname(value)}>
            <Flex align="center">
              <Icon name="robot" color="gray" />
            </Flex>
          </InputItem>
        </View> */}

        <Button
          full
          type="primary"
          style={{margin: 5, marginTop: 10}}
          onPress={() => HandleAddCategory()}>
          Thêm mới loại công việc
        </Button>
      </View>
    </ScrollView>
  );
}
