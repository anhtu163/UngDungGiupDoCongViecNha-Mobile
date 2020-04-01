/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {DatePicker, Button, Picker, Label} from 'native-base';
import ImagePicker from 'react-native-image-picker';
import {
  Card,
  WingBlank,
  WhiteSpace,
  Flex,
  Icon,
  TextareaItem,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function AddTask({route, navigation}) {
  const styleCheck = StyleSheet.create({
    check: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderColor: 'green',
      borderWidth: 2,
    },
    non_check: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderColor: 'black',
      borderWidth: 1,
    },
  });
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [image, setImage] = useState({uri: ''});
  const [select, setSelect] = useState(0); // time
  const [selectpts, setSelectpts] = useState(0); // point
  const [keyMember, setkeyMember] = useState([]);
  const [listMember, setlistMember] = useState([]);
  // let checkMember = [];

  const handleCheckMember = index => {
    const i = keyMember.indexOf(index);
    // console.log(i);
    if (i !== -1) {
      //Member.splice(i, 1);
      const t = keyMember;
      t.splice(i, 1);
      setkeyMember([...t]);
      // console.log('checkM: ' + checkMember);
      // console.log('checkKeyMember: ' + keyMember);
    } else {
      setkeyMember([...keyMember, index]);
      // console.log('checkKeyMember: ' + keyMember);
      // checkMember.push(index);
    }
  };
  // console.log('checkKeyMember: ' + keyMember);
  // console.log('checkM: ' + checkMember);
  //list member demo
  const getlistMember = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-member',
      {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k',
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      setlistMember(t.listMembers);
    });
  };
  useEffect(() => {
    getlistMember();
  }, []);
  // console.log(listMember);
  // getlistMember();
  // const listMember1 = [
  //   {
  //     id: '1',
  //     name: 'Từ Anh',
  //     img:
  //       'https://thuthuatnhanh.com/wp-content/uploads/2018/07/anh-dai-dien-dep-439x390.jpg',
  //   },
  //   {
  //     id: '2',
  //     name: 'Lê Tuyết',
  //     img:
  //       'https://hinhnendephd.com/wp-content/uploads/2019/10/anh-avatar-dep.jpg',
  //   },
  //   {
  //     id: '3',
  //     name: 'Cát Uyên',
  //     img:
  //       'https://i.pinimg.com/236x/4b/81/77/4b81778263d5f5f51df7e26ff40f7bb8.jpg',
  //   },
  //   {
  //     id: '4',
  //     name: 'Tuấn Vũ',
  //     img:
  //       'https://i.pinimg.com/236x/4b/81/77/4b81778263d5f5f51df7e26ff40f7bb8.jpg',
  //   },
  // ];
  // console.log(listMember);
  // Add your Cloudinary name here
  const YOUR_CLOUDINARY_NAME = 'datn22020';

  // If you dont't hacve a preset id, head over to cloudinary and create a preset, and add the id below
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
        uploadFile(res).then(async response => {
          let data = await response.json();
          setImage({
            uri: data.url,
          });
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
  console.log(keyMember);
  return (
    <View style={{paddingTop: 10}}>
      <ScrollView>
        <WingBlank size="sm">
          <Card style={{padding: 10}}>
            <Flex justify="center">
              <TextInput
                style={{fontSize: 20, fontFamily: ''}}
                placeholder="Task name"
                defaultValue={name}
                onChangeText={value => setName(value)}
              />
            </Flex>
          </Card>
          <WhiteSpace />

          <Flex justify="between">
            <Flex.Item style={{margin: 5}}>
              <Flex
                style={{
                  backgroundColor: '#bdc3c7',
                }}
                justify="around">
                <Icon
                  name="clock-circle"
                  size={28}
                  color="white"
                  style={{marginLeft: 10}}
                />
                {/* <Button
                  transparent
                  activeStyle={{backgroundColor: '#bdc3c7'}}
                  style={{backgroundColor: '#bdc3c7', borderColor: '#bdc3c7'}}>
                  <Text style={{color: 'white', fontSize: 18}}>0 mins</Text>
                </Button> */}
                <Flex.Item>
                  <Picker
                    note
                    mode="dropdown"
                    style={{
                      color: 'white',
                      backgroundColor: '#bdc3c7',
                      marginLeft: 20,
                    }}
                    selectedValue={select}
                    onValueChange={setSelect.bind(this)}>
                    <Picker.Item label="0 mins" value="0" />
                    <Picker.Item label="30 mins" value="30" />
                    <Picker.Item label="60 mins" value="60" />
                    <Picker.Item label="120 mins" value="120" />
                    <Picker.Item label="180 mins" value="180" />
                  </Picker>
                </Flex.Item>
              </Flex>
            </Flex.Item>
            <Flex.Item style={{margin: 5}}>
              <Flex
                style={{
                  backgroundColor: '#bdc3c7',
                }}
                justify="around">
                <Icon
                  name="star"
                  size={30}
                  color="white"
                  style={{marginLeft: 10}}
                />
                {/* <Button
                  transparent
                  activeStyle={{backgroundColor: '#bdc3c7'}}
                  style={{backgroundColor: '#bdc3c7', border: 'none'}}
                  size="large">
                  <Text style={{color: 'white', fontSize: 18}}>0 pts</Text>
                </Button> */}
                <Flex.Item>
                  <Picker
                    note
                    mode="dropdown"
                    style={{
                      color: 'white',
                      backgroundColor: '#bdc3c7',
                      marginLeft: 20,
                    }}
                    selectedValue={selectpts}
                    onValueChange={setSelectpts.bind(this)}>
                    <Picker.Item label="0 pts" value="0" />
                    <Picker.Item label="10 pts" value="10" />
                    <Picker.Item label="20 pts" value="20" />
                    <Picker.Item label="50 pts" value="50" />
                    <Picker.Item label="100 pts" value="100" />
                  </Picker>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
          <Card style={{padding: 10, margin: 5}}>
            <Flex>
              <Icon name="team" color="black" size="md" />
              <Text style={{color: 'green', fontSize: 18, marginLeft: 5}}>
                Assign
              </Text>
            </Flex>
            <Flex justify="around" style={{marginTop: 5}}>
              {listMember.map(item => (
                <Flex direction="column" wrap="wrap">
                  <Flex.Item>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckMember(item._id);
                        // console.log('checkKeyMember: ' + keyMember);
                      }}>
                      <Image
                        style={
                          keyMember.indexOf(item._id) !== -1
                            ? {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderColor: 'green',
                                borderWidth: 2.5,
                              }
                            : {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderColor: 'black',
                                borderWidth: 0.5,
                              }
                        }
                        source={{uri: item.mAvatar}}
                        id={item._id}
                      />
                    </TouchableOpacity>
                  </Flex.Item>
                  <Flex.Item>
                    <Text>{item.mName}</Text>
                  </Flex.Item>
                  {/* {keyMember.indexOf(item.id) !== -1 ? (
                    <Icon name="check" color="green" />
                  ) : (
                    <Icon name="check" color="red" />
                  )} */}
                </Flex>
              ))}
            </Flex>
          </Card>
          <Card style={{backgroundColor: 'white', margin: 5}}>
            <Flex justify="start">
              <Icon
                name="calendar"
                size="md"
                color="black"
                style={{marginLeft: 5, backgroundColor: 'white'}}
              />

              <Flex.Item>
                <DatePicker
                  defaultDate={dueDate}
                  locale={'en'}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={true}
                  animationType={'slide'}
                  androidMode={'calendar'}
                  placeHolderText="Due time"
                  textStyle={{color: 'green', fontSize: 18}}
                  placeHolderTextStyle={{
                    color: 'green',
                    fontSize: 18,
                  }}
                  onDateChange={date => setDueDate(date)}
                  disabled={false}
                />
              </Flex.Item>
            </Flex>
            <Flex justify="start">
              <Icon
                name="camera"
                size="md"
                color="black"
                style={{marginLeft: 5}}
              />

              <View>
                <Button
                  full
                  transparent
                  style={{marginLeft: 10}}
                  onPress={pickImageHandler}>
                  <Text style={{color: 'green', fontSize: 18}}>Photo</Text>
                </Button>
              </View>
            </Flex>
          </Card>

          <View>
            <Flex justify="around">
              {image.uri ? (
                <Image
                  style={{width: 200, height: 200, margin: 5}}
                  source={{
                    uri: image.uri,
                  }}
                />
              ) : (
                <WhiteSpace />
              )}
            </Flex>
          </View>

          <Card style={{margin: 5}}>
            <Label style={{color: 'green', marginLeft: 5}}>Note:</Label>
            <TextareaItem
              rows={4}
              style={{
                borderStyle: 'solid',
                borderColor: 'green',
                borderWidth: 1,
                margin: 5,
              }}
              placeholder="Write a note"
              defaultValue={note}
              onChangeText={value => setNote(value)}
              count={150}
            />
          </Card>
          <Button full success style={{margin: 5}}>
            <Text style={{color: 'white', fontSize: 20}}>Add New Task</Text>
          </Button>
        </WingBlank>
      </ScrollView>
    </View>
  );
}
