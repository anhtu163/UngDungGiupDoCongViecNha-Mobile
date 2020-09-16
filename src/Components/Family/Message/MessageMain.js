/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useCallback} from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Image,
  FlatList,
} from 'react-native';
import {HeaderBackButton} from '@react-navigation/stack';
import {Tabs, Icon, Modal, Provider} from '@ant-design/react-native';
import {IconFill} from '@ant-design/icons-react-native';
import Swipeout from 'react-native-swipeout';
import styles from './Styles';
import RNFetchBlob from 'react-native-fetch-blob';
let gUsersActive = [];
let gUsersRecent = [];
let gFamilyGroup;
export default function MessageMain({navigation, route}) {
  let {socketchat} = route.params;
  const {user, token} = route.params;
  const [activeRow, setActiveRow] = useState(null); //xử lí swipeout list recent
  const [usersActive, setusersActive] = useState([]);
  const [usersRecent, setusersRecent] = useState([]);
  const [familyGroup, setfamilyGroup] = useState(null);
  const [visible, setvisible] = useState(false);
  const [usersActiveToShow, setusersActiveToShow] = useState([]);
  const [usersRecentToShow, setusersRecentToShow] = useState([]);
  const [listMember, setlistMember] = useState(null);
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
  useEffect(() => {
    getlistMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listMember]);

  useEffect(() => {
    //connectSocket();
    socketchat.emit('join', user);
  }, []);

  useEffect(() => {
    //gUsersActive = usersActive;
    console.log('reload active=================');
  }, [usersActive]);

  useEffect(() => {
    setusersRecentToShow(usersRecent);
    console.log('reload rêccent =================');
  }, [usersRecent]);

  useEffect(() => {
    console.log(socketchat.connected);
    if (socketchat) {
      socketchat.on('server-send-list-users-recent', usersRecent0 => {
        console.log('lấy danh sách gần đây');
        if (usersRecent0.length !== 0) {
          gUsersRecent = usersRecent0;
          console.log(gUsersRecent);
          setusersRecent(usersRecent0);
        }
      });
      socketchat.on('server-send-list-users-active', usersActive0 => {
        console.log('lấy danh sách đang online');
        if (usersActive0.length > 0) {
          gUsersActive = usersActive0;
          setusersActive(usersActive0);
        }
      });
      socketchat.on('server-send-family-group', familyGroup0 => {
        const newFamilyGroup = {...familyGroup0};
        console.log('lấy group chat!');
        if (familyGroup0) {
          gFamilyGroup = newFamilyGroup;
          setfamilyGroup(newFamilyGroup);
        }
      });
      socketchat.on('server-send-user-active', userActive => {
        console.log('thêm người mới');
        //thêm user active vào usersActive
        let newUsersActive = gUsersActive;
        newUsersActive = [...newUsersActive, userActive];
        gUsersActive = newUsersActive;
        setusersActive(newUsersActive);

        // cập nhật mSocketID cho usersRecent (nếu có)
        if (gUsersRecent.length !== 0) {
          const indexRecent = gUsersRecent.findIndex(
            element => element.mID === userActive.mID,
          );
          if (indexRecent !== -1) {
            let newUsersRecent = gUsersRecent;
            newUsersRecent[indexRecent].mSocketID = userActive.mSocketID;
            gUsersRecent = newUsersRecent;
            setusersRecent(newUsersRecent);
          } else {
            let newUsersRecent = [...gUsersRecent, userActive];
            gUsersRecent = newUsersRecent;
            setusersRecent(newUsersRecent);
          }
        } else {
          gUsersRecent = [...userActive];
          setusersRecent([...userActive]);
        }
      });
      socketchat.on('server-send-user-leave', ({mSocketID}) => {
        if (mSocketID) {
          console.log('1 member rời khỏi chat');
          // Xóa user active đã rời khỏi
          let newUsersActive = [...gUsersActive];
          const indexActive = newUsersActive.findIndex(
            element => element.mSocketID === mSocketID,
          );
          if (indexActive !== -1) {
            newUsersActive.splice(indexActive, 1);
            if (newUsersActive.length === 0) {
              gUsersActive = [];
              setusersActive([]);
            } else {
              gUsersActive = newUsersActive;
              setusersActive(newUsersActive);
            }
          }

          //cập nhật mSocketID của user trong usersRecent

          let newUsersRecent = gUsersRecent;
          let indexRecent = newUsersRecent.findIndex(
            element => element.mSocketID === mSocketID,
          );

          if (indexRecent !== -1) {
            newUsersRecent[indexRecent].mSocketID = '';
            gUsersRecent = newUsersRecent;
            setusersRecent(newUsersRecent);
          }
        }
      });
      socketchat.on(
        'server-response-message-chat-single',
        ({sender, messageContainer}) => {
          console.log('nhận tin nhắn từ main');
          const indexRecent = gUsersRecent.findIndex(
            element => sender.mID === element.mID,
          );
          const indexActive = gUsersActive.findIndex(
            element => sender.mID === element.mID,
          );
          if (indexRecent !== -1) {
            let newUsersRecent = [...gUsersRecent];
            newUsersRecent.filter(
              item => item.mID === sender.mID,
            )[0].messages = [
              ...newUsersRecent.filter(item => item.mID === sender.mID)[0]
                .messages,
              messageContainer,
            ];
            gUsersRecent = newUsersRecent;
            setusersRecent(newUsersRecent);
          }

          if (indexActive !== -1) {
            let newUsersActive = [...gUsersActive];
            newUsersActive.filter(
              item => item.mID === sender.mID,
            )[0].messages = [
              ...newUsersActive.filter(item => item.mID === sender.mID)[0]
                .messages,
              messageContainer,
            ];
            gUsersActive = newUsersActive;
            setusersActive(newUsersActive);
          }
        },
      );
      socketchat.on(
        'server-response-message-has-seen',
        ({sender, messageContainer}) => {
          console.log('response seen message');
          const _usersActive = gUsersActive;
          const _usersRecent = gUsersRecent;

          if (_usersActive.length !== 0) {
            const indexActive = _usersActive.findIndex(
              element => element.mID === sender.mID,
            );

            if (indexActive !== -1) {
              let newUsersActive = [..._usersActive];
              let messagesActive = [...newUsersActive[indexActive].messages];
              messagesActive[messagesActive.length - 1].seen = true;
              newUsersActive[indexActive].messages = messagesActive;
              gUsersActive = newUsersActive;
              setusersActive(newUsersActive);
            }
          }

          if (_usersRecent.length !== 0) {
            const indexRecent = _usersRecent.findIndex(
              element => element.mID === sender.mID,
            );

            if (indexRecent !== -1) {
              let newUsersRecent = [..._usersRecent];
              let messagesRecent = [...newUsersRecent[indexRecent].messages];
              messagesRecent[messagesRecent.length - 1].seen = true;
              newUsersRecent[indexRecent].messages = messagesRecent;
              gUsersRecent = newUsersRecent;
              setusersRecent(newUsersRecent);
            }
          }
        },
      );
      socketchat.on('server-response-messages-chat-group', messageContainer => {
        if (messageContainer) {
          let newFamilyGroup = {...gFamilyGroup};
          newFamilyGroup.messages = [
            ...newFamilyGroup.messages,
            messageContainer,
          ];
          gFamilyGroup = newFamilyGroup;
          setfamilyGroup(newFamilyGroup);
        }
      });
    }
  }, [socketchat]);
  function backButtonHandler() {
    socketchat.emit('leave-chat');
  }
  const reloadListRecent = useCallback(_usersRecent => {
    setusersRecentToShow(_usersRecent);
  });
  //override headerBackButton để close socketchat
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            socketchat.emit('leave-chat');
            navigation.goBack();
          }}
        />
      ),
    });
  }, []);
  //xử lí close socket khi ấn nút back của android
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, []);

  //đóng modal listmember
  const handleCloseModal = () => {
    setvisible(false);
  };

  //tạo tin nhắn mới với member chọn từ list member
  const handleAddNewChat = receiver => {
    if (gUsersRecent.length > 0) {
      let newUsersRecent = [...gUsersRecent, receiver];
      gUsersRecent = newUsersRecent;
      setusersRecent(newUsersRecent);
    } else {
      gUsersRecent = [...receiver];
      setusersRecent([...receiver]);
    }
    navigation.navigate('Chat', {
      socketchat: socketchat,
      receiver: receiver,
      usersActive: usersActive,
      usersRecent: gUsersRecent,
      tabPrev: 'recent',
      reloadListRecent: reloadListRecent,
    });
  };
  return (
    <Provider>
      <View style={{flex: 1}}>
        <Tabs
          swipeable={false}
          usePaged={false}
          tabs={[{title: 'Chat'}, {title: 'Đang hoạt động'}, {title: 'Nhóm'}]}>
          <View style={{height: '100%', backgroundColor: '#fff'}}>
            <View style={[styles.wrapper, {marginHorizontal: 20}]}>
              {usersRecent.length > 0 ? (
                <FlatList
                  data={usersRecent}
                  extraData={activeRow}
                  renderItem={({item, index}) => (
                    <Swipeout
                      left={[
                        {
                          onPress: () => {},
                          component: (
                            <View style={styles.item}>
                              <View
                                style={[
                                  styles.inItem,
                                  {backgroundColor: '#E94B3C'},
                                ]}>
                                <IconFill
                                  name="delete"
                                  style={{color: 'white', fontSize: 23}}
                                />
                              </View>
                            </View>
                          ),
                          backgroundColor: 'white',
                        },
                        {
                          onPress: () => {},
                          component: (
                            <View style={styles.item}>
                              <View
                                style={[
                                  styles.inItem,
                                  {backgroundColor: '#dbdbdb'},
                                ]}>
                                <IconFill
                                  name="phone"
                                  style={{color: '#4a4a4a', fontSize: 23}}
                                />
                              </View>
                            </View>
                          ),
                          backgroundColor: 'white',
                        },
                        {
                          onPress: () => {
                            //navigation.navigate('VideoCall');
                          },
                          component: (
                            <View style={styles.item}>
                              <View
                                style={[
                                  styles.inItem,
                                  {backgroundColor: '#dbdbdb'},
                                ]}>
                                <IconFill
                                  name="video-camera"
                                  style={{color: '#4a4a4a', fontSize: 23}}
                                />
                              </View>
                            </View>
                          ),
                          backgroundColor: 'white',
                        },
                      ]}
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
                          let newUsersRecent = [...usersRecent];
                          const lengthMessagesRecent =
                            newUsersRecent[index].messages.length;

                          if (lengthMessagesRecent !== 0) {
                            let lastMessage = {
                              ...newUsersRecent[index].messages[
                                lengthMessagesRecent - 1
                              ],
                            };

                            if (
                              lastMessage.seen === false &&
                              lastMessage.id !== user._id
                            ) {
                              lastMessage.seen = true;
                              newUsersRecent[index].messages[
                                lengthMessagesRecent - 1
                              ] = lastMessage;

                              setusersRecent(newUsersRecent);

                              // update tab active nếu có
                              let mSocketID = newUsersRecent[index].mSocketID;

                              if (usersActive.length !== 0 && mSocketID) {
                                const indexActive = usersActive.findIndex(
                                  element => element.mSocketID === mSocketID,
                                );

                                if (indexActive !== -1) {
                                  let newUsersActive = [...usersActive];
                                  newUsersActive[indexActive].messages =
                                    newUsersRecent[index].messages;

                                  setusersActive(newUsersActive);
                                }
                              }

                              //emit to server that server update state of last message is seen
                              let receiver = {...newUsersRecent[index]};
                              delete receiver.messages;
                              let sender = {...user, mID: user._id};
                              delete sender._id;
                              socketchat.emit('message-has-seen', {
                                sender,
                                receiver,
                                messageContainer: lastMessage,
                              });
                            }
                          }
                          navigation.navigate('Chat', {
                            socketchat: socketchat,
                            receiver: item,
                            usersRecent: usersRecent,
                            usersActive: usersActive,
                            tabPrev: 'recent',
                            reloadListRecent: reloadListRecent,
                          });
                        }}>
                        {item.messages.length > 0 ? (
                          <View
                            style={[styles.container, {alignItems: 'center'}]}>
                            <View style={styles.bgAvatar}>
                              <Image
                                source={{uri: item.mAvatar.image}}
                                style={styles.avatar}
                              />
                              {item.mSocketID ? (
                                <Image
                                  style={{
                                    backgroundColor: '#4ACD1F',
                                    width: 14,
                                    height: 14,
                                    borderRadius: 10,
                                    borderWidth: 2,
                                    borderColor: '#ffffff',
                                    position: 'absolute',
                                    left: 35,
                                    bottom: -2,
                                  }}
                                />
                              ) : null}
                            </View>
                            <View style={[styles.info]}>
                              <Text style={[styles.name]}>{item.mName}</Text>

                              {user.mName ===
                              item.messages[item.messages.length - 1].name ? (
                                <Text numberOfLines={1}>
                                  Bạn:{' '}
                                  {
                                    item.messages[item.messages.length - 1]
                                      .message
                                  }
                                </Text>
                              ) : item.messages[item.messages.length - 1]
                                  .seen ? (
                                <Text numberOfLines={1}>
                                  {
                                    item.messages[item.messages.length - 1]
                                      .message
                                  }
                                </Text>
                              ) : (
                                <Text
                                  numberOfLines={1}
                                  style={{fontWeight: 'bold'}}>
                                  {
                                    item.messages[item.messages.length - 1]
                                      .message
                                  }
                                </Text>
                              )}
                            </View>
                            <View style={[styles.bgSeen]}>
                              {user.mName ===
                              item.messages[item.messages.length - 1].name ? (
                                item.messages[item.messages.length - 1].seen ? (
                                  <Image
                                    source={{uri: item.mAvatar.image}}
                                    style={[styles.avatarSeen]}
                                  />
                                ) : (
                                  <Icon name="check-circle" size={18} />
                                )
                              ) : null}
                            </View>
                          </View>
                        ) : null}
                      </TouchableOpacity>
                    </Swipeout>
                  )}
                />
              ) : null}
            </View>
          </View>
          <View style={{height: '100%', backgroundColor: '#fff'}}>
            <View style={[styles.wrapper]}>
              {usersActive.length > 0 ? (
                <FlatList
                  data={usersActive}
                  renderItem={({item, index}) => (
                    <TouchableOpacity
                      onPress={() => {
                        console.log(item);
                        let newUsersActive = [...usersActive];
                        const lengthMessagesActive =
                          newUsersActive[index].messages.length;

                        if (lengthMessagesActive !== 0) {
                          let lastMessage = {
                            ...newUsersActive[index].messages[
                              lengthMessagesActive - 1
                            ],
                          };

                          if (
                            lastMessage.seen === false &&
                            lastMessage.id !== user._id
                          ) {
                            lastMessage.seen = true;
                            newUsersActive[index].messages[
                              lengthMessagesActive - 1
                            ] = lastMessage;
                            setusersActive(newUsersActive);

                            //update tab recent nếu có
                            const mID = newUsersActive[index].mID;

                            if (usersRecent.length !== 0 && mID) {
                              const indexRecent = usersRecent.findIndex(
                                element => element.mID === mID,
                              );

                              if (indexRecent !== -1) {
                                let newUsersRecent = [...usersRecent];
                                newUsersRecent[indexRecent].messages =
                                  newUsersActive[index].messages;
                                setusersRecent(newUsersRecent);
                              }
                            }

                            //emit to server that server update state of last message is seen
                            let receiver = {...newUsersActive[index]};
                            delete receiver.messages;
                            let sender = {...user, mID: user._id};
                            delete sender._id;
                            socketchat.emit('message-has-seen', {
                              sender,
                              receiver,
                              messageContainer: lastMessage,
                            });
                          }
                        }

                        navigation.navigate('Chat', {
                          socketchat: socketchat,
                          receiver: item,
                          usersActive: usersActive,
                          usersRecent: usersRecent,
                          tabPrev: 'active',
                          reloadListRecent: reloadListRecent,
                        });
                      }}>
                      <View
                        style={[
                          styles.container,
                          {flex: 1, flexDirection: 'row', marginLeft: 20},
                        ]}>
                        <View
                          style={[
                            styles.bgAvatar,
                            {flex: 1, flexDirection: 'row'},
                          ]}>
                          <Image
                            source={{uri: item.mAvatar.image}}
                            style={[styles.avatar, {width: 50, height: 50}]}
                          />
                          <Image
                            style={{
                              backgroundColor: '#4ACD1F',
                              width: 14,
                              height: 14,
                              borderRadius: 10,
                              borderWidth: 2,
                              borderColor: '#ffffff',
                              position: 'absolute',
                              left: 35,
                              bottom: -2,
                            }}
                          />
                        </View>
                        <View style={[styles.info, {marginLeft: 20}]}>
                          <Text style={styles.name}>{item.mName}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              ) : null}

              <View
                style={{
                  flexDirection: 'column-reverse',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  paddingBottom: 20,
                  paddingRight: 20,
                }}>
                <View style={{flexDirection: 'row-reverse'}}>
                  <TouchableOpacity
                    onPress={() => {
                      setvisible(true);
                    }}>
                    <Icon name="plus-circle" color="#0099ff" size={50} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          <View style={{height: '100%', backgroundColor: '#fff'}}>
            <View
              style={[styles.wrapper, {marginHorizontal: 20, marginTop: 25}]}>
              {familyGroup !== null ? (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Chat', {
                      socketchat: socketchat,
                      familyGroup: familyGroup,
                      tabPrev: 'group-chat',
                      reloadListRecent: reloadListRecent,
                    });
                  }}>
                  <View style={styles.container}>
                    <View style={styles.bgAvatar}>
                      <Image
                        source={{uri: familyGroup.fImage}}
                        style={[
                          styles.avatar,
                          {
                            borderRadius: 25,
                            marginTop: -23,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.info}>
                      <Text style={styles.name}>{familyGroup.fName}</Text>
                      {familyGroup.messages.length > 0 ? (
                        familyGroup.messages[familyGroup.messages.length - 1]
                          .id === user._id ? (
                          <Text numberOfLines={1}>
                            Bạn:{' '}
                            {
                              familyGroup.messages[
                                familyGroup.messages.length - 1
                              ].message
                            }
                          </Text>
                        ) : (
                          <Text numberOfLines={1}>
                            {
                              familyGroup.messages[
                                familyGroup.messages.length - 1
                              ].name
                            }
                            :{' '}
                            {
                              familyGroup.messages[
                                familyGroup.messages.length - 1
                              ].message
                            }
                          </Text>
                        )
                      ) : null}
                    </View>
                    <View style={styles.bgSeen}>
                      {/*
                  //đánh dấu seen
                  <Image
                    source={{uri: item.avatar}}
                    style={styles.avatarSeen}
                  />
                  //đánh dấu đã gửi
                  <Icon name="check-circle" style={{color: '#dbdbdb'}} /> */}
                      <Image
                        style={{
                          backgroundColor: '#0099FF',
                          width: 10,
                          height: 10,
                          borderRadius: 10,
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </Tabs>
        <Modal
          transparent={false}
          visible={visible}
          animationType="slide-up"
          onClose={handleCloseModal}
          title="Danh sách thành viên">
          <View style={{height: '100%', backgroundColor: 'white'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                }}
              />
              <View>
                <Text style={{fontSize: 18}}>Danh sách thành viên</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  paddingRight: 10,
                }}>
                <TouchableOpacity onPress={handleCloseModal}>
                  <Text style={{fontSize: 15, color: '#0099ff'}}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginVertical: 10,
                borderBottomColor: '#c2c2c2',
                borderBottomWidth: 1,
              }}
            />
            <View>
              <ScrollView>
                <FlatList
                  data={listMember}
                  renderItem={({item}) => {
                    if (item._id !== user._id) {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (usersRecent.length !== 0) {
                              const indexRecent = usersRecent.findIndex(
                                element => element.mID === item._id,
                              );
                              if (indexRecent !== -1) {
                                navigation.navigate('Chat', {
                                  socketchat: socketchat,
                                  receiver: usersRecent[indexRecent],
                                  usersActive: usersActive,
                                  usersRecent: usersRecent,
                                  tabPrev: 'recent',
                                  reloadListRecent: reloadListRecent,
                                });
                                return;
                              }
                            }
                            if (usersActive.length !== 0) {
                              const indexActive = usersActive.findIndex(
                                element => element.mID === item._id,
                              );
                              if (indexActive !== -1) {
                                navigation.navigate('Chat', {
                                  socketchat: socketchat,
                                  receiver: usersActive[indexActive],
                                  usersActive: usersActive,
                                  usersRecent: usersRecent,
                                  tabPrev: 'active',
                                  reloadListRecent: reloadListRecent,
                                });
                                return;
                              }
                            }
                            const newReceiver = {
                              fID: item.fID,
                              mAvatar: {
                                image: item.mAvatar.image,
                                color: item.mAvatar.color,
                              },
                              mID: item._id,
                              mName: item.mName,
                              mSocketID: '',
                              messages: [],
                            };
                            handleAddNewChat(newReceiver);
                          }}>
                          <View
                            style={[
                              styles.container,
                              {flex: 1, flexDirection: 'row', marginLeft: 20},
                            ]}>
                            <View
                              style={[
                                styles.bgAvatar,
                                {flex: 1, flexDirection: 'row'},
                              ]}>
                              <Image
                                source={{uri: item.mAvatar.image}}
                                style={[styles.avatar, {width: 50, height: 50}]}
                              />
                            </View>
                            <View style={[styles.info, {marginLeft: 20}]}>
                              <Text style={styles.name}>{item.mName}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
}
