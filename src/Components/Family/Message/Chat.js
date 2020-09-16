/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  Text,
  View,
  Animated,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {TypingAnimation} from 'react-native-typing-animation';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {Flex} from '@ant-design/react-native';
import 'dayjs/locale/vi';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import socketIOClient from 'socket.io-client';
import {
  GiftedChat,
  InputToolbar,
  Composer,
  MessageContainer,
} from 'react-native-gifted-chat';
import {HeaderBackButton, HeaderBackground} from '@react-navigation/stack';
import {Icon} from '@ant-design/react-native';
import IconVI from 'react-native-vector-icons/FontAwesome';
//đã load được tin nhắn trên mongoDB
export default function Chat({navigation, route}) {
  const {user, socketchat, reloadListRecent, tabPrev} = route.params; //receiver là người nhận tin nhắn
  let {usersActive, receiver, usersRecent, familyGroup} = route.params;
  const [collapse, setcollapsed] = useState(false); //collapse & visible này chỉ setState ẩn hiện nút >, để show button gửi ảnh hay chụp hình thôi
  const [visible, setvisible] = useState(true); //kệ 2 cái này là được
  const [isSeen, setisSeen] = useState(false);
  const [userIsTyping, setuserIsTyping] = useState(false);
  const [userIsEnteringGroup, setuserIsEnteringGroup] = useState(null);
  const ref = useRef();
  let isFocused;
  //reloaddata send back
  function handleGoBack() {
    navigation.goBack();
    reloadListRecent(receiver);
    return true;
  }

  //override headerBackButton
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            reloadListRecent(receiver);
            navigation.goBack();
          }}
        />
      ),
    });
  }, []);
  //xử lí khi ấn nút back của android
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleGoBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleGoBack);
    };
  });

  useFocusEffect(
    React.useCallback(() => {
      isFocused = true;
      // Do something when the screen is focused
      return () => {
        isFocused = false;
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  const [messages, setmessages] = useState([]);
  function parseDataMessage(messagesInd) {
    let resMess = [];
    messagesInd.reverse().map(message => {
      const itemMess = {
        _id: Math.round(Math.random() * 1000000),
        text: message.message,
        user: {
          _id: message.id,
          name: message.name,
          avatar: message.avatar.image,
          color: message.avatar.color,
        },
        isSeen: message.seen,
      };
      //resMess.push(itemMess);
      resMess = [...resMess, itemMess];
    });
    return resMess;
  }
  //load list tin nhắn ban đầu
  useEffect(() => {
    //setuserIsTyping(true);
    console.log(receiver);
    if (tabPrev === 'recent') {
      const receiverFromRecent = usersRecent.filter(
        item => receiver.mID === item.mID,
      )[0];
      const listMessage = parseDataMessage([...receiverFromRecent.messages]);
      setmessages(listMessage);
    } else if (tabPrev === 'active') {
      const receiverFromActive = usersActive.filter(
        item => receiver.mID === item.mID,
      )[0];
      const listMessage1 = parseDataMessage([...receiverFromActive.messages]);
      setmessages(listMessage1);
    } else {
      const listMessageGroup = parseDataMessage([...familyGroup.messages]);
      setmessages(listMessageGroup);
    }
  }, [usersRecent, receiver, usersActive, familyGroup]);

  //load danh sách tin nhắn để hiển thị, khi user gửi 1 tin nhắn mới
  useEffect(() => {
    ref.current = messages;
    //console.log(messages);

    if (tabPrev !== 'group-chat' && messages.length > 0) {
      if (messages[0].user._id === user._id)
        if (messages[0].isSeen) setisSeen(true);
        else setisSeen(false);
      else setisSeen(false);
    }
  }, [messages]);

  useEffect(() => {
    if (userIsTyping) console.log('nó đang gõ tin kìa!');
    else console.log('nó dừng gõ tin ròi!');
  }, [userIsTyping]);
  function seenMessage(sender, receiver, messageContainer) {
    socketchat.emit('message-has-seen', {
      sender,
      receiver,
      messageContainer,
    });
    console.log('emit seen');
  }

  useEffect(() => {
    if (socketchat) {
      if (tabPrev === 'recent' || tabPrev === 'active') {
        socketchat.on(
          'server-response-message-chat-single',
          ({sender, messageContainer}) => {
            console.log('nhận tin nhắn chat');
            console.log('isFocusedchat' + isFocused);

            if (sender.mID === receiver.mID) {
              if (isFocused === true) {
                const indexActive = usersActive.findIndex(
                  element => sender.mID === element.mID,
                );
                const indexRecent = usersRecent.findIndex(
                  element => sender.mID === element.mID,
                );
                let receiverTemp = {...receiver};
                delete receiverTemp.messages;
                const senderResponse = {...user, mID: user._id};
                delete senderResponse._id;
                seenMessage(senderResponse, receiverTemp, messageContainer);
                if (indexActive !== -1) {
                  let newUsersActive = [...usersActive];
                  const lengthMessage =
                    newUsersActive[indexActive].messages.length;
                  newUsersActive[indexActive].messages[
                    lengthMessage - 1
                  ].seen = true;
                  usersActive = newUsersActive;
                }

                if (indexRecent !== -1) {
                  let newUsersRecent = [...usersRecent];
                  const length = newUsersRecent[indexRecent].messages.length;
                  newUsersRecent[indexRecent].messages[length - 1].seen = true;
                  usersRecent = newUsersRecent;
                }

                const message = {
                  _id: Math.round(Math.random() * 1000000),
                  text: messageContainer.message,
                  user: {
                    _id: sender.mID,
                    avatar: sender.mAvatar.image,
                    name: messageContainer.name,
                    color: sender.mAvatar.color,
                  },
                  isSeen: true,
                };
                setmessages(GiftedChat.append(ref.current, message));
              }
            }
          },
        );
        socketchat.on(
          'server-response-message-has-seen',
          ({sender, messageContainer}) => {
            console.log('response seen message from chat');
            let messagesIsSeen = [...ref.current];
            if (
              messagesIsSeen.length > 0 &&
              messagesIsSeen[0].user._id === user._id
            ) {
              messagesIsSeen[0].isSeen = true;
              setmessages(messagesIsSeen);
            }
          },
        );
        socketchat.on('server-response-user-is-entering-to-partner', sender => {
          if (sender.mID === receiver.mID) {
            if (isFocused === true) {
              setuserIsTyping(true);
            }
          }
        });

        socketchat.on(
          'server-response-user-is-stoped-entering-to-partner',
          sender => {
            if (sender.mID === receiver.mID) {
              if (isFocused === true) {
                setuserIsTyping(false);
              }
            }
          },
        );
      } else {
        socketchat.on(
          'server-response-messages-chat-group',
          messageContainer => {
            if (messageContainer && messageContainer.id !== user._id) {
              const message = {
                _id: Math.round(Math.random() * 1000000),
                text: messageContainer.message,
                user: {
                  _id: messageContainer.id,
                  avatar: messageContainer.avatar.image,
                  name: messageContainer.name,
                  color: messageContainer.avatar.color,
                },
                isSeen: true,
              };
              setmessages(GiftedChat.append(ref.current, message));
            }
          },
        );
        socketchat.on('server-response-user-is-entering-to-group', sender => {
          setuserIsEnteringGroup(sender);
        });

        socketchat.on(
          'server-response-user-is-stoped-entering-to-group',
          sender => {
            setuserIsEnteringGroup(null);
          },
        );
      }
    }
  }, [socketchat]);
  function handleSendNotificationIsEntering(text, receiver, sender) {
    if (text !== '')
      socketchat.emit('client-notification-is-entering', {
        sender,
        receiver,
      });
    else
      socketchat.emit('client-notification-is-stoped-entering', {
        sender,
        receiver,
      });
  }
  function sendMessage(receiver, sender, messageContainer) {
    socketchat.emit('client-send-message', {
      receiver: receiver,
      sender: sender,
      messageContainer: messageContainer,
    });
  }
  function sendMessageGroup(member, messageContainer) {
    socketchat.emit('client-send-message-to-chat-group', {
      member,
      messageContainer,
    });
  }
  const onSend = (messages2 = []) => {
    console.log(messages2);
    const messageContainer = {
      seen: false,
      id: user._id,
      name: user.mName,
      message: messages2[0].text,
      avatar: {image: user.mAvatar.image, color: user.mAvatar.color},
    };
    let sender = {...user, mID: user._id};
    delete sender._id;
    if (tabPrev === 'group-chat') {
      sendMessageGroup(sender, messageContainer);
      if (familyGroup) {
        let newFamilyGroup = {...familyGroup};
        newFamilyGroup.messages = [
          ...newFamilyGroup.messages,
          messageContainer,
        ];
        familyGroup = newFamilyGroup;
      }
    } else {
      let receiver1 = {...receiver};
      delete receiver1.messages;
      sendMessage(receiver1, sender, messageContainer);

      if (usersActive) {
        const indexActive = usersActive.findIndex(
          element => element.mID === receiver.mID,
        );
        if (indexActive !== -1) {
          let newUsersActive = [...usersActive];
          newUsersActive[indexActive].messages = [
            ...newUsersActive[indexActive].messages,
            messageContainer,
          ];

          usersActive = newUsersActive;
        }
      }
      if (usersRecent) {
        const indexRecent = usersRecent.findIndex(
          element => element.mID === receiver.mID,
        );
        if (indexRecent !== -1) {
          let newUsersRecent = [...usersRecent];
          newUsersRecent[indexRecent].messages = [
            ...newUsersRecent[indexRecent].messages,
            messageContainer,
          ];

          usersRecent = newUsersRecent;
        }
      }
    }
    const message = {
      _id: messages2[0]._id,
      text: messages2[0].text,
      user: {
        _id: messages2[0].user._id,
        avatar: messages2[0].user.avatar,
        name: messages2[0].user.name,
        color: user.mAvatar.color,
      },
      isSeen: false,
    };
    setmessages(GiftedChat.append(ref.current, message));
  };
  return (
    <View style={{backgroundColor: '#ffffff', flex: 1}}>
      <GiftedChat
        showUserAvatar={true}
        messages={messages}
        onSend={onSend}
        placeholder="Nhập tin nhắn..."
        extraData={{userIsTyping, userIsEnteringGroup, isSeen}}
        isTyping={true}
        //hàm hiển thị phần dưới cùng body message, sẽ show khi người nhận nhập tin nhắn
        renderFooter={props => {
          const _userIsTyping = props.extraData.userIsTyping;
          const _userIsEnteringGroup = props.extraData.userIsEnteringGroup;
          const _isSeen = props.extraData.isSeen;
          return (
            <Flex
              style={{
                marginTop: -5,
                marginLeft: 10,
                marginRight: 10,
                marginBottom: 10,
                flexDirection: 'row-reverse',
              }}>
              {tabPrev === 'group-chat' ? (
                _userIsEnteringGroup !== null &&
                _userIsEnteringGroup.mID !== user._id ? (
                  <Flex.Item>
                    <Flex>
                      <Image
                        source={{uri: _userIsEnteringGroup.mAvatar.image}}
                        style={
                          _userIsEnteringGroup.mAvatar.color
                            ? {
                                borderRadius: 25,
                                width: 38,
                                height: 38,
                                backgroundColor:
                                  _userIsEnteringGroup.mAvatar.color,
                              }
                            : {
                                borderRadius: 25,
                                width: 38,
                                height: 38,
                              }
                        }
                      />
                      <View
                        style={{
                          backgroundColor: '#ebebeb',
                          width: 42,
                          alignSelf: 'flex-end',
                          marginLeft: 9,
                          borderRadius: 25,
                          paddingHorizontal: 7,
                          paddingTop: 10,
                          height: 32,
                        }}>
                        <TypingAnimation
                          dotColor="#595959"
                          dotMargin={5}
                          dotAmplitude={3}
                          dotSpeed={0.35}
                          dotRadius={2.5}
                        />
                      </View>
                    </Flex>
                  </Flex.Item>
                ) : null
              ) : _userIsTyping ? (
                <Flex.Item>
                  <Flex>
                    <Image
                      source={{uri: receiver.mAvatar.image}}
                      style={
                        receiver.mAvatar.color
                          ? {
                              borderRadius: 25,
                              width: 38,
                              height: 38,
                              backgroundColor: receiver.mAvatar.color,
                            }
                          : {
                              borderRadius: 25,
                              width: 38,
                              height: 38,
                            }
                      }
                    />
                    <View
                      style={{
                        backgroundColor: '#ebebeb',
                        width: 42,
                        alignSelf: 'flex-end',
                        marginLeft: 9,
                        borderRadius: 25,
                        paddingHorizontal: 7,
                        paddingTop: 10,
                        height: 32,
                      }}>
                      <TypingAnimation
                        dotColor="#595959"
                        dotMargin={5}
                        dotAmplitude={3}
                        dotSpeed={0.35}
                        dotRadius={2.5}
                      />
                    </View>
                  </Flex>
                </Flex.Item>
              ) : _isSeen ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: '#595959',
                  }}>
                  Đã xem
                </Text>
              ) : null}
            </Flex>
          );
        }}
        //hàm xử lí máy icon button gửi ảnh, v.v mé trái chat input
        renderActions={props => {
          return (
            <View
              style={{
                flexDirection: 'row',
                paddingBottom: 12,
                alignItems: 'center',
              }}>
              <Collapse
                onToggle={isCollapsed => {
                  setcollapsed(isCollapsed);
                  setvisible(false);
                }}
                isCollapsed={collapse}
                style={{flexDirection: 'row', paddingLeft: 7}}>
                <CollapseHeader>
                  {visible ? (
                    <Icon
                      name="right"
                      size={25}
                      style={{
                        color: '#0099ff',
                      }}
                    />
                  ) : (
                    <View />
                  )}
                </CollapseHeader>
                <CollapseBody>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity activeOpacity={0.5}>
                      <Animated.View>
                        <Icon
                          name="picture"
                          size={25}
                          style={{
                            color: '#0099ff',
                            paddingLeft: 5,
                            paddingRight: 10,
                          }}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}>
                      <Animated.View>
                        <Icon
                          name="camera"
                          size={25}
                          style={{
                            color: '#0099ff',
                          }}
                        />
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </CollapseBody>
              </Collapse>
            </View>
          );
        }}
        //xử lí khi đang nhập tin nhắn
        onInputTextChanged={text => {
          setcollapsed(false);
          setvisible(true);
          let _receiver;
          if (tabPrev !== 'group-chat') _receiver = {...receiver};
          else _receiver = {...familyGroup};
          delete _receiver.messages;
          let sender = {...user, mID: user._id};
          delete sender._id;
          handleSendNotificationIsEntering(text, _receiver, sender);
        }}
        //chỗ này chỉ thay đổi style khung chat thôi, chẳng làm gì đến nó
        renderInputToolbar={props => {
          //Add the extra styles via containerStyle
          return (
            <InputToolbar
              {...props}
              containerStyle={{paddingTop: 4, borderTopColor: '#a3a3a3'}}
            />
          );
        }}
        //style khung "Nhập tin nhắn..."
        renderComposer={props => {
          return (
            <Composer
              {...props}
              textInputStyle={{
                backgroundColor: '#ebebeb',
                borderRadius: 25,
                paddingHorizontal: 10,
              }}
            />
          );
        }}
        locale={'vi'} //locale để tự động set creatAt theo giwof Việt Nam
        maxComposerHeight={100}
        //hàm xử lí action & style icon gửi tin nhắn
        renderSend={props => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (props.text !== '') {
                  props.onSend({text: props.text}, true);
                }
              }}>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingBottom: 12,
                }}>
                <IconVI name="send" color="#0099FF" size={26} />
              </View>
            </TouchableOpacity>
          );
        }}
        renderAvatar={props => {
          return (
            <Image
              source={{uri: props.currentMessage.user.avatar}}
              style={
                props.currentMessage.user.color
                  ? {
                      borderRadius: 25,
                      width: 38,
                      height: 38,
                      backgroundColor: props.currentMessage.user.color,
                    }
                  : {
                      borderRadius: 25,
                      width: 38,
                      height: 38,
                    }
              }
            />
          );
        }}
        //user: thiết lập vùng hiển thị tin nhắn của user,
        //nếu _id trong list messages === _id trong user, tin nhắn sẽ là của user và hiện sang phải màn hình
        //và ngược lại, have a nice day :'(
        user={{
          _id: user._id,
          name: user.mName,
          avatar: user.mAvatar.image,
          color: user.mAvatar.color,
        }}
      />
    </View>
  );
}
