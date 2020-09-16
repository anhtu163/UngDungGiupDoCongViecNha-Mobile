/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {Icon, TabBar, Modal, Flex} from '@ant-design/react-native';
import {Text} from 'react-native';
import TaskManage from '../TaskManage/TaskManage';
import Family from '../Family/Family';
import CalendarManage from '../Calendar/CalendarManage';
import ShoppingManage from '../Shopping/ShoppingManage';
import AwardManage from '../Award/AwardManage';
import RNFetchBlob from 'react-native-fetch-blob';
import {View} from 'native-base';
import socketIOClient from 'socket.io-client';

export default function Home(props) {
  const [selectedTab, setselectedTab] = useState('Tab1');
  const token = props.token;
  const AuthContext = props.AuthContext;
  const [user, setuser] = useState('');
  const [sk, setsk] = useState(null);
  // const [tmp, settmp] = useState(false);
  const ENDPOINT = 'https://househelperapp-api.herokuapp.com';
  let socket;
  // const [message, setmessage] = useState('Message');
  // const [date, setdate] = useState('NULL');
  // const [n, setn] = useState('NULL');
  // const [connect, setconnect] = useState('NULL');
  // console.disableYellowBox = true;
  const getUser = () => {
    RNFetchBlob.fetch('GET', 'https://househelperapp-api.herokuapp.com/me', {
      Authorization: 'Bearer ' + token,
    }).then(res => {
      const t = res.json();
      // console.log(t);
      setuser(t.userInfo);
    });
  };
  // let t;
  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    // console.log('hello');
    socket = socketIOClient(ENDPOINT);

    socket.on('connect', function() {
      socket.emit('authenticate', {token});
    });

    socket.on('authenticate', res => {
      let t;
      //setconnect(res.message);
      t = res.message;
      console.log(t);
      // Modal.alert('Thông báo', t, [{text: 'OK'}]);
    });

    socket.on('reminder', data => {
      let t1;
      console.log(data);
      //setmessage(data.name);
      t1 = data.name;
      const duedate =
        new Date(data.dueDate).getDate() +
        ' / ' +
        (new Date(data.dueDate).getMonth() + 1) +
        ' / ' +
        new Date(data.dueDate).getFullYear();
      const duetime = new Date(data.dueDate);
      const dt =
        duetime.getHours() < 10 && duetime.getMinutes() >= 10
          ? '0' + duetime.getHours() + ' : ' + duetime.getMinutes()
          : duetime.getHours() >= 10 && duetime.getMinutes() < 10
          ? duetime.getHours() + ' : 0' + duetime.getMinutes()
          : duetime.getHours() < 10 && duetime.getMinutes() < 10
          ? '0' + duetime.getHours() + ' : 0' + duetime.getMinutes()
          : duetime.getHours() + ' : ' + duetime.getMinutes();
      Modal.alert(
        'Nhắc nhở',
        'Công việc ' + t1 + ' bạn được phân công sắp đến hạn',
        [
          {
            text: 'Xem chi tiết',
            onPress: () => {
              Modal.alert(
                'Chi tiết',
                <View
                  style={{
                    flex: 1,
                    alignContent: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Flex direction="column">
                    <Text>Tên công việc: {data.name}</Text>
                    <Text>Ngày hết hạn: {duedate}</Text>
                    <Text>Thời gian hết hạn: {dt} </Text>
                  </Flex>
                </View>,
                [{text: 'Đóng'}],
              );
            },
          },
          {text: 'OK'},
        ],
      );
    });

    socket.on('Event', data => {
      console.log(data.type);
      if (data.type === 'reminderEvent') {
        console.log(data);
        Modal.alert('Thông báo', data.message, [{text: 'OK'}]);
      }
    });

    socket.on('ShoppingList', data => {
      console.log(data.type);
      if (data.type === 'reminderShoppingList') {
        console.log(data);
        Modal.alert('Thông báo', data.message, [{text: 'OK'}]);
      }
    });

    socket.on('nudge', data => {
      let t3;
      //console.log(data);
      //setn(data.message);
      t3 = data.message;
      Modal.alert('Thông báo', t3, [{text: 'OK'}]);
    });

    setsk(socket);
  }, []);

  //console.log(sk);
  return (
    <TabBar
      unselectedTintColor="gray"
      tintColor="#0099FF"
      barTintColor="white"
      hidden={true}>
      <TabBar.Item
        title={<Text style={{fontSize: 12}}>Gia đình</Text>}
        icon={<Icon name="home" size={25} />}
        selected={selectedTab === 'Tab1'}
        onPress={() => {
          setselectedTab('Tab1');
        }}>
        <Family
          token={token}
          AuthContext={AuthContext}
          user={user}
          getUser={getUser}
          socket={sk}
        />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="calendar" size={25} />}
        title={<Text style={{fontSize: 12}}>Lịch</Text>}
        selected={selectedTab === 'Tab2'}
        onPress={() => setselectedTab('Tab2')}>
        <CalendarManage token={token} socket={sk} />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="check" size={25} />}
        title={<Text style={{fontSize: 12}}>Công việc</Text>}
        selected={selectedTab === 'Tab3'}
        onPress={() => setselectedTab('Tab3')}>
        <TaskManage
          token={token}
          AuthContext={AuthContext}
          user={user}
          socket={sk}
        />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="gift" size={25} />}
        title={<Text style={{fontSize: 12}}>Phần thưởng</Text>}
        selected={selectedTab === 'Tab5'}
        onPress={() => setselectedTab('Tab5')}>
        <AwardManage user={user} token={token} socket={sk} />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="shopping-cart" size={25} />}
        title={<Text style={{fontSize: 12}}>Mua sắm</Text>}
        selected={selectedTab === 'Tab4'}
        onPress={() => setselectedTab('Tab4')}>
        <ShoppingManage user={user} token={token} socket={sk} />
      </TabBar.Item>
    </TabBar>
  );
}
