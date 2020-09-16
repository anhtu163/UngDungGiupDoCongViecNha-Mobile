/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import _ from 'lodash';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  LocaleConfig,
} from 'react-native-calendars';
import {Flex, Icon, Modal} from '@ant-design/react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
//import {Fab} from 'native-base';
import {FAB} from 'react-native-paper';
import Toast from 'react-native-root-toast';
import RNFetchBlob from 'react-native-fetch-blob';
import Swipeout from 'react-native-swipeout';

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
    'Th1',
    'Th2',
    'Th3',
    'Th4',
    'Th5',
    'Th6',
    'Th7',
    'Th8',
    'Th9',
    'Th10',
    'Th11',
    'Th12',
  ],
  dayNames: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.defaultLocale = 'vn';
const today = new Date().toISOString().split('T')[0];

export default function Calendar(props) {
  const [date, setdate] = useState(null);
  // const [listDate, setlistDate] = useState(null);
  const [listEvent, setlistEvent] = useState(null);
  const [dates, setdates] = useState([]); // danh sách các ngày thuộc tuần được chọn

  const getDatesOfWeek = dt => {
    let week = [];
    const curr = new Date(dt);
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10);
      week.push(day);
    }
    setdates(week);
    //return week;
  };
  const onDateChanged = dt => {
    setdate(dt);
    getDatesOfWeek(dt);
    getMarkedDates();
  };
  // Bắt sự kiện thay đổi tháng với lịch
  const onMonthChange = month => {
    console.log(month);
    setdate(month.dateString);
    getDatesOfWeek(month.dateString);
    getMarkedDates();
  };
  // Lấy dữ liệu sự kiện từ server theo tháng
  const getListDate = () => {
    const data = {
      month: new Date(date).getMonth(),
      year: new Date(date).getFullYear(),
    };
    RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/list-event',
      {
        Authorization: 'Bearer ' + props.token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t1 = res.json();
      if (t1.code === 2020) {
        // setlistDate(t1.list);
        // console.log(t1);
        let t = [];
        let le = [];
        t1.list.map(item => {
          item.listEvents.map(item1 => {
            le.push(item1);
          });
          t.push({
            title:
              new Date(date).getMonth() + 1 >= 10 && item.date >= 10
                ? new Date(date).getFullYear() +
                  '-' +
                  (new Date(date).getMonth() + 1) +
                  '-' +
                  item.date
                : new Date(date).getMonth() + 1 < 10 && item.date >= 10
                ? new Date(date).getFullYear() +
                  '-0' +
                  (new Date(date).getMonth() + 1) +
                  '-' +
                  item.date
                : new Date(date).getMonth() + 1 >= 10 && item.date < 10
                ? new Date(date).getFullYear() +
                  '-' +
                  (new Date(date).getMonth() + 1) +
                  '-0' +
                  item.date
                : new Date(date).getFullYear() +
                  '-0' +
                  (new Date(date).getMonth() + 1) +
                  '-0' +
                  item.date,
            data: le.length === 0 ? [{}] : le,
          });
          le = [];
        });
        setlistEvent(t);
      }
    });
  };
  // Listen socket bắt các sự kiện mới từ server và cập nhật giao diện
  useEffect(() => {
    props.socket.on('Event', data => {
      getListDate();
    });
  }, []);

  useEffect(() => {
    onDateChanged(today);
    getMarkedDates();
  }, []);
  // Lấy dữ liệu với mỗi thao tác thay đổi biến state date
  useEffect(() => {
    getListDate();
    getMarkedDates();
    //getDatesOfWeek(today);
  }, [date]);

  // Bắt sự kiện chọn thẻ chi tiết sự kiện và chuyển đến trang chi tiết
  const itemPressed = item => {
    Toast.show(item.name, {
      duration: 2000,
      position: (Toast.positions.BOTTOM = -60),
      shadow: true,
      animation: true,
      hideOnPress: true,
    });
    props.navigation.navigate('DetailEvent', {
      getListDate,
      navigator: props.navigation,
      data: item,
    });
  };
  // Load item rỗng nếu ngày đó không có sự kiện diễn ra
  const renderEmptyItem = () => {
    return (
      <View style={styles.emptyItem}>
        <Text style={{fontSize: 15, fontStyle: 'italic'}}>
          ( Không có sự kiện cho ngày này )
        </Text>
      </View>
    );
  };
  // Load thẻ sự kiện theo ngày
  const renderItem = ({item}) => {
    const styles = StyleSheet.create({
      item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 10,
      },
      emptyDate: {
        height: 'auto',
        flex: 1,
        paddingTop: 30,
      },
    });
    if (_.isEmpty(item)) {
      //console.log('vô đây');
      return renderEmptyItem();
    }
    // console.log(item);
    const right = [
      {
        text: (
          <Flex direction="column" style={{backgroundColor: 'red'}}>
            <Icon name="delete" color="white" />
            <Text style={{color: 'white'}}>Xoá</Text>
          </Flex>
        ),
        onPress: () => {
          console.log('click nè');
          Modal.alert('Xác nhận', 'Bạn có chắc muốn xóa sự kiện này?', [
            {text: 'Hủy', style: 'cancel'},
            {
              text: 'Xác nhận',
              onPress: () => {
                RNFetchBlob.fetch(
                  'POST',
                  'https://househelperapp-api.herokuapp.com/delete-event',
                  {
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json',
                  },
                  JSON.stringify({eID: item._id}),
                ).then(res => {
                  const t = res.json();
                  if (t.code === 2020) {
                    getListDate();
                  }
                  console.log(t);
                });
              },
            },
          ]);
        },
        backgroundColor: 'red',
        style: {
          backgroundColor: 'red',
          color: 'white',
          fontSize: 15,
        },
      },
    ];
    const start = new Date(item.dateTime.start);
    const end = new Date(item.dateTime.end);
    return (
      <Swipeout
        autoClose
        style={[styles.item, {elevation: 10, marginBottom: 10}]}
        right={right}>
        <TouchableOpacity
          testID="item"
          style={[styles.item, {height: 'auto'}]}
          onPress={() => itemPressed(item)}>
          <Flex
            wrap="wrap"
            justify="end"
            align="start"
            style={{marginRight: 5, marginLeft: 5}}>
            <View
              style={{
                flex: 5,
                justifyContent: 'flex-start',
              }}>
              <Text style={{fontSize: 13, marginTop: 10}}>
                {start.getHours() < 10 && start.getMinutes() < 10
                  ? '0' + start.getHours() + ':0' + start.getMinutes()
                  : start.getHours() < 10 && start.getMinutes() >= 10
                  ? '0' + start.getHours() + ':' + start.getMinutes()
                  : start.getHours() >= 10 && start.getMinutes() < 10
                  ? start.getHours() + ':0' + start.getMinutes()
                  : start.getHours() + ':' + start.getMinutes()}{' '}
                (
                {start.getDate() < 10 && start.getMonth() + 1 < 10
                  ? '0' +
                    start.getDate() +
                    '/0' +
                    (start.getMonth() + 1) +
                    '/' +
                    start.getFullYear()
                  : start.getDate() < 10 && start.getMonth() + 1 >= 10
                  ? '0' +
                    start.getDate() +
                    '/' +
                    (start.getMonth() + 1) +
                    '/' +
                    start.getFullYear()
                  : start.getDate() >= 10 && start.getMonth() + 1 < 10
                  ? start.getDate() +
                    '/0' +
                    (start.getMonth() + 1) +
                    '/' +
                    start.getFullYear()
                  : start.getDate() +
                    '/' +
                    (start.getMonth() + 1) +
                    '/' +
                    start.getFullYear()}
                ) -{' '}
                {end.getHours() < 10 && end.getMinutes() < 10
                  ? '0' + end.getHours() + ':0' + end.getMinutes()
                  : end.getHours() < 10 && end.getMinutes() >= 10
                  ? '0' + end.getHours() + ':' + end.getMinutes()
                  : end.getHours() >= 10 && end.getMinutes() < 10
                  ? end.getHours() + ':0' + end.getMinutes()
                  : end.getHours() + ':' + end.getMinutes()}{' '}
                (
                {end.getDate() < 10 && end.getMonth() + 1 < 10
                  ? '0' +
                    end.getDate() +
                    '/0' +
                    (end.getMonth() + 1) +
                    '/' +
                    end.getFullYear()
                  : end.getDate() < 10 && end.getMonth() + 1 >= 10
                  ? '0' +
                    end.getDate() +
                    '/' +
                    (end.getMonth() + 1) +
                    '/' +
                    end.getFullYear()
                  : end.getDate() >= 10 && end.getMonth() + 1 < 10
                  ? end.getDate() +
                    '/0' +
                    (end.getMonth() + 1) +
                    '/' +
                    end.getFullYear()
                  : end.getDate() +
                    '/' +
                    (end.getMonth() + 1) +
                    '/' +
                    end.getFullYear()}
                )
              </Text>
              <Text style={{fontSize: 17, marginTop: 5, color: '#0099FF'}}>
                {item.name || 'Tên sự kiện'}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'gray',
                  marginTop: 5,
                  marginBottom: 15,
                }}>
                {item.notes || 'Ghi chú sự kiện'}
              </Text>
              {item.assign && (
                <Flex
                  style={{
                    marginBottom: 15,
                  }}>
                  {item.assign &&
                    item.assign.map(item1 => (
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          borderRadius: 30,
                          borderColor: '#0099FF',
                          borderWidth: 1,
                          marginRight: 6,
                          opacity: item1.mAvatar.color ? 0.6 : 1,
                          backgroundColor: item1.mAvatar.color,
                        }}
                        source={{uri: item1.mAvatar.image}}
                      />
                    ))}
                </Flex>
              )}
            </View>

            <Image
              style={{
                flex: 1,
                width: 60,
                height: 60,
                borderRadius: 30,
                marginTop: 15,
              }}
              source={{
                uri:
                  item.photo ||
                  'https://cdn3.iconfinder.com/data/icons/avatars-round-flat/33/avat-01-512.png',
              }}
              id={item._id}
            />
          </Flex>
        </TouchableOpacity>
      </Swipeout>
    );
  };
  // Đánh dấu ngày có sự kiện
  const getMarkedDates = () => {
    const marked = {};
    if (listEvent) {
      listEvent.forEach(item => {
        // NOTE: only mark dates with data
        if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
          marked[item.title] = {marked: true};
        }
      });
    }
    return marked;
  };
  // console.log(date);

  return (
    <CalendarProvider
      onDateChanged={onDateChanged}
      onMonthChange={onMonthChange}
      showTodayButton
      disabledOpacity={0.6}
      todayBottomMargin={20}
      todayButtonStyle={{
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: -10,
      }}>
      <ExpandableCalendar
        //testID={'expandableCalendar'}
        //disablePan
        // hideKnob
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        initialPosition={ExpandableCalendar.positions.CLOSED}
        theme={{
          selectedDayBackgroundColor: '#0099FF',
          dotColor: 'orange',
          todayTextColor: '#0099FF',
        }}
        firstDay={1}
        markedDates={getMarkedDates()}
        style={{elevation: 10}}
      />

      <AgendaList
        sections={
          listEvent &&
          listEvent.filter(e => e.title === date).length !== 0 &&
          listEvent.filter(e => dates.find(f => f === e.title))
            ? listEvent.filter(e => dates.find(f => f === e.title))
            : [
                {
                  title: date,
                  data: [{}],
                },
              ]
        }
        renderItem={renderItem}
        sectionStyle={styles.section}
        style={{backgroundColor: 'white'}}
      />
      <FAB
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: '#0099FF',
        }}
        color="white"
        icon="plus"
        onPress={() => {
          props.navigation.navigate('AddEvent', {
            tdate: date,
            getListDate,
            navigator: props.navigation,
          });
        }}
      />
      {/* <Fab
        direction="up"
        position="bottomRight"
        containerStyle={{}}
        style={{
          backgroundColor: '#0099FF',
          marginBottom: -12,
          height: 50,
          width: 50,
          elevation: 10,
        }}
        onPress={() => {
          props.navigation.navigate('AddEvent', {
            tdate: date,
            getListDate,
            navigator: props.navigation,
          });
        }}>
        <Icon name="appstore-add" />
      </Fab> */}
    </CalendarProvider>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 15,
    color: '#0099FF',
    marginTop: 5,
    elevation: 5,
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
  },
});
