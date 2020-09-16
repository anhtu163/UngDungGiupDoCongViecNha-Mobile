/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Swipeout from 'react-native-swipeout';
import Toast from 'react-native-root-toast';
import {IconFill} from '@ant-design/icons-react-native';
import {
  ActivityIndicator,
  Provider,
  Tabs,
  Flex,
  Card,
  Modal,
  Icon,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
export default function MessageMain({navigation, route}) {
  const {token, user, socket} = route.params;
  const [check, setcheck] = useState(false);
  const [mPoint, setmPoint] = useState(0);
  const [listAward, setListAward] = useState(null);
  const [listMember, setListMember] = useState(null);
  const [listHistoryReward, setListHistoryReward] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [_index, setIndex] = useState(null);
  //const win = Dimensions.get('window');
  //lấy thông tin user
  const getNewPoint = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/me',
      {
        Authorization: 'Bearer ' + token,
      },
    ).then(res => {
      const t = res.json();
      setmPoint(t.userInfo.mPoints);
    });
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
      setListMember(t.listMembers);
    });
  };
  //list award
  const getlistAward = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-reward',
      {
        Authorization: 'Bearer ' + token,
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setListAward(t.listRewards);
      }
    });
  };
  //list award
  const getListHistoryReward = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-history-reward',
      {
        Authorization: 'Bearer ' + token,
      },
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setListHistoryReward(t.listHistoryReward);
      }
    });
  };
  //delete award
  const handleDeleteAward = award => {
    if (user.mIsAdmin === false) {
      Toast.show('Xóa phần thưởng thuộc về quyền của quản trị viên', {
        duration: 1000,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });
    } else {
      const data = {
        rID: award._id,
      };
      return RNFetchBlob.fetch(
        'POST',
        'https://househelperapp-api.herokuapp.com/delete-reward',
        {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        JSON.stringify(data),
      ).then(res => {
        const t = res.json();
        if (t.code === 2020) {
          Toast.show(`Xóa phần thưởng ${award.name} thành công!`, {
            duration: 1000,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
          });
        } else {
          Toast.show(`Xảy ra lỗi! ${t.message}`, {
            duration: 1000,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
          });
        }
      });
    }
  };
  //follow award
  const handleFollowAward = award => {
    if (award.assign) {
      Toast.show('Bạn không có trong danh sách đăng kí phần thưởng này!', {
        duration: 1000,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });
    } else {
      const data = {
        rID: award._id,
      };
      return RNFetchBlob.fetch(
        'POST',
        'https://househelperapp-api.herokuapp.com/follow-reward',
        {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        JSON.stringify(data),
      ).then(res => {
        const t = res.json();
        if (t.code === 2020) {
          Toast.show(
            `Thực hiện theo dõi phần thưởng ${award.name} thành công!`,
            {
              duration: 1000,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
            },
          );
        } else {
          Toast.show(`Xảy ra lỗi! ${t.message}`, {
            duration: 2000,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
          });
        }
      });
    }
  };
  //claim award
  const handleClaimAward = award => {
    const data = {
      rID: award._id,
    };
    return RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/claim-reward',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        Toast.show(`Đổi điểm lấy phần thưởng ${award.name} thành công!`, {
          duration: 1000,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
      } else {
        Toast.show(`Xảy ra lỗi! ${t.message}`, {
          duration: 2000,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
      }
    });
  };
  // let t;
  useEffect(() => {
    getNewPoint();
  }, []);
  useEffect(() => {
    getlistMember();
    getlistAward();
    getListHistoryReward();
  }, []);
  useEffect(() => {
    if (socket) {
      //console.log(socket);
      socket.on('Reward', data => {
        console.log(data);
        getNewPoint();
        getlistAward();
        if (data.type === 'claimReward') {
          getListHistoryReward();
        }
      });
    }
  });
  const left = item => [
    {
      onPress: () => {
        Modal.alert('Xác nhận', 'Bạn đồng ý xóa phần thưởng này? ', [
          {
            text: 'Hủy',
            onPress: () => {
              console.log('cancel');
            },
            style: 'cancel',
          },
          {
            text: 'Xóa',
            onPress: () => {
              handleDeleteAward(item);
            },
          },
        ]);
      },
      text: (
        <Flex direction="column" align="center">
          <IconFill name="delete" style={{color: 'red', fontSize: 23}} />
          <Text style={{fontSize: 13}}>Xóa</Text>
        </Flex>
      ),
      backgroundColor: 'white',
    },
  ];
  const right = item => [
    {
      onPress: () => {
        Modal.alert('Xác nhận', 'Bạn đồng ý theo dõi phần thưởng này? ', [
          {
            text: 'Hủy',
            onPress: () => {
              console.log('cancel');
            },
            style: 'cancel',
          },
          {
            text: 'Theo dõi',
            onPress: () => {
              handleFollowAward(item);
            },
          },
        ]);
      },
      text: (
        <Flex direction="column" align="center" style={{}}>
          <IconFill name="pushpin" style={{color: '#0099FF', fontSize: 23}} />
          <Text style={{fontSize: 13}}>Theo dõi</Text>
        </Flex>
      ),
      backgroundColor: 'white',
    },
  ];
  //console.log(listAward && listAward[0].followers.length);
  return (
    <Provider>
      <View style={{margin: 5, flex: 1}}>
        {/* card thông tin user*/}
        <Card style={{elevation: 10}}>
          {user === null ? (
            <Flex
              justify="start"
              style={{
                height: 50,
                paddingHorizontal: 10,
                paddingTop: 5,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            </Flex>
          ) : (
            <Flex
              justify="start"
              style={{
                height: 50,
                paddingHorizontal: 10,
                paddingTop: 5,
              }}>
              <Image
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 25,
                  opacity: 1,
                  alignSelf: 'center',
                }}
                source={{uri: user.mAvatar.image}}
                id={user._id}
              />
              <Text
                numberOfLines={1}
                style={{fontSize: 19, marginLeft: 10, flex: 1}}>
                {user.mName}
              </Text>
              <Flex.Item>
                <Flex justify="end">
                  <Icon name="star" size={27} color="#b8860b" />
                  <View>
                    <Text style={{fontSize: 19, textAlign: 'center'}}>
                      {' '}
                      {mPoint} điểm
                    </Text>
                  </View>
                </Flex>
              </Flex.Item>
            </Flex>
          )}
        </Card>
        {/*card tab danh sách phần thưởng*/}
        <Card
          style={{
            padding: 5,
            marginTop: 5,
            backgroundColor: '#fff',
            flex: 2,
            elevation: 10,
          }}>
          <Tabs
            swipeable={false}
            usePaged={false}
            tabs={[
              {title: 'Phần thưởng'},
              {title: 'Theo dõi'},
              {title: 'Đã nhận'},
            ]}
            style={{height: '80%'}}>
            {/*tab content danh sách phần thưởng */}
            <View style={{}}>
              <ScrollView>
                <FlatList
                  data={listAward}
                  extraData={activeRow}
                  renderItem={({item, index}) => (
                    <Swipeout
                      left={user.mIsAdmin && left(item)}
                      right={
                        item.assign && item.assign.length > 0
                          ? null
                          : right(item)
                      }
                      autoClose
                      backgroundColor="white"
                      buttonWidth={60}
                      sextionId={1}
                      rowIndex={index}
                      onOpen={() => {
                        setActiveRow(index);
                      }}
                      close={activeRow !== index}
                      onClose={() => {
                        if (index === activeRow) {
                          setActiveRow(null);
                        }
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('AwardDetails', {award: item});
                        }}>
                        <Flex style={{height: 70, paddingHorizontal: 10}}>
                          <TouchableOpacity
                            onPress={() => {
                              setcheck(true);
                              setIndex(index);
                              Modal.alert(
                                'Xác nhận',
                                'Bạn đồng ý đổi phần thưởng này? ',
                                [
                                  {
                                    text: 'Hủy',
                                    onPress: () => {
                                      setcheck(false);
                                      console.log('cancel');
                                    },
                                    style: 'cancel',
                                  },
                                  {
                                    text: 'Xác nhận',
                                    onPress: () => {
                                      setcheck(false);
                                      handleClaimAward(item);
                                      console.log('Xác nhận');
                                    },
                                  },
                                ],
                              );
                            }}>
                            <IconFill
                              name="check-circle"
                              size={35}
                              style={{marginRight: 10}}
                              // style={
                              //   check && _index === index
                              //     ? {
                              //         marginRight: 10,
                              //         borderRadius: 25,
                              //         borderColor: '#28e02b',
                              //         backgroundColor: '#28e02b',
                              //         borderWidth: 3,
                              //         paddingTop: 5,
                              //         paddingBottom: 4,
                              //         paddingLeft: 6,
                              //         paddingRight: 4,
                              //         justifyContent: 'center',
                              //         alignContent: 'center',
                              //       }
                              //     : {
                              //         marginRight: 10,
                              //         borderRadius: 25,
                              //         borderColor: 'grey',
                              //         borderWidth: 3,
                              //         paddingTop: 5,
                              //         paddingBottom: 4,
                              //         paddingLeft: 6,
                              //         paddingRight: 4,
                              //         justifyContent: 'center',
                              //         alignContent: 'center',
                              //       }
                              // }
                              color={
                                check && _index === index ? 'green' : 'gray'
                              }
                            />
                          </TouchableOpacity>
                          <View style={{flex: 2}}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 18,
                              }}>
                              {item.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                marginBottom: -5,
                                marginTop: 2,
                              }}>
                              {item.assign !== null &&
                              Array.isArray(item.assign)
                                ? item.assign.map(itemAssign => (
                                    <Image
                                      style={{
                                        width: 19,
                                        height: 19,
                                        borderRadius: 30,
                                        borderWidth: 2,
                                        marginRight: 3,
                                        marginBottom: 5,
                                        borderColor: '#0099FF',
                                        opacity: itemAssign.mAvatar.color
                                          ? 0.6
                                          : 2,
                                        backgroundColor:
                                          itemAssign.mAvatar.color,
                                      }}
                                      source={{
                                        uri: itemAssign.mAvatar.image,
                                      }}
                                    />
                                  ))
                                : null}
                            </View>
                          </View>
                          <Flex.Item>
                            <Flex justify="end">
                              <Text
                                numberOfLines={1}
                                style={{fontSize: 15, maxWidth: 90}}>
                                {item.points} điểm{' '}
                              </Text>
                            </Flex>
                          </Flex.Item>
                        </Flex>
                        <View
                          style={{
                            borderBottomColor: '#c2c2c2',
                            borderBottomWidth: 1,
                          }}
                        />
                      </TouchableOpacity>
                    </Swipeout>
                  )}
                />
              </ScrollView>
            </View>
            {/*tab content danh sách phần thưởng đang theo dõi */}
            <View style={{backgroundColor: '#fff'}}>
              <ScrollView>
                <FlatList
                  data={listAward}
                  extraData={activeRow}
                  renderItem={({item, index}) => {
                    //kiểm tra phần thưởng này đang theo dõi hoặc user hiện tại có trong danh sách assign
                    if (
                      item.followers.filter(y => y._id === user._id).length >
                        0 ||
                      (Array.isArray(item.assign) &&
                        item.assign.filter(x => x._id === user._id).length > 0)
                    ) {
                      return (
                        <Swipeout
                          left={user.mIsAdmin && left(item)}
                          autoClose
                          backgroundColor="white"
                          buttonWidth={60}
                          sextionId={1}
                          rowIndex={index}
                          onOpen={() => {
                            setActiveRow(index);
                          }}
                          close={activeRow !== index}
                          onClose={() => {
                            if (index === activeRow) {
                              setActiveRow(null);
                            }
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('AwardDetails', {
                                award: item,
                              });
                            }}>
                            <Flex style={{height: 70, paddingHorizontal: 10}}>
                              <TouchableOpacity
                                onPress={() => {
                                  setcheck(true);
                                  setIndex(index);
                                  Modal.alert(
                                    'Xác nhận',
                                    'Bạn đồng ý đổi phần thưởng này? ',
                                    [
                                      {
                                        text: 'Hủy',
                                        onPress: () => {
                                          setcheck(false);
                                          console.log('cancel');
                                        },
                                        style: 'cancel',
                                      },
                                      {
                                        text: 'Xác nhận',
                                        onPress: () => {
                                          setcheck(false);
                                          handleClaimAward(item);
                                          console.log('Xác nhận');
                                        },
                                      },
                                    ],
                                  );
                                }}>
                                <IconFill
                                  name="check-circle"
                                  size={35}
                                  style={{marginRight: 10}}
                                  // style={
                                  //   check && _index === index
                                  //     ? {
                                  //         marginRight: 10,
                                  //         borderRadius: 25,
                                  //         borderColor: '#28e02b',
                                  //         backgroundColor: '#28e02b',
                                  //         borderWidth: 1,
                                  //         paddingTop: 5,
                                  //         paddingBottom: 4,
                                  //         paddingLeft: 6,
                                  //         paddingRight: 4,
                                  //         justifyContent: 'center',
                                  //         alignContent: 'center',
                                  //       }
                                  //     : {
                                  //         marginRight: 10,
                                  //         borderRadius: 25,
                                  //         borderColor: 'grey',
                                  //         borderWidth: 1,
                                  //         paddingTop: 5,
                                  //         paddingBottom: 4,
                                  //         paddingLeft: 6,
                                  //         paddingRight: 4,
                                  //         justifyContent: 'center',
                                  //         alignContent: 'center',
                                  //       }
                                  // }
                                  color={
                                    check && _index === index ? 'green' : 'grey'
                                  }
                                />
                              </TouchableOpacity>
                              <View style={{flex: 2}}>
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontSize: 18,
                                  }}>
                                  {item.name}
                                </Text>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginBottom: -5,
                                  }}>
                                  {item.assign !== null &&
                                  Array.isArray(item.assign)
                                    ? item.assign.map(itemAssign => (
                                        <Image
                                          style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 30,
                                            borderWidth: 2,
                                            marginRight: 3,
                                            marginBottom: 5,
                                            borderColor: '#0099FF',
                                            opacity: itemAssign.mAvatar.color
                                              ? 0.6
                                              : 2,
                                            backgroundColor:
                                              itemAssign.mAvatar.color,
                                          }}
                                          source={{
                                            uri: itemAssign.mAvatar.image,
                                          }}
                                        />
                                      ))
                                    : null}
                                </View>
                              </View>
                              <Flex.Item>
                                <Flex justify="end">
                                  <Text
                                    numberOfLines={1}
                                    style={{fontSize: 15, maxWidth: 90}}>
                                    {item.points} điểm{' '}
                                  </Text>
                                </Flex>
                              </Flex.Item>
                            </Flex>
                            <View
                              style={{
                                borderBottomColor: '#c2c2c2',
                                borderBottomWidth: 1,
                              }}
                            />
                          </TouchableOpacity>
                        </Swipeout>
                      );
                    }
                  }}
                />
              </ScrollView>
            </View>
            {/*tab content lịch sử nhận phần thưởng*/}
            <View style={{backgroundColor: '#fff'}}>
              <ScrollView>
                <FlatList
                  data={listHistoryReward}
                  renderItem={({item, index}) => (
                    <View>
                      <Flex style={{height: 70, paddingHorizontal: 10}}>
                        <View style={{flex: 3}}>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 18,
                              justifyContent: 'flex-start',
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            numberOfLines={1}
                            style={{
                              fontSize: 15,
                              justifyContent: 'flex-start',
                              color: 'grey',
                            }}>
                            Được trao cho {item.mID.mName}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'column', flex: 1}}>
                          <Flex justify="end">
                            <Text numberOfLines={1} style={{fontSize: 15}}>
                              {item.points}{' '}
                            </Text>
                            <Icon
                              name="star"
                              color="#b8860b"
                              size={15}
                              style={{}}
                            />
                          </Flex>
                          <Text style={{fontSize: 15, alignSelf: 'flex-end'}}>
                            {new Date(item.date).toLocaleDateString()}
                          </Text>
                        </View>
                      </Flex>
                      <View
                        style={{
                          borderBottomColor: '#c2c2c2',
                          borderBottomWidth: 1,
                        }}
                      />
                    </View>
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
