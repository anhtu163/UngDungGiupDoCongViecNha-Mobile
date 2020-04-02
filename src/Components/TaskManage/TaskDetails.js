/* eslint-disable react-hooks/exhaustive-deps */
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
  Switch,
  ActivityIndicator,
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
  Toast,
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
  const {assign} = route.params;
  const {category} = route.params;

  const [image, setImage] = useState({
    uri: img,
  });
  const [loading, setLoading] = useState(null);
  const [Tname, setTName] = useState(name);
  const [select, setSelect] = useState(time);
  const [selectpts, setSelectpts] = useState(point);
  const [selectdate, setSelectDate] = useState(date);
  const [_note, setNote] = useState(note);
  // check assign
  const [keyMember, setkeyMember] = useState([]);
  const [listMember, setlistMember] = useState(null);
  const [listCat, setlistCat] = useState(null);
  const [keyCat, setkeyCat] = useState(null);
  //isBoth
  const [isAll, setIsAll] = useState(false);
  const toggleSwitch = () => setIsAll(previousState => !previousState);
  // check more 2 member in task to display switch do together
  const [isMoreTwo, setIsMoreTwo] = useState(false);
  const [noti, setNoti] = useState('');

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

  const defaultD =
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    (date.getYear() + 1900);
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
  const handleCheckMember = index => {
    const i = keyMember.indexOf(index);
    if (i !== -1) {
      const t = keyMember;
      t.splice(i, 1);
      setkeyMember([...t]);
    } else {
      setkeyMember([...keyMember, index]);
    }
  };
  const handleCheckCat = index => {
    // sconst i = keyCat.indexOf(index);
    setkeyCat(index);
  };
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
  const getlistCat = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-task-category',
      {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k',
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      setlistCat(t.listTaskCategories);
    });
  };
  const handleEditTask = () => {
    const data = {
      _id: id,
      name: Tname,
      notes: note,
      photo: image.uri,
      assign: {
        mAssigns: keyMember,
        isAll: isAll,
      },
      date: null,
      tcID: keyCat,
      time: select,
      points: selectpts,
    };
    console.log(data);
    RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/edit-task',
      {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k',
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t = res.json();
      console.log(t.code);
      if (t.code === 2020) {
        setNoti('Update Task Successfully!');
      } else {
        setNoti('Update Task Failed!');
      }
    });
  };
  useEffect(() => {
    getlistMember();
    getlistCat();
    if (assign !== null) {
      const t = [];
      assign.mAssigns.map(item => {
        t.push(item.mID._id);
      });
      setkeyMember(t);
      setIsAll(assign.isAll);
    }
    setkeyCat(category._id);
    if (image.uri) {
      setLoading(true);
    }
    setIsMoreTwo(keyMember.length);
  }, []);
  useEffect(() => {
    if (keyMember.length >= 2) {
      setIsMoreTwo(true);
    } else {
      setIsMoreTwo(false);
    }
  }, [keyMember.length]);
  // console.log(loading);
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
                defaultValue={Tname}
                onChangeText={value => {
                  setTName(value);
                  setNoti('');
                }}
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
          <Card style={{padding: 10, margin: 5}}>
            <Flex>
              <Icon name="team" color="black" size="md" />
              <Text style={{color: 'green', fontSize: 18, marginLeft: 5}}>
                Assign
              </Text>
              {isMoreTwo && (
                <View style={{flex: 10}}>
                  <Flex justify="end">
                    <Text style={{color: 'green', fontSize: 14, marginLeft: 5}}>
                      Do Together
                    </Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#green'}}
                      thumbColor={isAll ? 'green' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isAll}
                    />
                  </Flex>
                </View>
              )}
            </Flex>
            {listMember === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="green" />
              </View>
            ) : (
              <Flex justify="around" style={{marginTop: 10}} wrap="wrap">
                {listMember.map(item => (
                  <Flex direction="column" style={{margin: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckMember(item._id);
                        setNoti('');
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
                    <View>
                      <Text numberOfLines={1} style={{maxWidth: 55}}>
                        {item.mName}
                      </Text>
                    </View>
                  </Flex>
                ))}
              </Flex>
            )}
          </Card>
          <Card
            style={{
              padding: 10,
              margin: 5,
            }}>
            <Flex>
              <Icon name="tag" color="black" size="md" />
              <Text style={{color: 'green', fontSize: 18, marginLeft: 5}}>
                Category
              </Text>
            </Flex>
            {listCat === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="green" />
              </View>
            ) : (
              <Flex justify="around" style={{marginTop: 10}} wrap="wrap">
                {listCat.map(item => (
                  <Flex direction="column" style={{margin: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckCat(item._id);
                        setNoti('');
                      }}>
                      <Image
                        style={
                          keyCat === item._id
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
                        source={{uri: item.image}}
                        id={item._id}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text numberOfLines={1} style={{maxWidth: 60}}>
                        {item.name}
                      </Text>
                    </View>
                  </Flex>
                ))}
              </Flex>
            )}
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
                  onDateChange={value => {
                    setSelectDate(value);
                    setNoti('');
                  }}
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
              <Flex.Item />
            </Flex>
          </Card>
          {loading === false && (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="green" />
            </View>
          )}
          {loading === true && (
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
          )}
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
              defaultValue={_note}
              onChangeText={value => {
                setNote(value);
                setNoti('');
              }}
              count={150}
            />
          </Card>

          {noti === 'Update Task Successfully!' && (
            <Flex
              justify="center"
              style={{backgroundColor: 'green', margin: 5, padding: 5}}>
              <Text style={{color: 'white', height: 20, fontSize: 16}}>
                {noti}
              </Text>
            </Flex>
          )}
          {noti === 'Update Task Failed!' && (
            <Flex
              justify="center"
              style={{backgroundColor: 'red', margin: 5, padding: 5}}>
              <Text style={{color: 'white', height: 20, fontSize: 16}}>
                {noti}
              </Text>
            </Flex>
          )}
          <Flex style={{marginTop: 10}}>
            <Flex.Item>
              <Button full danger style={{margin: 5}}>
                <Text style={{color: 'white', fontSize: 20}}>Delete</Text>
              </Button>
            </Flex.Item>
            <Flex.Item>
              <Button
                full
                success
                style={{margin: 5}}
                onPress={() => {
                  handleEditTask();
                }}>
                <Text style={{color: 'white', fontSize: 20}}>Save</Text>
              </Button>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </ScrollView>
    </View>
  );
}
