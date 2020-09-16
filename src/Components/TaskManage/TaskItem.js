/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect} from 'react';
import {Image, Text, View, TouchableOpacity} from 'react-native';
import {List, Icon, Flex, Modal, Toast} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Swipeout from 'react-native-swipeout';

export default function TaskItem(props) {
  // const [tmpID, settmpID] = useState('');
  const [listMember, setlistMember] = useState(null);
  //const [time, setTime] = useState(new Date());
  //const [dueDateTime, setdueDateTime] = useState(null);

  // console.log(dueDate);
  const getlistMember = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-member',
      {
        Authorization: 'Bearer ' + props.token,
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
  const memberRegister = {
    text: (
      <Flex direction="column">
        <Icon name="user-add" color="#0099FF" />
        <Text style={{color: '#0099FF'}}>Đăng ký</Text>
      </Flex>
    ),
    onPress: () => {
      Modal.alert(
        'Xác nhận',
        'Bạn xác nhận đăng ký thực hiện công việc này? ',
        [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Đồng ý',
            onPress: () => {
              console.log('Đồng ý');
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/assign-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
                console.log(t);
              });
            },
          },
        ],
      );
    },
    backgroundColor: 'white',
    style: {backgroundColor: 'white', color: '#3498db', fontSize: 15},
  };
  const memberDone = {
    text: (
      <Flex direction="column">
        <Icon name="check" color="green" />
        <Text style={{color: 'green'}}>Xong</Text>
      </Flex>
    ),
    onPress: () => {
      console.log(props.user.mIsAdmin);
      if (props.assign === null) {
        Modal.alert('Xác nhận', 'Bạn xác nhận đã hoàn thành công việc này? ', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Hoàn thành',
            onPress: () => {
              console.log('Hoàn thành');
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/complete-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
                console.log(t);
              });
            },
          },
        ]);
      } else if (
        props.assign.mAssigns.find(e => e.mID._id === props.user._id)
      ) {
        Modal.alert('Xác nhận', 'Bạn xác nhận đã hoàn thành công việc này? ', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Hoàn thành',
            onPress: () => {
              console.log('Hoàn thành');
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/complete-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
                console.log(t);
              });
            },
          },
        ]);
      } else {
        Modal.alert(
          'Thông báo',
          'Bạn không thể hoàn thành công việc này vì bạn không được phân công',
          [
            {
              text: 'Ok',
              onPress: () => {
                console.log('Ok');
              },
            },
          ],
        );
      }
    },
    backgroundColor: 'white',
    style: {backgroundColor: 'white', color: '#2ecc71', fontSize: 15},
  };
  const memberSkip = {
    text: (
      <Flex direction="column">
        <Icon name="download" color="orange" />
        <Text style={{color: 'orange'}}>Bỏ qua</Text>
      </Flex>
    ),
    onPress: () => {
      if (props.assign === null) {
        Modal.alert(
          'Thông báo',
          'Bạn không thể bỏ qua công việc này vì bạn không được phân công',
          [
            {
              text: 'Ok',
              onPress: () => {
                console.log('Ok');
              },
            },
          ],
        );
      } else if (
        props.assign.mAssigns.find(e => e.mID._id === props.user._id)
      ) {
        Modal.alert('Xác nhận', 'Bạn xác nhận bỏ qua công việc này? ', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              console.log('Xác nhận');
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/skip-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
                console.log(t);
              });
            },
          },
        ]);
      } else {
        Modal.alert(
          'Thông báo',
          'Bạn không thể bỏ qua công việc này vì bạn không được phân công',
          [
            {
              text: 'Ok',
              onPress: () => {
                console.log('Ok');
              },
            },
          ],
        );
      }
    },
    backgroundColor: 'white',
    style: {backgroundColor: 'white', color: '#3498db', fontSize: 15},
  };
  const memberNudge = {
    text: (
      <Flex direction="column">
        <Icon name="bell" color="purple" />
        <Text style={{color: 'purple'}}>Nhắc nhở</Text>
      </Flex>
    ),
    onPress: () => {
      let message;
      let listMem = [];
      if (props.assign) {
        props.assign.mAssigns
          .filter(item1 => item1.isDone === false)
          .map(item => listMem.push(item.mID._id));
        message =
          'Bạn chắc chắn muốn nhắc nhở các thành viên tham gia công việc này?';
      } else {
        listMember.map(item => listMem.push(item._id));
        message =
          'Bạn chắc chắn muốn nhắc nhở các thành viên về công việc này?';
      }
      Modal.alert('Xác nhận', message, [
        {text: 'Hủy'},
        {
          text: 'Xác nhận',
          onPress: () => {
            RNFetchBlob.fetch(
              'POST',
              'https://househelperapp-api.herokuapp.com/nudge-task',
              {
                Authorization: 'Bearer ' + props.token,
                'Content-Type': 'application/json',
              },
              JSON.stringify({
                tID: props.id,
                list: listMem,
              }),
            ).then(res => {
              const t = res.json();
              if (t.code === 2020) {
                props.getlist();
              }
              console.log(t);
            });
          },
        },
      ]);
    },
    backgroundColor: 'white',
    style: {
      backgroundColor: 'white',
      color: '#2ecc71',
      fontSize: 15,
    },
  };
  const adminDone = {
    text: (
      <Flex direction="column">
        <Icon name="check" color="green" />
        <Text style={{color: 'green'}}>Xong</Text>
      </Flex>
    ),
    onPress: () => {
      let tmpID = '';
      console.log(props.user.mIsAdmin);
      if (props.assign !== null) {
        Modal.alert(
          'Chọn thành viên hoàn thành: ',
          <Flex justify="between" wrap="wrap">
            {props.assign !== null &&
              props.assign.mAssigns
                .filter(item1 => item1.isDone === false)
                .map(item => (
                  <Flex direction="column" style={{margin: 7.5}}>
                    <TouchableOpacity
                      onPress={() => {
                        tmpID = item.mID._id;
                        console.log(tmpID);
                        Toast.info('Bạn đã chọn : ' + item.mID.mName, 0.3);
                      }}>
                      <Image
                        style={
                          tmpID === item.mID._id
                            ? {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderColor: '#0099FF',
                                borderWidth: 2.5,
                                opacity: item.mID.mAvatar.color ? 0.6 : 1,
                                backgroundColor: item.mID.mAvatar.color,
                              }
                            : {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                borderColor: 'black',
                                borderWidth: 0.5,
                                opacity: item.mID.mAvatar.color ? 0.6 : 1,
                                backgroundColor: item.mID.mAvatar.color,
                              }
                        }
                        source={{uri: item.mID.mAvatar.image}}
                        id={item.mID._id}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text numberOfLines={1} style={{maxWidth: 62}}>
                        {item.mID.mName}
                      </Text>
                    </View>
                  </Flex>
                ))}
          </Flex>,
          [
            {
              text: 'Hủy',
              onPress: () => console.log('cancel'),
              style: 'cancel',
            },
            {
              text: 'Hoàn thành',
              onPress: () => {
                console.log(tmpID);
                console.log('Hoàn thành');
                console.log({tID: props.id, mIDComplete: tmpID});
                RNFetchBlob.fetch(
                  'POST',
                  'https://househelperapp-api.herokuapp.com/complete-task',
                  {
                    Authorization: 'Bearer ' + props.token,
                    'Content-Type': 'application/json',
                  },
                  JSON.stringify({tID: props.id, mIDComplete: tmpID}),
                ).then(res => {
                  const t = res.json();
                  if (t.code === 2020) {
                    props.getlist();
                  }
                  console.log(t);
                });
              },
            },
          ],
        );
      } else {
        Modal.alert('Xác nhận', 'Bạn xác nhận đã hoàn thành công việc này? ', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Hoàn thành',
            onPress: () => {
              console.log('Hoàn thành');
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/complete-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
                console.log(t);
              });
            },
          },
        ]);
      }
    },
    backgroundColor: 'white',
    style: {backgroundColor: 'white', color: '#2ecc71', fontSize: 15},
  };
  const rightMemberTodo = [memberNudge];
  const rightAdminTodo = [
    adminDone,
    memberNudge,
    {
      text: (
        <Flex direction="column">
          <Icon name="download" color="orange" />
          <Text style={{color: 'orange'}}>Bỏ qua</Text>
        </Flex>
      ),
      onPress: () => {
        Modal.alert('Xác nhận', 'Bạn xác nhận bỏ qua công việc này? ', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              console.log('Xác nhận');
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/skip-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
                console.log(t);
              });
            },
          },
        ]);
      },
      backgroundColor: 'white',
      style: {backgroundColor: 'white', color: '#3498db', fontSize: 15},
    },
  ];
  const rightAdminCompleted = [
    {
      text: (
        <Flex direction="column">
          <Icon name="redo" color="green" />
          <Text style={{color: 'green'}}>Redo</Text>
        </Flex>
      ),
      onPress: () => {
        Modal.alert('Xác nhận', 'Bạn chắc chắn muốn redo công việc này?', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/redo-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
              });
            },
          },
        ]);
      },
      backgroundColor: 'white',
      style: {backgroundColor: 'white', color: '#2ecc71', fontSize: 15},
    },
  ];
  //const rightMemberCompleted = [];
  const rightMemberLate = [memberNudge];
  const rightAdminLate = [
    adminDone,
    memberNudge,
    {
      text: (
        <Flex direction="column">
          <Icon name="download" color="orange" />
          <Text style={{color: 'orange'}}>Bỏ qua</Text>
        </Flex>
      ),
      onPress: () => {
        Modal.alert('Xác nhận', 'Bạn xác nhận bỏ qua công việc này? ', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              console.log('Xác nhận');
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/skip-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({tID: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
                }
                console.log(t);
              });
            },
          },
        ]);
      },
      backgroundColor: 'white',
      style: {backgroundColor: 'white', color: '#3498db', fontSize: 15},
    },
  ];
  const rightMemberUpComing = [];
  const rightAdminUpComing = [];
  const leftDelete = [
    {
      text: (
        <Flex direction="column">
          <Icon name="delete" color="white" />
          <Text style={{color: 'white'}}>Xoá</Text>
        </Flex>
      ),
      onPress: () => {
        Modal.alert('Thông báo', 'Bạn chắc chắn muốn xóa?', [
          {
            text: 'Hủy',
            onPress: () => console.log('cancel'),
            style: 'cancel',
          },
          {
            text: 'Xác nhận xóa',
            onPress: () => {
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/delete-task',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({id: props.id}),
                //JSON.stringify({id: props.id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlist();
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
  const date = new Date(props.duedate);
  let defaultD;
  if (props.duedate !== null) {
    defaultD =
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      (date.getYear() + 1900);
  } else {
    defaultD = 'Chưa có thời hạn';
  }
  if (
    props.assign &&
    props.assign.mAssigns.find(e => e.mID._id === props.user._id)
  ) {
    rightMemberTodo.unshift(memberSkip);
    rightMemberTodo.unshift(memberDone);
    rightMemberLate.unshift(memberSkip);
    rightMemberLate.unshift(memberDone);
  }
  if (props.assign === null) {
    rightMemberTodo.push(memberRegister);
    rightAdminTodo.push(memberRegister);
    rightMemberUpComing.push(memberRegister);
    rightAdminUpComing.push(memberRegister);
    rightMemberTodo.unshift(memberDone);
    rightMemberLate.unshift(memberDone);
  }
  // console.log(tmpID);
  const extraItem = (item, isAll) => {
    return (
      <Flex>
        <Image
          style={{
            width: 25,
            height: 25,
            borderRadius: 30,
            borderColor: item.isDone ? '#10ac84' : 'gray',
            borderWidth: item.isDone ? 3 : 2,
            marginRight: isAll ? 0 : 3,
            opacity: item.mID.mAvatar.color ? 0.6 : 2,
            backgroundColor: item.mID.mAvatar.color,
          }}
          source={{uri: item.mID.mAvatar.image}}
        />
        {isAll && (
          <View style={{backgroundColor: '#10ac84', height: 3, width: 3}} />
        )}
      </Flex>
    );
  };
  return (
    <Swipeout
      autoClose
      //disabled={!props.user.mIsAdmin}
      backgroundColor="white"
      left={props.user.mIsAdmin && leftDelete}
      right={
        props.dis === 'todo'
          ? props.user.mIsAdmin
            ? rightAdminTodo
            : rightMemberTodo
          : props.dis === 'completed'
          ? props.user.mIsAdmin && rightAdminCompleted
          : props.dis === 'late'
          ? props.user.mIsAdmin
            ? rightAdminLate
            : rightMemberLate
          : props.dis === 'upcoming' && props.user.mIsAdmin
          ? rightAdminUpComing
          : rightMemberUpComing
      }
      onOpen={() => console.log('open')}
      onClose={() => console.log('close')}>
      <View style={{}}>
        <List.Item
          onPress={() =>
            props.navigator.navigate('TaskDetails', {
              name: props.name,
              time: props.time,
              point: props.point,
              note: props.note,
              img: props.img,
              assign: props.assign,
              category: props.category,
              id: props.id,
              token: props.token,
              isAdmin: props.user.mIsAdmin,
              duedate: props.duedate,
              penalty: props.penalty,
              reminder: props.reminder,
              repeat: props.repeat,
              getlist: props.getlist,
            })
          }>
          <Flex>
            <View style={{flex: 5}}>
              <View>
                <Text numberOfLines={1} style={{fontSize: 16}}>
                  {props.name}
                </Text>
                <Text style={{color: 'gray', fontSize: 13}}>{defaultD}</Text>
              </View>
            </View>
            <View style={{flex: 2}}>
              <Flex justify="end" wrap="wrap">
                {props.assign && (
                  <Flex numberOfLines={1}>
                    {props.assign.isAll && (
                      <View
                        style={{
                          backgroundColor: '#10ac84',
                          height: 3,
                          width: 3,
                        }}
                      />
                    )}
                    {props.assign.mAssigns.map(item =>
                      extraItem(item, props.assign.isAll),
                    )}
                  </Flex>
                )}
              </Flex>
            </View>
          </Flex>
        </List.Item>
      </View>
    </Swipeout>
  );
}
