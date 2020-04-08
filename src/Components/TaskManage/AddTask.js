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
  StyleSheet,
  ActivityIndicator,
  Switch,
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
  // Toast,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function AddTask({route, navigation}) {
  const {token} = route.params;
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [note, setNote] = useState('');
  const [image, setImage] = useState({uri: ''});
  const [select, setSelect] = useState(0); // time
  const [selectpts, setSelectpts] = useState(0); // point
  const [keyMember, setkeyMember] = useState([]);
  const [listMember, setlistMember] = useState(null);
  const [listCat, setlistCat] = useState(null);
  const [keyCat, setkeyCat] = useState(null);
  // const [noti, setNoti] = useState(0);
  const [loading, setLoading] = useState(null);
  // let checkMember = [];

  const [isAll, setIsAll] = useState(false);
  const toggleSwitch = () => setIsAll(previousState => !previousState);
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
    setkeyCat(index);
  };
  //list member
  const getlistMember = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-member',
      {
        Authorization: 'Bearer ' + token,
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
        Authorization: 'Bearer ' + token,
      },
    ).then(res => {
      const t = res.json();
      setlistCat(t.listTaskCategories);
    });
  };
  useEffect(() => {
    getlistMember();
    getlistCat();
    setkeyCat('');
  }, []);
  useEffect(() => {
    if (keyMember.length >= 2) {
      setIsMoreTwo(true);
    } else {
      setIsMoreTwo(false);
    }
  }, [keyMember.length]);
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
  const handleAddTask = () => {
    const data = {
      name: name,
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
      'https://househelperapp-api.herokuapp.com/add-task',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t = res.json();
      console.log(t);
      if (t.code === 2020) {
        navigation.navigate('TaskList');
        // setNoti('Add New Task Successfully!');
      } else {
        setNoti('Add New Task Failed!');
      }
    });
  };
  // console.log(keyCat);
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
                onChangeText={value => {
                  setName(value);
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
                        // handleCheckMoreTwoMember();
                        // console.log('checkKeyMember: ' + keyMember
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
                                opacity: 0.4,
                                backgroundColor: item.mAvatar.color,
                              }
                            : {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderColor: 'black',
                                borderWidth: 0.5,
                                opacity: 0.4,
                                backgroundColor: item.mAvatar.color,
                              }
                        }
                        source={{uri: item.mAvatar.image}}
                        id={item._id}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text numberOfLines={1} style={{width: 60}}>
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
                        // console.log('checkKeyMember: ' + keyMember);
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
                      <Text numberOfLines={1} style={{width: 60}}>
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
                  onDateChange={date => {
                    setDueDate(date);
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
              defaultValue={note}
              onChangeText={value => {
                setNote(value);
                setNoti('');
              }}
              count={150}
            />
          </Card>
          {/* {noti === 'Add New Task Successfully!' && (
            <Flex
              justify="center"
              style={{backgroundColor: 'green', margin: 5, padding: 5}}>
              <Text style={{color: 'white', height: 20, fontSize: 16}}>
                {noti}
              </Text>
            </Flex>
          )} */}
          {noti === 'Add New Task Failed!' && (
            <Flex
              justify="center"
              style={{backgroundColor: 'red', margin: 5, padding: 5}}>
              <Text style={{color: 'white', height: 20, fontSize: 16}}>
                {noti}
              </Text>
            </Flex>
          )}
          <Button
            full
            success
            style={{margin: 5}}
            onPress={() => handleAddTask()}>
            <Text style={{color: 'white', fontSize: 20}}>Add New Task</Text>
          </Button>
        </WingBlank>
      </ScrollView>
    </View>
  );
}
