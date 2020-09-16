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
  InputItem,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function TaskDetails({route, navigation}) {
  const {name} = route.params;
  const {time} = route.params;
  const {point} = route.params;
  const {note} = route.params;
  const {img} = route.params;
  const {id} = route.params;
  const {assign} = route.params;
  const {category} = route.params;
  const {token} = route.params;
  const {socket} = route.params;
  const {isAdmin} = route.params;
  const {duedate} = route.params;
  const {penalty} = route.params;
  const {repeat} = route.params;
  const {reminder} = route.params;
  // console.log('repeat: ' + repeat.type);

  const [image, setImage] = useState({
    uri: img,
  });
  const [loading, setLoading] = useState(null);
  const [Tname, setTName] = useState(name);
  const [select, setSelect] = useState(time);
  const [selectpts, setSelectpts] = useState(point);
  const [_note, setNote] = useState(note);
  const [_penalty, set_penalty] = useState(penalty);
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
  const [date, setdate] = useState(duedate ? new Date(duedate) : new Date());
  const [duetime, setduetime] = useState(
    duedate ? new Date(duedate) : new Date(),
  );
  const [dueDateTime, setdueDateTime] = useState(null);
  const [show, setShow] = useState(false);
  const [startdate, setstartdate] = useState(new Date());
  const [starttime, setstarttime] = useState(new Date());
  const [RStartTime, setRStartTime] = useState(null);

  const [showRepeat, setshowRepeat] = useState(repeat ? true : false);
  const [_repeat, setrepeat] = useState(repeat ? repeat.type : null);

  const [showReminder, setshowReminder] = useState(reminder ? true : false);
  const [_reminder, setreminder] = useState(reminder ? reminder : null);
  useEffect(() => {
    if (_reminder !== null) {
      setshowReminder(true);
    }
    if (_repeat !== null) {
      setshowRepeat(true);
    }
  });
  useEffect(() => {
    if (showRepeat === false) {
      setrepeat(null);
    }
    if (showReminder === false) {
      setreminder(null);
    }
  });

  // const showTimepicker = () => {
  //   setShow(true);
  //   console.log(show);
  // };
  //Đoạn code mới
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDateRepeatPickerVisible, setDateRepeatPickerVisibility] = useState(
    false,
  );
  const [isTimeRepeatPickerVisible, setTimeRepeatPickerVisibility] = useState(
    false,
  );

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
    setduetime(dt);
    setdueDateTime(
      `${date.getFullYear()}-${date.getMonth() +
        1}-${date.getDate()} ${dt.getHours()}:${dt.getMinutes()}:00 +07:00`,
    );
  };

  const handleConfirm = dt => {
    hideDatePicker();
    setdate(dt);
    setdueDateTime(
      dt.getFullYear() +
        '-' +
        (dt.getMonth() + 1) +
        '-' +
        dt.getDate() +
        ' ' +
        duetime.getHours() +
        ':' +
        duetime.getMinutes() +
        ':00 +07:00',
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

    setNoti('');
  };

  const handleRepeatConfirm = dt => {
    hideDateRepeatPicker();
    setstartdate(dt);
    setRStartTime(
      `${dt.getFullYear()}-${dt.getMonth() +
        1}-${dt.getDate()} ${starttime.getHours()}:${starttime.getMinutes()}:00 +07:00`,
    );
    setNoti('');
  };
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
  //
  // console.log('penalty: ' + route.params.penalty);
  //console.log(duetime);

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
      penalty: _penalty,
      dueDate: dueDateTime,
      tcID: keyCat,
      time: select,
      points: selectpts,
      reminder: _reminder,
      repeat: _repeat
        ? {
            type: _repeat,
            start: RStartTime,
          }
        : null,
    };
    console.log(data);
    RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/edit-task',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t = res.json();
      console.log(t);
      if (t.code === 2020) {
        route.params.getlist();
        navigation.goBack();
        // route.params.getlist();
      } else {
        setNoti(t.message);
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
  useEffect(() => {
    if (!duetime) {
      if (duedate) {
        setduetime(new Date(duedate));
      } else {
        setduetime(new Date());
      }
    }
  });
  useEffect(() => {
    if (duedate) {
      const t = duedate.substring(0, duedate.length - 5);
      setdate(new Date(duedate));
      setduetime(new Date(duedate));
      //console.log("t" + t);
      // const t = new Date(duedate);
      setdueDateTime(
        date.getFullYear() +
          '-' +
          (date.getMonth() + 1) +
          '-' +
          date.getDate() +
          ' ' +
          duetime.getHours() +
          ':' +
          duetime.getMinutes() +
          ':00 +07:00',
      );
    }
    if (repeat) {
      setstartdate(new Date(repeat.start));
      setstarttime(new Date(repeat.start));
      setRStartTime(
        startdate.getFullYear() +
          '-' +
          (startdate.getMonth() + 1) +
          '-' +
          startdate.getDate() +
          ' ' +
          starttime.getHours() +
          ':' +
          starttime.getMinutes() +
          ':00 +07:00',
      );
    }
  }, []);
  useEffect(() => {
    if (starttime && startdate) {
      setRStartTime(
        startdate.getFullYear() +
          '-' +
          (startdate.getMonth() + 1) +
          '-' +
          startdate.getDate() +
          ' ' +
          starttime.getHours() +
          ':' +
          starttime.getMinutes() +
          ':00 +07:00',
      );
    }
  }, [starttime, startdate]);
  console.log(dueDateTime);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{paddingTop: 10, backgroundColor: 'white'}}>
        <WingBlank size="sm">
          <Card style={{padding: 10, elevation: 5}}>
            <Flex justify="center">
              <TextInput
                required
                style={{fontSize: 20, fontFamily: ''}}
                placeholder="Tên công việc"
                defaultValue={Tname}
                onChangeText={value => {
                  setTName(value);
                  setNoti('');
                }}
                editable={isAdmin}
              />
            </Flex>
          </Card>
          <WhiteSpace />

          <Flex justify="between">
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
                <Flex.Item>
                  <Picker
                    mode="dropdown"
                    style={{
                      color: 'white',
                      backgroundColor: '#bdc3c7',
                      minWidth: 135,
                    }}
                    enabled={isAdmin}
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
                </Flex.Item>
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
                <Flex.Item>
                  <Picker
                    note
                    mode="dropdown"
                    style={{
                      color: 'white',
                      backgroundColor: '#bdc3c7',
                      minWidth: 135,
                    }}
                    enabled={isAdmin}
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
                </Flex.Item>
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
                      disabled={!isAdmin}
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
                        if (isAdmin) {
                          handleCheckMember(item._id);
                          setNoti('');
                        }
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
                        if (isAdmin) {
                          handleCheckCat(item._id, item.image, item.name);
                          setNoti('');
                        }
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
                {isAdmin && (
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
                )}
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
                    if (isAdmin) {
                      setshowRepeat(!showRepeat);
                    }
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
                        _repeat === 'daily'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        if (isAdmin) {
                          setrepeat('daily');
                        }
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
                        _repeat === 'weekly'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        if (isAdmin) {
                          setrepeat('weekly');
                        }
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
                        _repeat === 'monthly'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        if (isAdmin) {
                          setrepeat('monthly');
                        }
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
                          //seterr('');
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
                              marginLeft: 10,
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
                          //seterr('');
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
                    if (isAdmin) {
                      setshowReminder(!showReminder);
                    }
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
                    defaultValue={
                      _reminder // if 1
                        ? !isNaN(_reminder.toString()) // if 2
                          ? _reminder.toString()
                          : null // else 2
                        : '' // else 1
                    }
                    style={{
                      fontSize: 16,
                      fontFamily: '',
                      marginLeft: 25,
                      flex: 3,
                      justifyContent: 'center',
                    }}
                    placeholder={'Thời gian nhắc nhở trước hạn'}
                    keyboardType="numeric"
                    onChangeText={value => {
                      setreminder(parseInt(value, 10));
                      // seterr('');
                    }}
                    editable={isAdmin}
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
                    {dueDateTime !== null
                      ? date.getDate() +
                        '/' +
                        (date.getMonth() + 1) +
                        '/' +
                        date.getFullYear()
                      : 'Hạn công việc'}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  date={date}
                  mode="date"
                  onDateChange={dt => {
                    setdate(dt);
                    setNoti('');
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
                        ? duetime.getHours() < 10 && duetime.getMinutes() >= 10
                          ? '0' +
                            duetime.getHours() +
                            ' : ' +
                            duetime.getMinutes()
                          : duetime.getHours() >= 10 &&
                            duetime.getMinutes() < 10
                          ? duetime.getHours() + ' : 0' + duetime.getMinutes()
                          : duetime.getHours() < 10 && duetime.getMinutes() < 10
                          ? '0' +
                            duetime.getHours() +
                            ' : 0' +
                            duetime.getMinutes()
                          : duetime.getHours() + ' : ' + duetime.getMinutes()
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
                    setduetime(dt);
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
                  onPress={() => {
                    if (isAdmin) {
                      pickImageHandler();
                    }
                  }}>
                  <Text style={{color: '#0099FF', fontSize: 16}}>
                    Ảnh minh họa
                  </Text>
                </Button>
              </View>
              <Flex.Item />
            </Flex>
          </Card>
          {loading === false && (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#0099FF" />
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
          <Card
            style={{
              margin: 5,
              elevation: 5,
            }}>
            <InputItem
              clear
              type="number"
              placeholder="Nếu không hoàn thành"
              style={{
                fontSize: 16,
                marginTop: 2,
                minWidth: 10,
                marginLeft: 50,
                backgroundColor: 'white',
              }}
              disabled={!isAdmin}
              value={_penalty ? _penalty.toString() : _penalty}
              onChangeText={value => {
                if (
                  Number.isNaN(parseInt(value, 10)) ||
                  parseInt(value, 10) < 0
                ) {
                  set_penalty(null);
                } else {
                  set_penalty(parseInt(value, 10));
                }
              }}>
              <View style={{width: 120}}>
                <Flex justify="start" align="center">
                  <View>
                    <Icon name="frown" color="red" style={{}} />
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
              editable={isAdmin}
              rows={4}
              style={{
                borderStyle: 'solid',
                borderColor: '#0099FF',
                borderWidth: 1,
                margin: 5,
              }}
              placeholder="Viết ghi chú vào đây"
              defaultValue={_note}
              onChangeText={value => {
                setNote(value);
                setNoti('');
              }}
              count={150}
            />
          </Card>

          {noti === 'Update Task Successfully!' && (
            <Flex justify="center" style={{margin: 5, padding: 5}}>
              <Text style={{color: '#0099FF', height: 20, fontSize: 16}}>
                Cập nhật thành công!!!
              </Text>
            </Flex>
          )}
          {noti !== '' && (
            <Text style={{color: 'red', fontSize: 17, margin: 10}}>{noti}</Text>
          )}
          {isAdmin === true && (
            <Flex style={{marginTop: 10}}>
              <Flex.Item>
                <Button full danger style={{margin: 5}}>
                  <Text style={{color: 'white', fontSize: 20}}>Xóa</Text>
                </Button>
              </Flex.Item>
              <Flex.Item>
                <Button
                  full
                  defailt
                  style={{margin: 5, backgroundColor: '#0099FF'}}
                  onPress={() => {
                    console.log(RStartTime);
                    handleEditTask();
                  }}>
                  <Text style={{color: 'white', fontSize: 20}}>
                    Lưu thay đổi
                  </Text>
                </Button>
              </Flex.Item>
            </Flex>
          )}
        </WingBlank>
      </ScrollView>
    </View>
  );
}
