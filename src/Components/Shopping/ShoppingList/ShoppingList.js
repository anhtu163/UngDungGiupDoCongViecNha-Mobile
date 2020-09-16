/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {List, Flex, Provider, Picker, Card} from '@ant-design/react-native';
import ItemList from './ItemList';
import RNFetchBlob from 'react-native-fetch-blob';

export default function ShoppingList({navigation, route}) {
  const socket = route.params.socket;
  const [shoppingLists, setshoppingLists] = useState(null);
  const [listType, setlistType] = useState(null);
  const [listMember, setlistMember] = useState(null);
  const [checkFilter, setcheckFilter] = useState(1);
  const [typeFilter, settypeFilter] = useState(1);
  const getlistMember = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-member',
      {
        Authorization: 'Bearer ' + route.params.token,
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      setlistMember(t.listMembers);
      // console.log(t.listMembers);
    });
  };
  const getlistType = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-shopping-type',
      {
        Authorization: 'Bearer ' + route.params.token,
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setlistType(t.listShoppingTypes);
      }
    });
  };

  const getShoppingList = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-shopping-list',
      {
        Authorization: 'Bearer ' + route.params.token,
      },
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setshoppingLists(t.shoppingLists);
      }
    });
  };

  useEffect(() => {
    getShoppingList();
    getlistType();
    getlistMember();
  }, []);
  //console.log(shoppingLists);
  useEffect(() => {
    if (socket) {
      socket.on('ShoppingList', data => {
        getShoppingList();
        console.log(data);
      });
    }
  }, []);
  //console.log(socket);
  // console.log(
  //   shoppingLists[0] &&
  //     shoppingLists[0].listItems.filter(item => item.isChecked === true)
  //       .length === shoppingLists[0].listItems.length,
  // );
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
  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{margin: 5, marginBottom: 10, backgroundColor: 'white'}}>
          <ScrollView style={{backgroundColor: 'white'}}>
            <Card style={{elevation: 10}}>
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
                            {value: 2, label: 'Loại mua sắm'},
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
                    {listType === null ? (
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
                            {value: 2, label: 'Loại mua sắm'},
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
                        <Flex
                          justify="start"
                          style={{marginTop: 10}}
                          wrap="wrap">
                          {listType.map(item => (
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

            <Flex style={{marginTop: 10}}>
              <View
                style={{
                  flex: 2.5,
                  borderColor: 'gray',
                  borderWidth: 1,
                  height: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <View
                style={{
                  flex: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text style={{color: 'gray', fontWeight: 'bold', fontSize: 16}}>
                  Danh sách cần mua
                </Text>
              </View>
              <View
                style={{
                  flex: 2.5,
                  borderColor: 'gray',
                  borderWidth: 1,
                  height: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Flex>
            {shoppingLists === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <List>
                {shoppingLists && checkFilter !== 1
                  ? shoppingLists
                      .filter(item1 =>
                        typeFilter === 1
                          ? item1.assign === null ||
                            (item1.assign && item1.assign._id === checkFilter)
                          : item1.stID._id === checkFilter,
                      )
                      .map(item => (
                        <View>
                          {item.listItems.filter(e => e.isChecked === true)
                            .length !== item.listItems.length && (
                            <ItemList
                              data={item}
                              token={route.params.token}
                              getShoppingList={getShoppingList}
                              navigator={navigation}
                            />
                          )}
                        </View>
                      ))
                  : shoppingLists.map(item => (
                      <View>
                        {item.listItems.filter(e => e.isChecked === true)
                          .length !== item.listItems.length && (
                          <ItemList
                            data={item}
                            token={route.params.token}
                            getShoppingList={getShoppingList}
                            navigator={navigation}
                          />
                        )}
                      </View>
                    ))}
              </List>
            )}
            <Flex style={{marginBottom: 10}}>
              <View
                style={{
                  flex: 2.5,
                  borderColor: 'gray',
                  borderWidth: 1,
                  height: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
              <View
                style={{
                  flex: 4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <Text style={{color: 'gray', fontWeight: 'bold', fontSize: 16}}>
                  Danh sách đã mua
                </Text>
              </View>
              <View
                style={{
                  flex: 2.5,
                  borderColor: 'gray',
                  borderWidth: 1,
                  height: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Flex>
            {shoppingLists === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <List>
                {shoppingLists && checkFilter !== 1
                  ? shoppingLists
                      .filter(item1 =>
                        typeFilter === 1
                          ? item1.assign === null ||
                            (item1.assign && item1.assign._id === checkFilter)
                          : item1.stID._id === checkFilter,
                      )
                      .map(item => (
                        <View>
                          {item.listItems.filter(e => e.isChecked === true)
                            .length === item.listItems.length && (
                            <ItemList
                              data={item}
                              token={route.params.token}
                              getShoppingList={getShoppingList}
                              navigator={navigation}
                            />
                          )}
                        </View>
                      ))
                  : shoppingLists.map(item => (
                      <View>
                        {item.listItems.filter(e => e.isChecked === true)
                          .length === item.listItems.length && (
                          <ItemList
                            data={item}
                            token={route.params.token}
                            getShoppingList={getShoppingList}
                            navigator={navigation}
                          />
                        )}
                      </View>
                    ))}
              </List>
            )}
          </ScrollView>
        </View>
      </View>
    </Provider>
  );
}
