/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  List,
  Provider,
  Flex,
  Card,
  Picker,
  Tabs,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import TaskItem from './TaskItem';
import Panel from './Panel';
// import Swipeout from 'react-native-swipeout';
// import Swipeable from 'react-native-gesture-handler/Swipeable';
// import Test from './Test';

export default function TaskList({navigation, route}) {
  console.disableYellowBox = true;
  // const navigation = props.navigation;
  const {token} = route.params;
  const {socket} = route.params;
  const [checkFilter, setcheckFilter] = useState(1);
  // const {user} = route.params;
  const [tasklist, setTaskList] = useState(null);
  const [listMember, setlistMember] = useState(null);
  const [listCat, setlistCat] = useState(null);
  const [user, setuser] = useState('');
  const [typeFilter, settypeFilter] = useState(1);
  const getUser = () => {
    RNFetchBlob.fetch('GET', 'https://househelperapp-api.herokuapp.com/me', {
      Authorization: 'Bearer ' + token,
    }).then(res => {
      const t = res.json();
      setuser(t.userInfo);
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  // console.log('token của tasklist ' + token);
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
      // console.log(t.listMembers);
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
      // console.log(t.listMembers);
    });
  };
  useEffect(() => {
    getlistMember();
    getlistCat();
  }, []);
  useEffect(() => {
    getlist();
  }, []);
  useEffect(() => {
    if (socket) {
      //console.log(socket);
      socket.on('Task', data => {
        console.log(data);
        getlist();
      });
      socket.on('Member', data => {
        console.log(data);
        getlistMember();
      });
      socket.on('Task Category', data => {
        console.log(data);
        getlistCat();
      });
    }
  });

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
  if (tasklist === null) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0099FF" />
      </View>
    );
  } else {
    //console.log(tasklist);
    return (
      <Provider>
        <View style={{paddingTop: 5, backgroundColor: 'white', flex: 1}}>
          <Card style={{elevation: 10, margin: 5}}>
            <Flex style={{paddingLeft: 10, paddingRight: 10}}>
              {typeFilter === 1 ? (
                <ScrollView horizontal={true}>
                  {listMember === null ? (
                    <View style={[styles.container, styles.horizontal]}>
                      <ActivityIndicator size="large" color="#0099FF" />
                    </View>
                  ) : (
                    <Flex
                      justify="around"
                      style={{marginTop: 15, margin: 5}}
                      wrap="wrap">
                      <Picker
                        value={typeFilter}
                        onChange={value => {
                          settypeFilter(value[0]);
                          setcheckFilter(1);
                        }}
                        onOk={value => {
                          settypeFilter(value[0]);
                          setcheckFilter(1);
                        }}
                        okText="Xác nhận"
                        dismissText="Hủy"
                        data={[
                          {value: 1, label: 'Thành viên'},
                          {value: 2, label: 'Loại công việc'},
                        ]}
                        cols={1}
                        title="Loại lọc">
                        <Flex direction="column" style={{margin: 5}}>
                          <Image
                            style={{
                              width: 45,
                              height: 45,
                              borderRadius: 25,
                            }}
                            source={{
                              uri:
                                'https://cdn1.iconfinder.com/data/icons/mobile-device/512/filter-water-convert-blue-round-512.png',
                            }}
                          />
                          <View>
                            <Text numberOfLines={1} style={{maxWidth: 60}}>
                              Lọc
                            </Text>
                          </View>
                        </Flex>
                      </Picker>
                      <TouchableOpacity onPress={() => setcheckFilter(1)}>
                        <Flex direction="column" style={{margin: 5}}>
                          <Image
                            style={
                              checkFilter === 1
                                ? {
                                    width: 45,
                                    height: 45,
                                    borderRadius: 25,
                                    borderColor: '#0099FF',
                                    borderWidth: 2,
                                  }
                                : {
                                    width: 45,
                                    height: 45,
                                    borderRadius: 25,
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                  }
                            }
                            source={{
                              uri:
                                'https://thumbs.dreamstime.com/b/home-icon-house-symbol-simple-vector-illustration-eps-164215901.jpg',
                            }}
                          />
                          <View>
                            <Text numberOfLines={1} style={{maxWidth: 60}}>
                              Tất cả
                            </Text>
                          </View>
                        </Flex>
                      </TouchableOpacity>
                      {listMember.map(item => (
                        <TouchableOpacity
                          onPress={() => setcheckFilter(item._id)}>
                          <Flex direction="column" style={{margin: 5}}>
                            <Image
                              style={
                                checkFilter === item._id
                                  ? {
                                      width: 45,
                                      height: 45,
                                      borderRadius: 25,
                                      borderColor: '#0099FF',
                                      borderWidth: 2,
                                      opacity: item.mAvatar.color ? 0.4 : 1,
                                      backgroundColor: item.mAvatar.color,
                                    }
                                  : {
                                      width: 45,
                                      height: 45,
                                      borderRadius: 25,
                                      borderColor: 'gray',
                                      borderWidth: 2,
                                      opacity: item.mAvatar.color ? 0.4 : 1,
                                      backgroundColor: item.mAvatar.color,
                                    }
                              }
                              source={{uri: item.mAvatar.image}}
                              id={item._id}
                            />
                            <View>
                              <Text numberOfLines={1} style={{maxWidth: 60}}>
                                {item.mName}
                              </Text>
                            </View>
                          </Flex>
                        </TouchableOpacity>
                      ))}
                    </Flex>
                  )}
                </ScrollView>
              ) : (
                <ScrollView horizontal={true}>
                  {listCat === null ? (
                    <View style={[styles.container, styles.horizontal]}>
                      <ActivityIndicator size="large" color="#0099FF" />
                    </View>
                  ) : (
                    <Flex
                      justify="around"
                      style={{marginTop: 15, margin: 5}}
                      wrap="wrap">
                      <Picker
                        value={typeFilter}
                        onChange={value => {
                          settypeFilter(value[0]);
                          setcheckFilter(1);
                        }}
                        onOk={value => {
                          settypeFilter(value[0]);
                          setcheckFilter(1);
                        }}
                        okText="Xác nhận"
                        dismissText="Hủy"
                        data={[
                          {value: 1, label: 'Thành viên'},
                          {value: 2, label: 'Loại công việc'},
                        ]}
                        cols={1}
                        title="Loại lọc">
                        <Flex direction="column" style={{margin: 5}}>
                          <Image
                            style={{
                              width: 45,
                              height: 45,
                              borderRadius: 25,
                            }}
                            source={{
                              uri:
                                'https://cdn1.iconfinder.com/data/icons/mobile-device/512/filter-water-convert-blue-round-512.png',
                            }}
                          />
                          <View>
                            <Text numberOfLines={1} style={{maxWidth: 60}}>
                              Lọc
                            </Text>
                          </View>
                        </Flex>
                      </Picker>
                      <TouchableOpacity onPress={() => setcheckFilter(1)}>
                        <Flex direction="column" style={{margin: 5}}>
                          <Image
                            style={
                              checkFilter === 1
                                ? {
                                    width: 45,
                                    height: 45,
                                    borderRadius: 25,
                                    borderColor: '#0099FF',
                                    borderWidth: 2,
                                  }
                                : {
                                    width: 45,
                                    height: 45,
                                    borderRadius: 25,
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                  }
                            }
                            source={{
                              uri:
                                'https://thumbs.dreamstime.com/b/home-icon-house-symbol-simple-vector-illustration-eps-164215901.jpg',
                            }}
                          />
                          <View>
                            <Text numberOfLines={1} style={{maxWidth: 60}}>
                              Tất cả
                            </Text>
                          </View>
                        </Flex>
                      </TouchableOpacity>
                      <Flex justify="start" style={{marginTop: 10}} wrap="wrap">
                        {listCat.map(item => (
                          <Flex direction="column" style={{margin: 5}}>
                            <TouchableOpacity
                              onPress={() => {
                                setcheckFilter(item._id);
                                console.log('check: ' + item._id);
                              }}>
                              <Image
                                style={
                                  checkFilter === item._id
                                    ? {
                                        width: 45,
                                        height: 45,
                                        borderRadius: 25,
                                        borderColor: '#0099FF',
                                        borderWidth: 2,
                                      }
                                    : {
                                        width: 45,
                                        height: 45,
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
                      </Flex>
                    </Flex>
                  )}
                </ScrollView>
              )}
            </Flex>
          </Card>
          <Card
            style={{
              padding: 5,
              marginTop: 1,
              marginBottom: 1,
              margin: 5,
              backgroundColor: '#fff',
              flex: 2,
              elevation: 10,
            }}>
            <Tabs
              swipeable={false}
              usePaged={false}
              tabs={[
                {title: 'SẮP TỚI'},
                {title: 'CẦN LÀM'},
                {title: 'BỊ TRỄ'},
                {title: 'ĐÃ XONG'},
              ]}
              style={{height: 420}}>
              {/*tab công việc sắp đến thời gian thực hiện */}
              <View style={{}}>
                <ScrollView>
                  <FlatList
                    data={
                      tasklist && checkFilter !== 1
                        ? tasklist.filter(item1 =>
                            typeFilter === 1
                              ? item1.state === 'upcoming' &&
                                (item1.assign === null ||
                                  (item1.assign &&
                                    item1.assign.mAssigns.find(
                                      e => e.mID._id === checkFilter,
                                    )))
                              : item1.state === 'upcoming' &&
                                item1.tcID._id === checkFilter,
                          )
                        : tasklist.filter(item1 => item1.state === 'upcoming')
                    }
                    //extraData={activeRow}
                    renderItem={({item, index}) => (
                      <TaskItem
                        extra={item.points}
                        name={item.name}
                        time={item.time}
                        point={item.points}
                        note={item.notes || ''}
                        img={item.photo}
                        id={item._id}
                        assign={item.assign}
                        category={item.tcID}
                        navigator={navigation}
                        getlist={getlist}
                        token={token}
                        user={user}
                        duedate={item.dueDate}
                        penalty={item.penalty}
                        repeat={item.repeat}
                        reminder={item.reminder}
                        dis={item.state}
                      />
                    )}
                  />
                </ScrollView>
              </View>
              {/*tab công việc cần làm*/}
              <View style={{backgroundColor: '#fff'}}>
                <ScrollView>
                  <FlatList
                    data={
                      tasklist && checkFilter !== 1
                        ? tasklist.filter(item1 =>
                            typeFilter === 1
                              ? item1.state === 'todo' &&
                                (item1.assign === null ||
                                  (item1.assign &&
                                    item1.assign.mAssigns.find(
                                      e => e.mID._id === checkFilter,
                                    )))
                              : item1.state === 'todo' &&
                                item1.tcID._id === checkFilter,
                          )
                        : tasklist.filter(item1 => item1.state === 'todo')
                    }
                    //extraData={activeRow}
                    renderItem={({item, index}) => (
                      <TaskItem
                        extra={item.points}
                        name={item.name}
                        time={item.time}
                        point={item.points}
                        note={item.notes || ''}
                        img={item.photo}
                        id={item._id}
                        assign={item.assign}
                        category={item.tcID}
                        navigator={navigation}
                        getlist={getlist}
                        token={token}
                        user={user}
                        duedate={item.dueDate}
                        penalty={item.penalty}
                        repeat={item.repeat}
                        reminder={item.reminder}
                        dis={item.state}
                      />
                    )}
                  />
                </ScrollView>
              </View>
              {/*tab công việc bị trễ*/}
              <View style={{backgroundColor: '#fff'}}>
                <ScrollView>
                  <List>
                    {tasklist && checkFilter !== 1
                      ? tasklist
                          .filter(item1 =>
                            typeFilter === 1
                              ? item1.state === 'late' &&
                                (item1.assign === null ||
                                  (item1.assign &&
                                    item1.assign.mAssigns.find(
                                      e => e.mID._id === checkFilter,
                                    )))
                              : item1.state === 'late' &&
                                item1.tcID._id === checkFilter,
                          )
                          .map(item => (
                            <TaskItem
                              extra={item.points}
                              name={item.name}
                              time={item.time}
                              point={item.points}
                              note={item.notes || ''}
                              img={item.photo}
                              id={item._id}
                              assign={item.assign}
                              category={item.tcID}
                              navigator={navigation}
                              getlist={getlist}
                              token={token}
                              user={user}
                              duedate={item.dueDate}
                              penalty={item.penalty}
                              repeat={item.repeat}
                              reminder={item.reminder}
                              dis={item.state}
                            />
                          ))
                      : tasklist
                          .filter(item1 => item1.state === 'late')
                          .map(item => (
                            <TaskItem
                              extra={item.points}
                              name={item.name}
                              time={item.time}
                              point={item.points}
                              note={item.notes || ''}
                              img={item.photo}
                              id={item._id}
                              assign={item.assign}
                              category={item.tcID}
                              navigator={navigation}
                              getlist={getlist}
                              token={token}
                              user={user}
                              duedate={item.dueDate}
                              penalty={item.penalty}
                              repeat={item.repeat}
                              reminder={item.reminder}
                              dis={item.state}
                            />
                          ))}
                  </List>
                </ScrollView>
              </View>
              {/*tabs công việc đã hoàn thành*/}
              <View style={{backgroundColor: '#fff'}}>
                <ScrollView>
                  <FlatList
                    data={
                      tasklist && checkFilter !== 1
                        ? tasklist.filter(item1 =>
                            typeFilter === 1
                              ? item1.state === 'completed' &&
                                (item1.assign === null ||
                                  (item1.assign &&
                                    item1.assign.mAssigns.find(
                                      e => e.mID._id === checkFilter,
                                    )))
                              : item1.state === 'completed' &&
                                item1.tcID._id === checkFilter,
                          )
                        : tasklist.filter(item1 => item1.state === 'completed')
                    }
                    //extraData={activeRow}
                    renderItem={({item, index}) => (
                      <TaskItem
                        extra={item.points}
                        name={item.name}
                        time={item.time}
                        point={item.points}
                        note={item.notes || ''}
                        img={item.photo}
                        id={item._id}
                        assign={item.assign}
                        category={item.tcID}
                        navigator={navigation}
                        getlist={getlist}
                        token={token}
                        user={user}
                        duedate={item.dueDate}
                        penalty={item.penalty}
                        repeat={item.repeat}
                        reminder={item.reminder}
                        dis={item.state}
                      />
                    )}
                  />
                </ScrollView>
              </View>
            </Tabs>
          </Card>
        </View>
      </Provider>
    );
  }
}
