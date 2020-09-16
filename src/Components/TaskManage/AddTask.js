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
  InputItem,
  // Toast,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddTask({route, navigation}) {
  const {token} = route.params;
  const {socket} = route.params;
  const [name, setName] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [dueDateTime, setdueDateTime] = useState(null);
  const [note, setNote] = useState('');
  const [image, setImage] = useState({uri: ''});
  const [select, setSelect] = useState(0); // time
  const [selectpts, setSelectpts] = useState(0); // point
  const [keyMember, setkeyMember] = useState([]);
  const [listMember, setlistMember] = useState(null);
  const [listCat, setlistCat] = useState(null);
  const [keyCat, setkeyCat] = useState(null);
  const [err, seterr] = useState('');
  const [errname, seterrname] = useState('');
  const [penalty, setpenalty] = useState(0);
  const [loading, setLoading] = useState(null);
  // let checkMember = [];
  const [startdate, setstartdate] = useState(new Date());
  const [starttime, setstarttime] = useState(new Date());
  const [RStartTime, setRStartTime] = useState(null);

  const [isAll, setIsAll] = useState(false);
  const toggleSwitch = () => setIsAll(previousState => !previousState);
  const [isMoreTwo, setIsMoreTwo] = useState(false);
  const [showRepeat, setshowRepeat] = useState(false);
  const [repeat, setrepeat] = useState(null);

  const [showReminder, setshowReminder] = useState(false);
  const [reminder, setreminder] = useState(null);

  //Đoạn code mới
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDateRepeatPickerVisible, setDateRepeatPickerVisibility] = useState(
    false,
  );
  const [isTimeRepeatPickerVisible, setTimeRepeatPickerVisibility] = useState(
    false,
  );
  const [tasklist, setTaskList] = useState(null);
  const getlist = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-task',
      {
        Authorization: 'Bearer ' + token,
        // more headers  ..
      },
    ).then(res => {
      const r = res.json();
      setTaskList(r.listTasks);
      // console.log(r.listTasks);
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const showDateRepeatPicker = () => {
    setDateRepeatPickerVisibility(true);
  };

  const hideDateRepeatPicker = () => {
    setDateRepeatPickerVisibility(false);
  };
  const showTimeRepeatPicker = () => {
    setTimeRepeatPickerVisibility(true);
  };

  const hideTimeRepeatPicker = () => {
    setTimeRepeatPickerVisibility(false);
  };
  const handleTimeConfirm = dt => {
    hideTimePicker();
    setTime(dt);
    setdueDateTime(
      dueDate.getFullYear() +
        '-' +
        (dueDate.getMonth() + 1) +
        '-' +
        dueDate.getDate() +
        ' ' +
        dt.getHours() +
        ':' +
        dt.getMinutes() +
        ':00 +07:00',
    );
  };

  const handleConfirm = dt => {
    hideDatePicker();
    setDueDate(dt);
    setdueDateTime(
      `${dt.getFullYear()}-${dt.getMonth() +
        1}-${dt.getDate()} ${time.getHours()}:${time.getMinutes()}:00 +07:00`,
    );
  };
  const handleTimeRepeatConfirm = dt => {
    hideTimeRepeatPicker();
    setstarttime(dt);
    setRStartTime(
      startdate.getFullYear() +
        '-' +
        (startdate.getMonth() + 1) +
        '-' +
        startdate.getDate() +
        ' ' +
        dt.getHours() +
        ':' +
        dt.getMinutes() +
        ':00 +07:00',
    );
  };

  const handleRepeatConfirm = dt => {
    hideDateRepeatPicker();
    setstartdate(dt);
    setRStartTime(
      `${dt.getFullYear()}-${dt.getMonth() +
        1}-${dt.getDate()} ${starttime.getHours()}:${starttime.getMinutes()}:00 +07:00`,
    );
  };
  //

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
    if (keyMember.length < 2) {
      setIsAll(false);
    }
  };
  const handleCheckCat = (index, img, tcname) => {
    if (keyCat === index) {
      navigation.navigate('EditTaskCategory', {
        id: index,
        image: img,
        name: tcname,
        token: token,
        listCat: listCat,
        getlistCat: getlistCat,
      });
    } else {
      setkeyCat(index);
    }
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
    getlist();
  }, []);
  useEffect(() => {
    if (keyMember.length >= 2) {
      setIsMoreTwo(true);
    } else {
      setIsMoreTwo(false);
    }
  }, [keyMember.length]);
  useEffect(() => {
    if (listCat !== null) {
      setkeyCat(listCat[0]._id);
    }
  }, [listCat]);
  useEffect(() => {
    if (showRepeat === false) {
      setrepeat(null);
    }
    if (showReminder === false) {
      setreminder(null);
    }
  });
  useEffect(() => {
    if (showRepeat === false) {
      setRStartTime(null);
      setstartdate(new Date());
      setstarttime(new Date());
      setrepeat(null);
    }
  }, [showRepeat]);
  useEffect(() => {
    if (socket) {
      socket.on('TaskCategory', data => {
        getlistCat();
      });
      socket.on('Member', data => {
        getlistMember();
      });
    }
  }, []);
  // console.log(reminder);
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
      dueDate: dueDateTime,
      penalty: penalty,
      tcID: keyCat,
      time: select,
      points: selectpts,
      repeat: repeat === null ? null : {type: repeat, start: RStartTime},
      reminder: reminder,
    };
    console.log(data);
    if (name === '') {
      seterr('Tên công việc không được bỏ trống !!!!');
    } else if (select === 0) {
      seterr('Thời gian thực hiện không được bỏ trống !!!!');
    } else if (selectpts === 0) {
      seterr('Điểm công việc không được bỏ trống !!!!');
    } else if (selectpts <= penalty) {
      seterr(
        'Điểm trừ khi không hoàn thành không được lớn hơn điểm của công việc !!!',
      );
    } else if (
      tasklist &&
      tasklist.filter(item => item.name === name).length > 0
    ) {
      seterr('Tên công việc đã tồn tại');
    } else {
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
          navigation.navigate('TaskList', {added: true});
        } else {
          seterr(t.message);
        }
      });
    }
  };
  // console.log(keyCat);
  return (
    <View style={{paddingTop: 10, backgroundColor: 'white'}}>
      <ScrollView>
        <WingBlank size="sm">
          <Card style={{padding: 10, elevation: 5}}>
            <Flex justify="center">
              <TextInput
                style={{fontSize: 20, fontFamily: ''}}
                placeholder="Tên công việc"
                defaultValue={name}
                onChangeText={value => {
                  setName(value);
                  tasklist &&
                  tasklist.filter(item => item.name === value).length > 0
                    ? seterrname('!!!Tên công việc đã tồn tại')
                    : seterrname('');
                  seterr('');
                }}
              />
            </Flex>
          </Card>
          <WhiteSpace />
          {errname !== '' && (
            <Text style={{color: 'red', fontSize: 17, margin: 10}}>
              {errname}
            </Text>
          )}

          <Flex justify="between" style={{marginRight: 6}}>
            <Flex.Item style={{margin: 5, flex: 1, elevation: 5}}>
              <Flex
                style={{
                  backgroundColor: '#bdc3c7',
                }}
                justify="around">
                <Icon
                  name="clock-circle"
                  size={23}
                  color="white"
                  style={{marginLeft: 10}}
                />
                <View>
                  <Picker
                    note
                    mode="dropdown"
                    style={{
                      color: 'white',
                      backgroundColor: '#bdc3c7',
                      minWidth: 135,
                      //marginRight: -10,
                      //paddingRight: -10,
                    }}
                    selectedValue={select}
                    onValueChange={setSelect.bind(this)}>
                    <Picker.Item label="0 phút" value={0} />
                    <Picker.Item label="3 phút" value={3} />
                    <Picker.Item label="5 phút" value={5} />
                    <Picker.Item label="10 phút" value={10} />
                    <Picker.Item label="15 phút" value={15} />
                    <Picker.Item label="20 phút" value={20} />
                    <Picker.Item label="30 phút" value={30} />
                    <Picker.Item label="60 phút" value={60} />
                    <Picker.Item label="120 phút" value={120} />
                    <Picker.Item label="180 phút" value={180} />
                  </Picker>
                </View>
              </Flex>
            </Flex.Item>
            <Flex.Item style={{margin: 5, flex: 1, elevation: 5}}>
              <Flex
                style={{
                  backgroundColor: '#bdc3c7',
                }}
                justify="around">
                <Icon
                  name="star"
                  size={25}
                  color="white"
                  style={{marginLeft: 10}}
                />
                <View>
                  <Picker
                    note
                    mode="dropdown"
                    style={{
                      color: 'white',
                      backgroundColor: '#bdc3c7',
                      minWidth: 135,
                    }}
                    selectedValue={selectpts}
                    onValueChange={setSelectpts.bind(this)}>
                    <Picker.Item label="0 điểm" value={0} />
                    <Picker.Item label="5 điểm" value={5} />
                    <Picker.Item label="10 điểm" value={10} />
                    <Picker.Item label="15 điểm" value={15} />
                    <Picker.Item label="20 điểm" value={20} />
                    <Picker.Item label="25 điểm" value={25} />
                    <Picker.Item label="30 điểm" value={30} />
                    <Picker.Item label="50 điểm" value={50} />
                    <Picker.Item label="100 điểm" value={100} />
                  </Picker>
                </View>
              </Flex>
            </Flex.Item>
          </Flex>
          <Card style={{padding: 10, margin: 5, elevation: 5}}>
            <Flex>
              <Icon name="team" color="black" size="md" />
              <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                Phân công
              </Text>
              {isMoreTwo && (
                <View style={{flex: 10}}>
                  <Flex justify="end">
                    <Text
                      style={{color: '#0099FF', fontSize: 14, marginLeft: 5}}>
                      Làm cùng nhau
                    </Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#34ace0'}}
                      thumbColor={isAll ? '#0099FF' : '#0099FF'}
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
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <Flex justify="start" style={{marginTop: 10}} wrap="wrap">
                {listMember.map(item => (
                  <Flex direction="column" style={{margin: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckMember(item._id);
                        seterr('');
                        // handleCheckMoreTwoMember();
                        // console.log('checkKeyMember: ' + keyMember
                      }}>
                      <Image
                        style={
                          keyMember.indexOf(item._id) !== -1
                            ? {
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                borderColor: '#0099FF',
                                borderWidth: 3,
                                opacity: item.mAvatar.color ? 0.6 : 1,
                                backgroundColor: item.mAvatar.color,
                              }
                            : {
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                borderColor: 'gray',
                                borderWidth: 2,
                                opacity: item.mAvatar.color ? 0.6 : 1,
                                backgroundColor: item.mAvatar.color,
                              }
                        }
                        source={{uri: item.mAvatar.image}}
                        id={item._id}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text numberOfLines={1} style={{maxWidth: 62}}>
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
              paddingLeft: 5,
              elevation: 5,
            }}>
            <Flex>
              <Icon name="tag" color="black" size="md" />
              <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                Loại công việc
              </Text>
            </Flex>
            {listCat === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <Flex justify="between" style={{marginTop: 10}} wrap="wrap">
                {listCat.map(item => (
                  <Flex direction="column" style={{width: 60, marginTop: 10}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckCat(item._id, item.image, item.name);
                        // console.log('checkKeyMember: ' + keyMember);
                        seterr('');
                      }}>
                      <Image
                        style={
                          keyCat === item._id
                            ? {
                                width: 44,
                                height: 44,
                                borderRadius: 25,
                                borderColor: '#0099FF',
                                borderWidth: 3,
                              }
                            : {
                                width: 44,
                                height: 44,
                                borderRadius: 25,
                                borderColor: 'gray',
                                borderWidth: 2,
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
                <View style={{width: 60, marginTop: 10, paddingLeft: 10}}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddTaskCategory', {
                        getlistCat: getlistCat,
                      })
                    }>
                    <Icon name="plus-circle" size="lg" color="#0099FF" />
                  </TouchableOpacity>
                </View>
              </Flex>
            )}
          </Card>
          <Card style={{backgroundColor: 'white', margin: 5, elevation: 5}}>
            <Flex justify="start" style={{marginTop: 10}}>
              <Icon
                name="redo"
                size="md"
                color="black"
                style={{marginLeft: 5}}
              />

              <View>
                <TouchableOpacity
                  onPress={() => {
                    setshowRepeat(!showRepeat);
                  }}>
                  <Text
                    style={{color: '#0099FF', fontSize: 16, marginLeft: 10}}>
                    Lặp lại
                  </Text>
                </TouchableOpacity>
              </View>
            </Flex>
            <View>
              {showRepeat === true && (
                <View>
                  <Flex
                    justify="around"
                    style={{marginTop: 10, marginBottom: 15}}>
                    <TouchableOpacity
                      style={
                        repeat === 'daily'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        setrepeat('daily');
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          padding: 8,
                        }}>
                        Hàng ngày
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        repeat === 'weekly'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        setrepeat('weekly');
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          padding: 8,
                        }}>
                        Hàng tuần
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        repeat === 'monthly'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        setrepeat('monthly');
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          padding: 8,
                        }}>
                        Hàng tháng
                      </Text>
                    </TouchableOpacity>
                  </Flex>
                  <Flex justify="start" style={{marginLeft: 10}}>
                    <View style={{flex: 1}}>
                      <TouchableOpacity onPress={showDateRepeatPicker}>
                        <Flex>
                          <Icon
                            name="calendar"
                            size="md"
                            color="black"
                            style={{marginLeft: 5, backgroundColor: 'white'}}
                          />
                          <Text
                            style={{
                              marginLeft: 10,
                              color: '#0099FF',
                              fontSize: 16,
                            }}>
                            {RStartTime
                              ? startdate.getDate() >= 10 &&
                                startdate.getMonth() + 1 >= 10
                                ? startdate.getDate() +
                                  '/' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                                : startdate.getDate() < 10 &&
                                  startdate.getMonth() + 1 >= 10
                                ? '0' +
                                  startdate.getDate() +
                                  '/' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                                : startdate.getDate() >= 10 &&
                                  startdate.getMonth() + 1 < 10
                                ? startdate.getDate() +
                                  '/0' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                                : '0' +
                                  startdate.getDate() +
                                  '/0' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                              : 'Ngày bắt đầu'}
                          </Text>
                        </Flex>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDateRepeatPickerVisible}
                        date={startdate}
                        mode="date"
                        onDateChange={dt => {
                          setstartdate(dt);
                          console.log(dt);
                          seterr('');
                        }}
                        onConfirm={handleRepeatConfirm}
                        onCancel={hideDateRepeatPicker}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <TouchableOpacity onPress={showTimeRepeatPicker}>
                        <Flex>
                          <Icon
                            name="clock-circle"
                            size="md"
                            color="black"
                            style={{backgroundColor: 'white'}}
                          />
                          <Text
                            style={{
                              marginLeft: 8,
                              color: '#0099FF',
                              fontSize: 16,
                            }}>
                            {RStartTime
                              ? starttime.getHours() < 10 &&
                                starttime.getMinutes() >= 10
                                ? '0' +
                                  starttime.getHours() +
                                  ' : ' +
                                  starttime.getMinutes()
                                : starttime.getHours() >= 10 &&
                                  starttime.getMinutes() < 10
                                ? starttime.getHours() +
                                  ' : 0' +
                                  starttime.getMinutes()
                                : starttime.getHours() < 10 &&
                                  starttime.getMinutes() < 10
                                ? '0' +
                                  starttime.getHours() +
                                  ' : 0' +
                                  starttime.getMinutes()
                                : starttime.getHours() +
                                  ' : ' +
                                  starttime.getMinutes()
                              : 'Thời gian bắt đầu'}
                          </Text>
                        </Flex>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isTimeRepeatPickerVisible}
                        date={starttime}
                        mode="time"
                        is24Hour={true}
                        onDateChange={dt => {
                          setstarttime(dt);
                          console.log(dt);
                          seterr('');
                        }}
                        onConfirm={handleTimeRepeatConfirm}
                        onCancel={hideTimeRepeatPicker}
                      />
                    </View>
                  </Flex>
                </View>
              )}
            </View>
            <Flex justify="start">
              <Icon
                name="bell"
                size="md"
                color="black"
                style={{marginLeft: 5}}
              />

              <View>
                <Button
                  full
                  transparent
                  style={{marginLeft: 10}}
                  onPress={() => {
                    setshowReminder(!showReminder);
                  }}>
                  <Text style={{color: '#0099FF', fontSize: 16}}>
                    Nhắc nhở trước hạn
                  </Text>
                </Button>
              </View>
            </Flex>
            <View>
              {showReminder === true && (
                <Flex style={{marginTop: -10}}>
                  <TextInput
                    style={{
                      fontSize: 16,
                      fontFamily: '',
                      marginLeft: 25,
                      flex: 3,
                    }}
                    placeholder="Thời gian nhắc nhở trước hạn"
                    keyboardType="numeric"
                    defaultValue={reminder}
                    onChangeText={value => {
                      setreminder(parseInt(value, 10));
                      seterr('');
                    }}
                  />
                  <Text style={{fontSize: 17, color: '#0099FF', flex: 1}}>
                    ( Phút )
                  </Text>
                </Flex>
              )}
            </View>

            <Flex justify="start">
              <Icon
                name="calendar"
                size="md"
                color="black"
                style={{marginLeft: 5, backgroundColor: 'white'}}
              />

              <Flex.Item>
                <TouchableOpacity onPress={showDatePicker}>
                  <Text
                    style={{marginLeft: 10, color: '#0099FF', fontSize: 16}}>
                    {dueDateTime
                      ? dueDate.getDate() +
                        '/' +
                        (dueDate.getMonth() + 1) +
                        '/' +
                        dueDate.getFullYear()
                      : 'Hạn công việc'}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  date={dueDate}
                  mode="date"
                  onDateChange={dt => {
                    setDueDate(dt);
                    setdueDateTime(
                      `${dt.getFullYear()}-${dt.getMonth() +
                        1}-${dt.getDate()} ${time.getHours()}:${time.getMinutes()}:00 +07:00`,
                    );
                    console.log(dt);
                    seterr('');
                  }}
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </Flex.Item>
              <Flex.Item>
                <TouchableOpacity onPress={showTimePicker}>
                  <Flex>
                    <Icon
                      name="clock-circle"
                      size="md"
                      color="black"
                      style={{backgroundColor: 'white'}}
                    />
                    <Text
                      style={{marginLeft: 10, color: '#0099FF', fontSize: 16}}>
                      {dueDateTime
                        ? time.getHours() < 10 && time.getMinutes() >= 10
                          ? '0' + time.getHours() + ' : ' + time.getMinutes()
                          : time.getHours() >= 10 && time.getMinutes() < 10
                          ? time.getHours() + ' : 0' + time.getMinutes()
                          : time.getHours() < 10 && time.getMinutes() < 10
                          ? '0' + time.getHours() + ' : 0' + time.getMinutes()
                          : time.getHours() + ' : ' + time.getMinutes()
                        : 'Hạn thời gian'}
                    </Text>
                  </Flex>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  date={time}
                  mode="time"
                  is24Hour={true}
                  onDateChange={dt => {
                    setTime(dt);
                    setdueDateTime(
                      dueDate.getFullYear() +
                        '-' +
                        (dueDate.getMonth() + 1) +
                        '-' +
                        dueDate.getDate() +
                        ' ' +
                        dt.getHours() +
                        ':' +
                        dt.getMinutes() +
                        ':00 +07:00',
                    );
                    console.log(dt);
                    seterr('');
                  }}
                  onConfirm={handleTimeConfirm}
                  onCancel={hideTimePicker}
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
                  <Text style={{color: '#0099FF', fontSize: 16}}>
                    Ảnh minh họa
                  </Text>
                </Button>
              </View>
            </Flex>
          </Card>
          {loading === false && (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#0099FF" />
            </View>
          )}
          {loading === true && (
            <Card style={{margin: 5, marginTop: 0, marginBottom: 0}}>
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
            </Card>
          )}
          <Card
            style={{
              margin: 5,
              elevation: 5,
            }}>
            <InputItem
              clear
              type="number"
              placeholder="Nếu không hoàn thành"
              value={penalty ? penalty.toString() : penalty}
              style={{
                fontSize: 16,
                marginTop: 2,
                minWidth: 10,
                marginLeft: 30,
              }}
              onChangeText={value => {
                if (
                  Number.isNaN(parseInt(value, 10)) ||
                  parseInt(value, 10) < 0
                ) {
                  setpenalty(null);
                } else {
                  setpenalty(parseInt(value, 10));
                }
              }}>
              <View style={{width: 120}}>
                <Flex justify="start" align="center">
                  <View>
                    <Icon name="frown" color="red" style={{marginLeft: -9}} />
                  </View>
                  <Flex.Item>
                    <Text
                      style={{fontSize: 16, marginLeft: 5, color: '#0099FF'}}>
                      Điểm phạt:
                    </Text>
                  </Flex.Item>
                </Flex>
              </View>
            </InputItem>
          </Card>

          <Card style={{margin: 5, elevation: 5}}>
            <Label style={{color: '#0099FF', marginLeft: 5}}>Ghi chú:</Label>
            <TextareaItem
              rows={4}
              style={{
                borderStyle: 'solid',
                borderColor: '#0099FF',
                borderWidth: 1,
                margin: 5,
              }}
              placeholder="Viết ghi chú vào đây"
              defaultValue={note}
              onChangeText={value => {
                setNote(value);
                seterr('');
              }}
              count={150}
            />
          </Card>
          {err !== '' && (
            <Text style={{color: 'red', fontSize: 17, margin: 10}}>{err}</Text>
          )}
          <Button
            full
            default
            style={{margin: 5, backgroundColor: '#0099FF', elevation: 5}}
            onPress={() => {
              console.log(RStartTime);
              handleAddTask();
            }}>
            <Text style={{color: 'white', fontSize: 20}}>
              Thêm mới công việc
            </Text>
          </Button>
        </WingBlank>
      </ScrollView>
    </View>
  );
}
