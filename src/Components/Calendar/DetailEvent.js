/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Switch,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Flex,
  Card,
  WingBlank,
  Icon,
  Button,
  Picker,
  Provider,
  TextareaItem,
  List,
  Radio,
  InputItem,
} from '@ant-design/react-native';
import {Calendar} from 'react-native-calendars';
import {LocaleConfig} from 'react-native-calendars';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';

export default function DetailEvent({navigation, route}) {
  const {data} = route.params;
  const {token} = route.params;
  const [name, setname] = useState(data.name); // tên sự kiện
  const [err, seterr] = useState('');
  const [note, setNote] = useState(data.notes);
  const start = new Date(data.dateTime.start);
  const end = new Date(data.dateTime.end);
  const endLoop = data.repeat ? new Date(data.repeat.end) : null;
  // hạn thời gian bắt đầu và kết thúc
  // console.log(data);
  // Ngày
  const [showBeginCalendar, setshowBeginCalendar] = useState(false);
  const [beginDate, setbeginDate] = useState(
    start.getDate() < 10 && start.getMonth() + 1 < 10
      ? start.getFullYear() +
          '-0' +
          (start.getMonth() + 1) +
          '-0' +
          start.getDate()
      : start.getDate() < 10 && start.getMonth() + 1 >= 10
      ? start.getFullYear() +
        '-' +
        (start.getMonth() + 1) +
        '-0' +
        start.getDate()
      : start.getDate() >= 10 && start.getMonth() + 1 < 10
      ? start.getFullYear() +
        '-0' +
        (start.getMonth() + 1) +
        '-' +
        start.getDate()
      : start.getFullYear() +
        '-' +
        (start.getMonth() + 1) +
        '-' +
        start.getDate(),
  );
  const [showEndCalendar, setshowEndCalendar] = useState(false);
  const [endDate, setendDate] = useState(
    end.getDate() < 10 && end.getMonth() + 1 < 10
      ? end.getFullYear() + '-0' + (end.getMonth() + 1) + '-0' + end.getDate()
      : end.getDate() < 10 && end.getMonth() + 1 >= 10
      ? end.getFullYear() + '-' + (end.getMonth() + 1) + '-0' + end.getDate()
      : end.getDate() >= 10 && end.getMonth() + 1 < 10
      ? end.getFullYear() + '-0' + (end.getMonth() + 1) + '-' + end.getDate()
      : end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate(),
  );
  // Giờ
  const [showTimePicker1, setshowTimePicker1] = useState(false);
  const [time1, settime1] = useState(start);
  const [beginTime, setbeginTime] = useState(
    start.getHours() < 10 && start.getMinutes() < 10
      ? '0' + start.getHours() + ':0' + start.getMinutes()
      : start.getHours() < 10 && start.getMinutes() >= 10
      ? '0' + start.getHours() + ':' + start.getMinutes()
      : start.getHours() >= 10 && start.getMinutes() < 10
      ? start.getHours() + ':0' + start.getMinutes()
      : start.getHours() + ':' + start.getMinutes(),
  );
  const [showTimePicker2, setshowTimePicker2] = useState(false);
  const [time2, settime2] = useState(end);
  const [endTime, setendTime] = useState(
    end.getHours() < 10 && end.getMinutes() < 10
      ? '0' + end.getHours() + ':0' + end.getMinutes()
      : end.getHours() < 10 && end.getMinutes() >= 10
      ? '0' + end.getHours() + ':' + end.getMinutes()
      : end.getHours() >= 10 && end.getMinutes() < 10
      ? end.getHours() + ':0' + end.getMinutes()
      : end.getHours() + ':' + end.getMinutes(),
  );
  // console.log(data.dateTime.start.split('T')[1].split(':00.00')[0]);
  // nhắc nhở
  const [reminder, setreminder] = useState(data.reminder);
  const [errReminder, seterrReminder] = useState('');
  // lặp
  const [showRepeat, setshowRepeat] = useState(data.repeat ? true : false);
  const [repeat, setrepeat] = useState(data.repeat ? data.repeat.type : 'day');
  const [showEndLoopCalendar, setshowEndLoopCalendar] = useState(false);
  const [endloopDate, setendloopDate] = useState(
    endLoop
      ? endLoop.getDate() < 10 && endLoop.getMonth() + 1 < 10
        ? endLoop.getFullYear() +
          '-0' +
          (endLoop.getMonth() + 1) +
          '-0' +
          endLoop.getDate()
        : endLoop.getDate() < 10 && endLoop.getMonth() + 1 >= 10
        ? endLoop.getFullYear() +
          '-' +
          (endLoop.getMonth() + 1) +
          '-0' +
          endLoop.getDate()
        : endLoop.getDate() >= 10 && endLoop.getMonth() + 1 < 10
        ? endLoop.getFullYear() +
          '-0' +
          (endLoop.getMonth() + 1) +
          '-' +
          endLoop.getDate()
        : endLoop.getFullYear() +
          '-' +
          (endLoop.getMonth() + 1) +
          '-' +
          endLoop.getDate()
      : null,
  );
  const [showTimePicker3, setshowTimePicker3] = useState(false);
  const [time3, settime3] = useState(new Date());
  const [endloopTime, setendloopTime] = useState(
    endLoop
      ? endLoop.getHours() < 10 && endLoop.getMinutes() < 10
        ? '0' + endLoop.getHours() + ':0' + endLoop.getMinutes()
        : endLoop.getHours() < 10 && endLoop.getMinutes() >= 10
        ? '0' + endLoop.getHours() + ':' + endLoop.getMinutes()
        : endLoop.getHours() >= 10 && endLoop.getMinutes() < 10
        ? endLoop.getHours() + ':0' + endLoop.getMinutes()
        : endLoop.getHours() + ':' + endLoop.getMinutes()
      : null,
  );
  const [times, settimes] = useState(
    data.repeat && data.repeat.times ? data.repeat.times : null,
  );
  const [typeEnd, settypeEnd] = useState(
    data.repeat && data.repeat.times ? 1 : 0,
  );
  // Không chọn thời gian (thời gian cả ngày)
  const [isAllDay, setIsAllDay] = useState(
    beginTime === '00:00' && endTime === '23:59' ? true : false,
  );
  // Tất cả thành viên tham gia vào sự kiện và nhận nhắc nhở
  const [isAll, setisAll] = useState(false);
  // Hàm chuyển state của 2 state trên
  const toggleSwitch = () => {
    setIsAllDay(previousState => !previousState);
    setbeginTime(
      start.getHours() < 10 && start.getMinutes() < 10
        ? '0' + start.getHours() + ':0' + start.getMinutes()
        : start.getHours() < 10 && start.getMinutes() >= 10
        ? '0' + start.getHours() + ':' + start.getMinutes()
        : start.getHours() >= 10 && start.getMinutes() < 10
        ? start.getHours() + ':0' + start.getMinutes()
        : start.getHours() + ':' + start.getMinutes(),
    );
    setendTime(
      end.getHours() < 10 && end.getMinutes() < 10
        ? '0' + end.getHours() + ':0' + end.getMinutes()
        : end.getHours() < 10 && end.getMinutes() >= 10
        ? '0' + end.getHours() + ':' + end.getMinutes()
        : end.getHours() >= 10 && end.getMinutes() < 10
        ? end.getHours() + ':0' + end.getMinutes()
        : end.getHours() + ':' + end.getMinutes(),
    );
  };
  const toggleSwitch1 = () => {
    setisAll(previousState => !previousState);
  };
  // Danh sách member
  const [listMember, setlistMember] = useState(null);
  // Danh sách member được chọn
  const [keyMember, setkeyMember] = useState([]);
  // Ảnh mô tả
  const [imageF, setImageF] = useState({
    uri: data.photo,
  });
  const [loading, setLoading] = useState(null); // loading ảnh

  const [chooseRM, setchooseRM] = useState(1);
  const [chooseRY, setchooseRY] = useState(1);
  const week = [0, 1, 2, 3, 4, 5, 6];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const month = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
  ];
  const weekTime = [1, 2, 3, 4, 5, 0];
  const [keyDateOfWeek, setkeyDateOfWeek] = useState([]);
  const [keyDateOfMonth, setkeyDateOfMonth] = useState(null);
  const [keyDateOfMonthYear, setkeyDateOfMonthYear] = useState(null);
  const [keyMonthOfYear, setkeyMonthOfYear] = useState(null);
  const [keyDateOfWeekM, setkeyDateOfWeekM] = useState(null);
  const [keyDateOfWeekY, setkeyDateOfWeekY] = useState(1);
  const [keyWeekTime, setkeyWeekTime] = useState(null);
  const [keyWeekTimeY, setkeyWeekTimeY] = useState(1);

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
  //console.log(new Date(beginDate + '00:00+07:00'));
  LocaleConfig.locales.vn = {
    monthNames: [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ],
    monthNamesShort: [
      'Th1.',
      'Th2.',
      'Th3.',
      'Th4.',
      'Th5.',
      'Th6.',
      'Th7.',
      'Th8.',
      'Th9.',
      'Th10.',
      'Th11.',
      'Th12.',
    ],
    dayNames: [
      'Chủ Nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ],
    dayNamesShort: ['CN.', 'T2.', 'T3.', 'T4.', 'T5.', 'T6.', 'T7.'],
    today: 'Hôm nay',
  };
  LocaleConfig.defaultLocale = 'vn';
  if (beginDate > endDate) {
    setendDate(null);
  }
  useEffect(() => {
    if (isAllDay === true) {
      setendTime('23:59');
      setbeginTime('00:00');
    }
  }, [isAllDay]);
  useEffect(() => {
    if (isAll === true) {
      const t = [];
      listMember.map(item => {
        t.push(item._id);
      });
      setkeyMember(t);
    }
  }, [isAll]);

  const HandleEditEvent = () => {
    const dt = {
      _id: data._id,
      name: name,
      assign: keyMember,
      photo: imageF.uri,
      notes: note,
      reminder: reminder !== null && reminder !== -1 ? reminder : null,
      repeat:
        repeat && showRepeat === true
          ? repeat === 'week'
            ? {
                type: repeat,
                day: keyDateOfWeek,
                times: typeEnd === 1 ? times : null,
                end:
                  typeEnd === 0
                    ? endloopDate + ' ' + endloopTime + '+07:00'
                    : null,
              }
            : repeat === 'month'
            ? chooseRM === 1
              ? {
                  type: repeat,
                  date: keyDateOfMonth,
                  times: typeEnd === 1 ? times : null,
                  end:
                    typeEnd === 0
                      ? endloopDate + ' ' + endloopTime + '+07:00'
                      : null,
                }
              : chooseRM === 2
              ? {
                  type: repeat,
                  day: [keyDateOfWeekM],
                  order: keyWeekTime,
                  times: typeEnd === 1 ? times : null,
                  end:
                    typeEnd === 0
                      ? endloopDate + ' ' + endloopTime + '+07:00'
                      : null,
                }
              : {
                  type: repeat,
                  date: 0,
                  times: typeEnd === 1 ? times : null,
                  end:
                    typeEnd === 0
                      ? endloopDate + ' ' + endloopTime + '+07:00'
                      : null,
                }
            : {
                type: repeat,
                times: typeEnd === 1 ? times : null,
                end:
                  typeEnd === 0
                    ? endloopDate + ' ' + endloopTime + '+07:00'
                    : null,
              }
          : null,
      dateTime: {
        start: beginDate + ' ' + beginTime + '+07:00',
        end: endDate + ' ' + endTime + '+07:00',
      },
    };
    console.log(dt);
    RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/edit-event',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(dt),
    ).then(res => {
      const t = res.json();
      console.log(t);
      if (t.code === 2020) {
        route.params.navigator.navigate('CalendarMain');
        route.params.getListDate();
      } else {
        seterr(t.message);
      }
    });
  };
  const handleCheckMember = index => {
    const i = keyMember.indexOf(index);
    if (i !== -1) {
      const t = keyMember;
      t.splice(i, 1);
      setkeyMember([...t]);
      if (keyMember.length < listMember.length) {
        setisAll(false);
      }
    } else {
      setkeyMember([...keyMember, index]);
      //console.log("key: " + keyMember.length);
      //console.log("list: " + listMember.length);
      if (keyMember.length + 1 === listMember.length) {
        //console.log("key: " + keyMember.length);
        //console.log("list: " + listMember.length);
        setisAll(true);
      }
    }
  };
  const handleCheckDate = index => {
    const i = keyDateOfWeek.indexOf(index);
    if (i !== -1) {
      const t = keyDateOfWeek;
      t.splice(i, 1);
      setkeyDateOfWeek([...t]);
    } else {
      setkeyDateOfWeek([...keyDateOfWeek, index]);
      //console.log("key: " + keyMember.length);
      //console.log("list: " + listMember.length);
    }
  };
  // lặp tháng tùy chọn 1
  const handleCheckDateOfMonth = index => {
    setkeyDateOfMonth(index);
  };
  // lặp tháng tùy chọn 2
  const handleCheckDateM = index => {
    setkeyDateOfWeekM(index);
  };
  const handleCheckWeekTime = index => {
    setkeyWeekTime(index);
  };
  const handleCheckDateY = index => {
    setkeyDateOfWeekY(index);
  };
  const handleCheckWeekTimeY = index => {
    setkeyWeekTimeY(index);
  };
  // lặp năm 1
  const handleCheckDateOfMonthYear = index => {
    if (
      index === 31 &&
      (keyMonthOfYear === 4 ||
        keyMonthOfYear === 6 ||
        keyMonthOfYear === 9 ||
        keyMonthOfYear === 11)
    ) {
      setkeyDateOfMonthYear(30);
    } else if (index > 29 && keyMonthOfYear === 2) {
      setkeyDateOfMonthYear(29);
    } else {
      setkeyDateOfMonthYear(index);
    }
  };
  const handleCheckMonthOfYear = index => {
    if (
      keyDateOfMonthYear === 31 &&
      (index === 4 || index === 6 || index === 9 || index === 11)
    ) {
      setkeyDateOfMonthYear(30);
    } else if (keyDateOfMonthYear > 29 && index === 2) {
      setkeyDateOfMonthYear(29);
    }
    setkeyMonthOfYear(index);
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
          let dt = await response.json();
          setImageF({
            uri: dt.url,
          });
          setLoading(true);
          console.log(dt.url);
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
  // console.log(data);
  useEffect(() => {
    getlistMember();
    if (data.assign !== null) {
      const t = [];
      data.assign.map(item => {
        t.push(item._id);
      });
      setkeyMember(t);
    }
    if (data.repeat && data.repeat.type === 'week') {
      const t = [];
      data.repeat.day.map(item => {
        t.push(item);
      });
      setkeyDateOfWeek(t);
    } else if (data.repeat && data.repeat.type === 'month') {
      if (data.repeat.date || data.repeat.date === 0) {
        if (data.repeat.date === 0) {
          setchooseRM(3);
        } else {
          setchooseRM(1);
          setkeyDateOfMonth(data.repeat.date);
        }
      } else {
        setchooseRM(2);
        setkeyDateOfWeekM(data.repeat.day[0]);
        setkeyWeekTime(data.repeat.order);
      }
    } else if (data.repeat && data.repeat.type === 'year') {
      if (data.repeat.day && data.repeat.order) {
        setchooseRY(2);
        setkeyDateOfWeekY(data.repeat.day[0]);
        setkeyWeekTimeY(data.repeat.order);
        setkeyMonthOfYear(data.repeat.month + 1);
      }
      if (data.repeat.date) {
        setchooseRY(1);
        setkeyDateOfMonthYear(data.repeat.date);
        setkeyMonthOfYear(data.repeat.month + 1);
      }
    }
  }, []);
  //console.log(data);
  useEffect(() => {
    if (listMember && keyMember.length === listMember.length) {
      //console.log("key: " + keyMember.length);
      //console.log("list: " + listMember.length);
      setisAll(true);
    }
  }, [listMember]);
  // console.log(keyDateOfWeek);
  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView style={{paddingTop: 10, margin: 2}}>
          <WingBlank size="sm">
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
                      marginBottom: 10,
                    }}
                    source={{
                      uri: imageF.uri,
                    }}
                  />
                </TouchableOpacity>
              )}
            </Flex>
            <Card style={{padding: 10, elevation: 5}}>
              <Flex justify="center">
                <TextInput
                  style={{
                    fontSize: 20,
                  }}
                  placeholder="Tên sự kiện"
                  defaultValue={name}
                  onChangeText={value => {
                    setname(value);
                    seterr('');
                  }}
                />
              </Flex>
            </Card>
            <Card style={{padding: 10, marginTop: 5, elevation: 5}}>
              <View style={{flex: 10}}>
                <Flex justify="end">
                  <Text
                    style={{
                      color: '#0099FF',
                      fontSize: 17,
                      fontWeight: '200',
                      marginLeft: 5,
                    }}>
                    Cả ngày
                  </Text>
                  <Switch
                    style={{marginTop: 4}}
                    trackColor={{false: '#767577', true: '#34ace0'}}
                    thumbColor={isAllDay ? '#0099FF' : '#0099FF'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAllDay}
                  />
                </Flex>
              </View>
              <Flex justify="start" style={{marginTop: 10, padding: 5}}>
                <View style={{flex: 4}}>
                  <Flex>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: '',
                        color: '#0099FF',
                      }}>
                      Ngày bắt đầu:{' '}
                    </Text>
                    <Image
                      style={{
                        backgroundColor: 'orange',
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        marginTop: 4,
                      }}
                    />
                  </Flex>
                </View>
                <View style={{flex: 7, justifyContent: 'flex-end'}}>
                  <Flex>
                    <TouchableOpacity
                      onPress={() => {
                        setshowBeginCalendar(!showBeginCalendar);
                        setshowEndCalendar(false);
                      }}>
                      <Text
                        style={{fontSize: 15, fontFamily: '', color: 'gray'}}>
                        {beginDate
                          ? new Date(beginDate).getDate() >= 10 &&
                            new Date(beginDate).getMonth() + 1 >= 10
                            ? new Date(beginDate).getDate() +
                              ' / ' +
                              (new Date(beginDate).getMonth() + 1) +
                              ' / ' +
                              new Date(beginDate).getFullYear()
                            : new Date(beginDate).getDate() < 10 &&
                              new Date(beginDate).getMonth() + 1 >= 10
                            ? '0' +
                              new Date(beginDate).getDate() +
                              ' / ' +
                              (new Date(beginDate).getMonth() + 1) +
                              ' / ' +
                              new Date(beginDate).getFullYear()
                            : new Date(beginDate).getDate() >= 10 &&
                              new Date(beginDate).getMonth() + 1 < 10
                            ? new Date(beginDate).getDate() +
                              ' / 0' +
                              (new Date(beginDate).getMonth() + 1) +
                              ' / ' +
                              new Date(beginDate).getFullYear()
                            : '0' +
                              new Date(beginDate).getDate() +
                              ' / 0' +
                              (new Date(beginDate).getMonth() + 1) +
                              ' / ' +
                              new Date(beginDate).getFullYear()
                          : '(Ngày bắt đầu)'}
                      </Text>
                    </TouchableOpacity>
                    {!isAllDay && (
                      <TouchableOpacity
                        onPress={() => {
                          setshowTimePicker1(!showTimePicker1);
                        }}>
                        <Text
                          style={{fontSize: 15, fontFamily: '', color: 'gray'}}>
                          {'  '}
                          {beginTime || '(Giờ bắt đầu)'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Flex>
                </View>
              </Flex>
              <View>
                {showTimePicker1 && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={7}
                    value={time1}
                    mode={'time'}
                    is24Hour={true}
                    onChange={async (e, date) => {
                      setshowTimePicker1(false);
                      if (date) {
                        await settime1(date);
                        setbeginTime(
                          date.getHours() < 10 && date.getMinutes() >= 10
                            ? '0' + date.getHours() + ':' + date.getMinutes()
                            : date.getHours() >= 10 && date.getMinutes() < 10
                            ? date.getHours() + ':0' + date.getMinutes()
                            : date.getHours() < 10 && date.getMinutes() < 10
                            ? '0' + date.getHours() + ':0' + date.getMinutes()
                            : date.getHours() + ':' + date.getMinutes(),
                        );
                      }

                      seterr('');
                      // console.log(date);
                    }}
                  />
                )}
                {showBeginCalendar && (
                  <Calendar
                    markedDates={{
                      [beginDate]: {selected: true, selectedColor: 'orange'},
                    }}
                    onDayPress={day => {
                      console.log('selected day', day);
                      setbeginDate(day.dateString);
                      //setshowBeginCalendar(!setshowBeginCalendar);
                    }}
                    onMonthChange={month => {
                      console.log('month changed', month);
                    }}
                    firstDay={1}
                    onPressArrowLeft={substractMonth => substractMonth()}
                    onPressArrowRight={addMonth => addMonth()}
                  />
                )}
              </View>
              <Flex
                justify="start"
                style={{marginTop: 10, marginBottom: 10, padding: 5}}>
                <View style={{flex: 4}}>
                  <Flex>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: '',
                        color: '#0099FF',
                      }}>
                      Ngày kết thúc:{' '}
                    </Text>
                    <Image
                      style={{
                        backgroundColor: '#0099FF',
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        marginTop: 4,
                      }}
                    />
                  </Flex>
                </View>

                <View style={{flex: 7, justifyContent: 'flex-end'}}>
                  <Flex>
                    <TouchableOpacity
                      onPress={() => {
                        setshowEndCalendar(!showEndCalendar);
                        setshowBeginCalendar(false);
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontFamily: '',
                          color: 'gray',
                          marginLeft: 5,
                        }}>
                        {endDate
                          ? new Date(endDate).getDate() >= 10 &&
                            new Date(endDate).getMonth() + 1 >= 10
                            ? new Date(endDate).getDate() +
                              ' / ' +
                              (new Date(endDate).getMonth() + 1) +
                              ' / ' +
                              new Date(endDate).getFullYear()
                            : new Date(endDate).getDate() < 10 &&
                              new Date(endDate).getMonth() + 1 >= 10
                            ? '0' +
                              new Date(endDate).getDate() +
                              ' / ' +
                              (new Date(endDate).getMonth() + 1) +
                              ' / ' +
                              new Date(endDate).getFullYear()
                            : new Date(endDate).getDate() >= 10 &&
                              new Date(endDate).getMonth() + 1 < 10
                            ? new Date(endDate).getDate() +
                              ' / 0' +
                              (new Date(endDate).getMonth() + 1) +
                              ' / ' +
                              new Date(endDate).getFullYear()
                            : '0' +
                              new Date(endDate).getDate() +
                              ' / 0' +
                              (new Date(endDate).getMonth() + 1) +
                              ' / ' +
                              new Date(endDate).getFullYear()
                          : '(Ngày kết thúc)'}
                      </Text>
                    </TouchableOpacity>
                    {!isAllDay && (
                      <TouchableOpacity
                        onPress={() => {
                          setshowTimePicker2(!showTimePicker2);
                        }}>
                        <Text
                          style={{fontSize: 15, fontFamily: '', color: 'gray'}}>
                          {'  '}
                          {endTime || '(Giờ kết thúc)'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </Flex>
                </View>
              </Flex>
              <View>
                {showTimePicker2 && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={7}
                    value={time2}
                    mode={'time'}
                    is24Hour={true}
                    onChange={async (e, date) => {
                      setshowTimePicker2(false);
                      if (date) {
                        await settime2(date);
                        setendTime(
                          date.getHours() < 10 && date.getMinutes() >= 10
                            ? '0' + date.getHours() + ':' + date.getMinutes()
                            : date.getHours() >= 10 && date.getMinutes() < 10
                            ? date.getHours() + ':0' + date.getMinutes()
                            : date.getHours() < 10 && date.getMinutes() < 10
                            ? '0' + date.getHours() + ':0' + date.getMinutes()
                            : date.getHours() + ':' + date.getMinutes(),
                        );
                      }

                      seterr('');
                    }}
                  />
                )}
                {showEndCalendar && (
                  <Calendar
                    markedDates={{
                      [beginDate]: {
                        selected: true,
                        selectedColor: 'orange',
                      },
                      [endDate]: {
                        selected: true,
                      },
                    }}
                    minDate={beginDate}
                    onDayPress={day => {
                      console.log('selected day', day);
                      setendDate(day.dateString);
                    }}
                    onMonthChange={month => {
                      console.log('month changed', month);
                    }}
                    firstDay={1}
                    onPressArrowLeft={substractMonth => substractMonth()}
                    onPressArrowRight={addMonth => addMonth()}
                  />
                )}
              </View>
            </Card>
            <Card style={{padding: 8, marginTop: 5, elevation: 5}}>
              <Flex>
                <Icon name="team" color="gray" />
                <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                  Tham gia:
                </Text>

                <View style={{flex: 10}}>
                  <Flex justify="end">
                    <Text
                      style={{color: '#0099FF', fontSize: 17, marginLeft: 5}}>
                      Tất cả thành viên
                    </Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#34ace0'}}
                      thumbColor={isAll ? '#0099FF' : '#0099FF'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch1}
                      value={isAll}
                    />
                  </Flex>
                </View>
              </Flex>
              {listMember === null ? (
                <View style={[styles.container, styles.horizontal]}>
                  <ActivityIndicator size="large" color="#0099FF" />
                </View>
              ) : (
                <Flex justify="start" style={{marginTop: 10}} wrap="wrap">
                  {listMember.map(item => (
                    <Flex direction="column" style={{margin: 6}}>
                      <TouchableOpacity
                        onPress={() => {
                          handleCheckMember(item._id);
                          seterr('');
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
            <Card style={{padding: 10, marginTop: 5, elevation: 5}}>
              <Flex justify="start" style={{marginTop: 10}}>
                <View style={{flex: 3}}>
                  <Flex>
                    <Icon name="bell" color="gray" />
                    <Text
                      style={{marginLeft: 5, fontSize: 16, color: '#0099FF'}}>
                      Nhắc nhở:
                    </Text>
                  </Flex>
                </View>
                <View style={{flex: 5.5}}>
                  <Picker
                    value={reminder}
                    onChange={value => {
                      setreminder(value[0]);
                    }}
                    onOk={value => {
                      setreminder(value[0]);
                    }}
                    okText="Xác nhận"
                    dismissText="Hủy"
                    data={[
                      {value: null, label: 'Không nhắc'},
                      {value: 5, label: 'Trước 5 phút'},
                      {value: 10, label: 'Trước 10 phút'},
                      {value: 15, label: 'Trước 15 phút'},
                      {value: 20, label: 'Trước 20 phút'},
                      {
                        value: -1,
                        label: 'Tùy chọn',
                      },
                    ]}
                    cols={1}
                    title="Nhắc nhở">
                    {reminder > 0 ? (
                      <Text
                        style={{marginLeft: 5, fontSize: 16, color: 'gray'}}>
                        Trước {reminder} phút
                      </Text>
                    ) : reminder === null ? (
                      <Text
                        style={{marginLeft: 5, fontSize: 16, color: 'gray'}}>
                        Không nhắc
                      </Text>
                    ) : (
                      <Flex>
                        <View
                          style={{
                            flex: 1,
                            borderBottomColor: '#0099FF',
                            borderBottomWidth: 1,
                          }}>
                          <TextInput
                            keyboardType="numeric"
                            style={{fontSize: 16, padding: 3}}
                            autoFocus
                            placeholder="( Số phút )"
                            onEndEditing={e => {
                              if (!isNaN(parseInt(e.nativeEvent.text, 10))) {
                                let t = parseInt(e.nativeEvent.text, 10);
                                if (t < 0) {
                                  t = t * -1;
                                }
                                seterrReminder('');
                                setreminder(t);
                              } else {
                                seterrReminder('Vui lòng nhập kí tự hợp lệ');
                              }

                              seterr('');
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            setreminder(null);
                            seterrReminder('');
                          }}>
                          <Icon name="close" color="red" size={18} />
                        </TouchableOpacity>
                      </Flex>
                    )}
                  </Picker>
                </View>
              </Flex>
              <Flex>
                {errReminder !== '' && (
                  <Text style={{color: 'red', fontSize: 17, margin: 10}}>
                    {errReminder}
                  </Text>
                )}
              </Flex>

              <Flex justify="start" style={{marginTop: 10}}>
                <Icon name="reload" color="gray" />
                <TouchableOpacity onPress={() => setshowRepeat(!showRepeat)}>
                  <Text style={{marginLeft: 5, fontSize: 16, color: '#0099FF'}}>
                    Lặp lại
                  </Text>
                </TouchableOpacity>
              </Flex>
              <View>
                {showRepeat === true && (
                  <View>
                    <Flex
                      justify="around"
                      style={{marginTop: 10, marginBottom: 10}}>
                      <TouchableOpacity
                        style={
                          repeat === 'day'
                            ? {borderColor: '#0099FF', borderWidth: 2}
                            : {
                                borderColor: 'gray',
                                borderWidth: 2,
                              }
                        }
                        onPress={() => {
                          setrepeat('day');
                          setkeyDateOfWeek([]);
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            padding: 5,
                          }}>
                          Hàng ngày
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          repeat === 'week'
                            ? {borderColor: '#0099FF', borderWidth: 2}
                            : {
                                borderColor: 'gray',
                                borderWidth: 2,
                              }
                        }
                        onPress={() => {
                          setrepeat('week');
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            padding: 5,
                          }}>
                          Hàng tuần
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          repeat === 'month'
                            ? {borderColor: '#0099FF', borderWidth: 2}
                            : {
                                borderColor: 'gray',
                                borderWidth: 2,
                              }
                        }
                        onPress={() => {
                          setrepeat('month');
                          setkeyDateOfWeek([]);
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            padding: 5,
                          }}>
                          Hàng tháng
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          repeat === 'year'
                            ? {borderColor: '#0099FF', borderWidth: 2}
                            : {
                                borderColor: 'gray',
                                borderWidth: 2,
                              }
                        }
                        onPress={() => {
                          setrepeat('year');
                          setkeyDateOfWeek([]);
                        }}>
                        <Text
                          style={{
                            fontSize: 13,
                            padding: 5,
                          }}>
                          Hàng năm
                        </Text>
                      </TouchableOpacity>
                    </Flex>
                    <View
                      style={{
                        borderBottomColor: 'gray',
                        borderBottomWidth: 1,
                        height: 1,
                      }}
                    />
                    {repeat === 'week' && (
                      <Flex justify="around" style={{marginTop: 10}}>
                        {week.map(item => (
                          <TouchableOpacity
                            onPress={() => handleCheckDate(item)}
                            style={
                              keyDateOfWeek.indexOf(item) !== -1
                                ? {
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: '#0099FF',
                                    borderWidth: 3,
                                    height: 40,
                                    width: 40,
                                    borderRadius: 30,
                                  }
                                : {
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                    height: 40,
                                    width: 40,
                                    borderRadius: 30,
                                  }
                            }>
                            <Text>{item !== 0 ? 'T' + (item + 1) : 'CN'}</Text>
                          </TouchableOpacity>
                        ))}
                      </Flex>
                    )}
                    {repeat === 'month' && (
                      <View>
                        <List
                          style={{
                            borderBottomColor: 'gray',
                            borderBottomWidth: 1,
                          }}>
                          <Radio.RadioItem
                            style={{
                              height: 30,
                            }}
                            checked={chooseRM === 1}
                            onChange={event => {
                              if (event.target.checked) {
                                setchooseRM(1);
                              }
                            }}>
                            <View
                              style={{
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text>Ngày trong tháng</Text>
                            </View>
                          </Radio.RadioItem>
                          <Radio.RadioItem
                            style={{height: 30}}
                            checked={chooseRM === 2}
                            onChange={event => {
                              if (event.target.checked) {
                                setchooseRM(2);
                              }
                            }}>
                            <View
                              style={{
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text>Thứ lần thứ n trong tháng</Text>
                            </View>
                          </Radio.RadioItem>
                          <Radio.RadioItem
                            style={{height: 30}}
                            checked={chooseRM === 3}
                            onChange={event => {
                              if (event.target.checked) {
                                setchooseRM(3);
                              }
                            }}>
                            <View
                              style={{
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text>Ngày cuối tháng</Text>
                            </View>
                          </Radio.RadioItem>
                        </List>
                        {chooseRM === 1 && (
                          <ScrollView
                            horizontal
                            style={{marginTop: 6, height: 50}}>
                            {month.map(item => (
                              <TouchableOpacity
                                onPress={() => handleCheckDateOfMonth(item)}
                                style={
                                  keyDateOfMonth === item
                                    ? {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: '#0099FF',
                                        borderWidth: 3,
                                        height: 35,
                                        width: 35,
                                        borderRadius: 30,
                                        marginRight: 8,
                                      }
                                    : {
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderColor: 'gray',
                                        borderWidth: 2,
                                        height: 35,
                                        width: 35,
                                        borderRadius: 30,
                                        marginRight: 8,
                                      }
                                }>
                                <Text style={{fontSize: 10}}>{item}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        )}
                        {chooseRM === 2 && (
                          <View>
                            <Text
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                                fontSize: 15,
                                color: '#0099FF',
                              }}>
                              Vào thứ:{' '}
                            </Text>
                            <Flex justify="around" style={{height: 50}}>
                              {week.map(item => (
                                <TouchableOpacity
                                  onPress={() => handleCheckDateM(item)}
                                  style={
                                    keyDateOfWeekM === item
                                      ? {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: '#0099FF',
                                          borderWidth: 3,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                      : {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: 'gray',
                                          borderWidth: 2,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                  }>
                                  <Text style={{fontSize: 10}}>
                                    {item !== 0 ? 'T' + (item + 1) : 'CN'}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </Flex>
                            <Text
                              style={{
                                marginLeft: 10,
                                fontSize: 15,
                                color: '#0099FF',
                              }}>
                              Lần:{' '}
                            </Text>
                            <Flex justify="around" style={{height: 50}}>
                              {weekTime.map(item => (
                                <TouchableOpacity
                                  onPress={() => handleCheckWeekTime(item)}
                                  style={
                                    keyWeekTime === item
                                      ? {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: '#0099FF',
                                          borderWidth: 3,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                      : {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: 'gray',
                                          borderWidth: 2,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                  }>
                                  <Text style={{fontSize: 10}}>
                                    {item === 0 ? 'Cuối' : item}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </Flex>
                          </View>
                        )}
                      </View>
                    )}
                    {repeat === 'year' && (
                      <View>
                        <List
                          style={{
                            borderBottomColor: 'gray',
                            borderBottomWidth: 1,
                          }}>
                          <Radio.RadioItem
                            style={{
                              height: 30,
                            }}
                            checked={chooseRY === 1}
                            onChange={event => {
                              if (event.target.checked) {
                                setchooseRY(1);
                              }
                            }}>
                            <View
                              style={{
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text>Ngày thuộc tháng trong năm</Text>
                            </View>
                          </Radio.RadioItem>
                          <Radio.RadioItem
                            style={{height: 30}}
                            checked={chooseRY === 2}
                            onChange={event => {
                              if (event.target.checked) {
                                setchooseRY(2);
                              }
                            }}>
                            <View
                              style={{
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                              }}>
                              <Text>Thứ lần thứ n thuộc tháng trong năm</Text>
                            </View>
                          </Radio.RadioItem>
                        </List>
                        {chooseRY === 1 && (
                          <View>
                            <Text
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                                fontSize: 15,
                                color: '#0099FF',
                              }}>
                              Vào ngày:{' '}
                            </Text>
                            <ScrollView
                              horizontal
                              style={{
                                marginTop: 6,
                                height: 50,
                                marginLeft: 10,
                                marginRight: 10,
                              }}>
                              {month.map(item => (
                                <TouchableOpacity
                                  onPress={() =>
                                    handleCheckDateOfMonthYear(item)
                                  }
                                  style={
                                    keyDateOfMonthYear === item
                                      ? {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: '#0099FF',
                                          borderWidth: 3,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                      : {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: 'gray',
                                          borderWidth: 2,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                  }>
                                  <Text style={{fontSize: 10}}>{item}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                            <Text
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                                fontSize: 15,
                                color: '#0099FF',
                              }}>
                              Thuộc tháng:{' '}
                            </Text>
                            <ScrollView
                              horizontal
                              style={{
                                marginTop: 6,
                                height: 50,
                                marginLeft: 10,
                                marginRight: 10,
                              }}>
                              {months.map(item => (
                                <TouchableOpacity
                                  onPress={() => handleCheckMonthOfYear(item)}
                                  style={
                                    keyMonthOfYear === item
                                      ? {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: '#0099FF',
                                          borderWidth: 3,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                      : {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: 'gray',
                                          borderWidth: 2,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                  }>
                                  <Text style={{fontSize: 10}}>{item}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                        {chooseRY === 2 && (
                          <View>
                            <Text
                              style={{
                                marginLeft: 10,
                                marginTop: 10,
                                fontSize: 15,
                                color: '#0099FF',
                              }}>
                              Vào thứ:{' '}
                            </Text>
                            <Flex
                              justify="around"
                              style={{
                                height: 50,
                                marginLeft: 10,
                                marginRight: 10,
                              }}>
                              {week.map(item => (
                                <TouchableOpacity
                                  onPress={() => handleCheckDateY(item)}
                                  style={
                                    keyDateOfWeekY === item
                                      ? {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: '#0099FF',
                                          borderWidth: 3,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                      : {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: 'gray',
                                          borderWidth: 2,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                  }>
                                  <Text style={{fontSize: 10}}>
                                    {item !== 0 ? 'T' + (item + 1) : 'CN'}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </Flex>
                            <Text
                              style={{
                                marginLeft: 10,
                                fontSize: 15,
                                color: '#0099FF',
                              }}>
                              Lần:{' '}
                            </Text>
                            <Flex justify="around" style={{height: 50}}>
                              {weekTime.map(item => (
                                <TouchableOpacity
                                  onPress={() => handleCheckWeekTimeY(item)}
                                  style={
                                    keyWeekTimeY === item
                                      ? {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: '#0099FF',
                                          borderWidth: 3,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                      : {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: 'gray',
                                          borderWidth: 2,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                  }>
                                  <Text style={{fontSize: 10}}>
                                    {item === 0 ? 'Cuối' : item}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </Flex>
                            <Text
                              style={{
                                marginLeft: 10,
                                fontSize: 15,
                                color: '#0099FF',
                              }}>
                              Thuộc tháng:{' '}
                            </Text>
                            <ScrollView
                              horizontal
                              style={{
                                marginTop: 6,
                                height: 50,
                                marginLeft: 10,
                                marginRight: 10,
                              }}>
                              {months.map(item => (
                                <TouchableOpacity
                                  onPress={() => handleCheckMonthOfYear(item)}
                                  style={
                                    keyMonthOfYear === item
                                      ? {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: '#0099FF',
                                          borderWidth: 3,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                      : {
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          borderColor: 'gray',
                                          borderWidth: 2,
                                          height: 35,
                                          width: 35,
                                          borderRadius: 30,
                                          marginRight: 8,
                                        }
                                  }>
                                  <Text style={{fontSize: 10}}>{item}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        )}
                      </View>
                    )}
                    <Flex
                      justify="start"
                      style={{marginTop: 10, marginLeft: 5}}>
                      <View style={{flex: 4}}>
                        <Flex>
                          <Icon name="clock-circle" color="gray" />
                          <Text
                            style={{
                              marginLeft: 5,
                              fontSize: 16,
                              color: '#0099FF',
                            }}>
                            Loại thời hạn lặp:
                          </Text>
                        </Flex>
                      </View>
                      <View style={{flex: 5.5}}>
                        <Picker
                          value={typeEnd}
                          onChange={value => {
                            settypeEnd(value[0]);
                          }}
                          onOk={value => {
                            settypeEnd(value[0]);
                          }}
                          okText="Xác nhận"
                          dismissText="Hủy"
                          data={[
                            {value: 0, label: 'Theo ngày dừng lặp'},
                            {value: 1, label: 'Theo số lần lặp'},
                          ]}
                          cols={1}
                          title="Loại thời hạn lặp">
                          {typeEnd === 0 ? (
                            <Text
                              style={{
                                marginLeft: 20,
                                fontSize: 16,
                                color: 'gray',
                              }}>
                              Theo ngày dừng lặp
                            </Text>
                          ) : (
                            <Text
                              style={{
                                marginLeft: 20,
                                fontSize: 16,
                                color: 'gray',
                              }}>
                              Theo số lần lặp
                            </Text>
                          )}
                        </Picker>
                      </View>
                    </Flex>
                    {typeEnd === 0 ? (
                      <Flex
                        justify="start"
                        style={{
                          marginTop: 10,
                          marginBottom: 10,
                          marginLeft: 10,
                          padding: 5,
                          paddingLeft: 0,
                        }}>
                        <View style={{flex: 4}}>
                          <Flex>
                            <Text
                              style={{
                                fontSize: 16,
                                fontFamily: '',
                                color: '#0099FF',
                              }}>
                              Ngày dừng lặp:
                            </Text>
                          </Flex>
                        </View>

                        <View style={{flex: 7, justifyContent: 'flex-end'}}>
                          <Flex>
                            <TouchableOpacity
                              onPress={() => {
                                setshowEndLoopCalendar(!showEndLoopCalendar);
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: '',
                                  color: 'gray',
                                }}>
                                {endloopDate
                                  ? new Date(endloopDate).getDate() >= 10 &&
                                    new Date(endloopDate).getMonth() + 1 >= 10
                                    ? new Date(endloopDate).getDate() +
                                      ' / ' +
                                      (new Date(endloopDate).getMonth() + 1) +
                                      ' / ' +
                                      new Date(endloopDate).getFullYear()
                                    : new Date(endloopDate).getDate() < 10 &&
                                      new Date(endloopDate).getMonth() + 1 >= 10
                                    ? '0' +
                                      new Date(endloopDate).getDate() +
                                      ' / ' +
                                      (new Date(endloopDate).getMonth() + 1) +
                                      ' / ' +
                                      new Date(endloopDate).getFullYear()
                                    : new Date(endloopDate).getDate() >= 10 &&
                                      new Date(endloopDate).getMonth() + 1 < 10
                                    ? new Date(endloopDate).getDate() +
                                      ' / 0' +
                                      (new Date(endloopDate).getMonth() + 1) +
                                      ' / ' +
                                      new Date(endloopDate).getFullYear()
                                    : '0' +
                                      new Date(endloopDate).getDate() +
                                      ' / 0' +
                                      (new Date(endloopDate).getMonth() + 1) +
                                      ' / ' +
                                      new Date(endloopDate).getFullYear()
                                  : '(Ngày dừng lặp)'}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => {
                                setshowTimePicker3(!showTimePicker3);
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  fontFamily: '',
                                  color: 'gray',
                                }}>
                                {'  '}
                                {endloopTime ? endloopTime : '(Giờ dừng lặp)'}
                              </Text>
                            </TouchableOpacity>
                          </Flex>
                        </View>
                      </Flex>
                    ) : (
                      <InputItem
                        clear
                        type="number"
                        placeholder="Số lần lặp sự kiện"
                        defaultValue={times.toString()}
                        style={{
                          fontSize: 16,
                          marginTop: 2,
                          minWidth: 10,
                          marginLeft: 72,
                        }}
                        onChangeText={value => {
                          if (value === '') {
                            settimes(0);
                          } else {
                            settimes(parseInt(value, 10));
                          }
                        }}>
                        <View style={{width: 150}}>
                          <Text
                            style={{
                              fontSize: 16,
                              marginLeft: 10,
                              color: '#0099FF',
                            }}>
                            Số lần lặp sự kiện:
                          </Text>
                        </View>
                      </InputItem>
                    )}

                    <View>
                      {showTimePicker3 && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          timeZoneOffsetInMinutes={7}
                          value={time3}
                          mode={'time'}
                          is24Hour={true}
                          onChange={async (e, date) => {
                            setshowTimePicker3(false);
                            if (date) {
                              await settime3(date);
                              setendloopTime(
                                date.getHours() < 10 && date.getMinutes() >= 10
                                  ? '0' +
                                      date.getHours() +
                                      ':' +
                                      date.getMinutes()
                                  : date.getHours() >= 10 &&
                                    date.getMinutes() < 10
                                  ? date.getHours() + ':0' + date.getMinutes()
                                  : date.getHours() < 10 &&
                                    date.getMinutes() < 10
                                  ? '0' +
                                    date.getHours() +
                                    ':0' +
                                    date.getMinutes()
                                  : date.getHours() + ':' + date.getMinutes(),
                              );
                            }

                            seterr('');
                            // console.log(date);
                          }}
                        />
                      )}
                      {showEndLoopCalendar && (
                        <Calendar
                          markedDates={{
                            [endDate]: {
                              selected: true,
                              selectedColor: 'orange',
                            },
                            [endloopDate]: {
                              selected: true,
                            },
                          }}
                          minDate={endDate}
                          onDayPress={day => {
                            console.log('selected day', day);
                            setendloopDate(day.dateString);
                            //setshowEndCalendar(!showEndCalendar);
                          }}
                          onMonthChange={month => {
                            console.log('month changed', month);
                          }}
                          firstDay={1}
                          onPressArrowLeft={substractMonth => substractMonth()}
                          onPressArrowRight={addMonth => addMonth()}
                        />
                      )}
                    </View>
                  </View>
                )}
              </View>
              <View>
                <Flex justify="start" style={{marginTop: 10, marginBottom: 5}}>
                  <Icon name="edit" color="gray" />
                  <Text style={{marginLeft: 5, fontSize: 16, color: '#0099FF'}}>
                    Ghi chú:
                  </Text>
                </Flex>
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
              </View>
            </Card>
            <Flex>
              {err !== '' && (
                <Text style={{color: 'red', fontSize: 17, margin: 10}}>
                  {err}
                </Text>
              )}
            </Flex>
            <Button
              type="primary"
              style={{marginTop: 10, marginBottom: 20}}
              onPress={HandleEditEvent}>
              <Text>Lưu thay đổi</Text>
            </Button>
          </WingBlank>
        </ScrollView>
      </View>
    </Provider>
  );
}
