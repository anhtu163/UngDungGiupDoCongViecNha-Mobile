/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState} from 'react';
import {View, Text, TextInput, Image, ScrollView} from 'react-native';
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

export default function TaskDetails({route, navigation}) {
  const {name} = route.params;
  const {time} = route.params;
  const {point} = route.params;
  const {date} = route.params;
  const {note} = route.params;
  const {img} = route.params;
  const {id} = route.params;

  const [image, setImage] = useState({
    uri: img,
  });
  const [select, setSelect] = useState(time);
  const [selectpts, setSelectpts] = useState(point);
  const [selectdate, setSelectDate] = useState(date);
  const [_note, setNote] = useState(note);
  console.log(select);
  const defaultD =
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    (date.getYear() + 1900);
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
  console.log(id);
  return (
    <View style={{paddingTop: 10}}>
      <ScrollView>
        <WingBlank size="sm">
          <Card style={{padding: 10}}>
            <Flex justify="center">
              <TextInput
                required
                style={{fontSize: 20, fontFamily: ''}}
                placeholder="Task Name"
                defaultValue={name}
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
                style={{backgroundColor: '#bdc3c7', borderColor: '#bdc3c7'}}
                size="large">
                <Text style={{color: 'white', fontSize: 18}}>
                  {time || '(none)'} mins
                </Text>
              </Button> */}
                <Flex.Item>
                  <Picker
                    mode="dropdown"
                    style={{
                      color: 'white',
                      backgroundColor: '#bdc3c7',
                      marginLeft: 20,
                    }}
                    selectedValue={select}
                    onValueChange={setSelect.bind(this)}>
                    <Picker.Item label="0 mins" value={0} />
                    <Picker.Item label="1 mins" value={1} />
                    <Picker.Item label="10 mins" value={10} />
                    <Picker.Item label="30 mins" value={30} />
                    <Picker.Item label="60 mins" value={60} />
                    <Picker.Item label="120 mins" value={120} />
                    <Picker.Item label="180 mins" value={180} />
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
                style={{backgroundColor: '#bdc3c7', borderColor: '#bdc3c7'}}
                size="large">
                <Text style={{color: 'white', fontSize: 18}}>
                  {point || '(none)'} pts
                </Text>
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
                    <Picker.Item label="0 pts" value={0} />
                    <Picker.Item label="5 pts" value={5} />
                    <Picker.Item label="10 pts" value={10} />
                    <Picker.Item label="20 pts" value={20} />
                    <Picker.Item label="50 pts" value={50} />
                    <Picker.Item label="100 pts" value={100} />
                  </Picker>
                </Flex.Item>
              </Flex>
            </Flex.Item>
          </Flex>
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
                  defaultDate={selectdate}
                  locale={'en'}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={true}
                  animationType={'slide'}
                  androidMode={'calendar'}
                  placeHolderText={defaultD}
                  textStyle={{color: 'green', fontSize: 18}}
                  placeHolderTextStyle={{
                    color: 'green',
                    fontSize: 18,
                  }}
                  onDateChange={value => setSelectDate(value)}
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
                  <Text style={{color: 'green', fontSize: 18}}>Hình ảnh</Text>
                </Button>
              </View>
              <Flex.Item />
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
            <Label style={{color: 'green', marginLeft: 5}}>Ghi chú:</Label>
            <TextareaItem
              rows={4}
              style={{
                borderStyle: 'solid',
                borderColor: 'green',
                borderWidth: 1,
                margin: 5,
              }}
              placeholder="Ghi chú"
              defaultValue={_note}
              onChangeText={value => setNote(value)}
              count={150}
            />
          </Card>
          <Flex style={{marginTop: 10}}>
            <Flex.Item>
              <Button full danger style={{margin: 5}}>
                <Text style={{color: 'white', fontSize: 20}}>Xóa</Text>
              </Button>
            </Flex.Item>
            <Flex.Item>
              <Button full success style={{margin: 5}}>
                <Text style={{color: 'white', fontSize: 20}}>Lưu</Text>
              </Button>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </ScrollView>
    </View>
  );
}
