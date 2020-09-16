/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import RNFetchBlob from 'react-native-fetch-blob';
import {Flex, Icon} from '@ant-design/react-native';
import {IconFill} from '@ant-design/icons-react-native';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import FamilyMain from './FamilyMain';
import AddMember from './AddMember';
import Setting from './Setting';
import Account from '../Account/Account';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import FamilyInformation from './FamilyInformation';
import MemberInformation from './MemberInformation';
import MessageMain from './Message/MessageMain'; //import chat từ đây
import styles from './Message/Styles';
import Chat from './Message/Chat';
import socketIOClient from 'socket.io-client';
//import ListMember from './Message/ListMember'; //đến đây, thêm headerRight familyMain, chuyển screens chat ở phần dưới cùng
export default function Family(props) {
  const token = props.token;
  const AuthContext = props.AuthContext;
  const socket = props.socket;
  const Stack = createStackNavigator();
  const [user, setuser] = useState({});

  //thiết lập socket chat
  let socketchat;
  const [skc, setskc] = useState(null);
  const ENDPOINTCHAT = 'https://chat-by-socket-server.herokuapp.com/';
  useEffect(() => {
    socketchat = socketIOClient(ENDPOINTCHAT);
    //socketchat.emit('join', user);
    setskc(socketchat);
    //console.log('---------------');
    //console.log(skc);
  }, []);

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
  //console.log(user);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="FamilyMain"
          component={FamilyMain}
          initialParams={{
            token: token,
            AuthContext: AuthContext,
            user: user,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon name="home" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Quản lý gia đình
                </Text>
              </Flex>
            ),
            headerRight: () => (
              <Flex>
                {/*icon chuyển đến messages */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('MessageMain', {
                      socketchat: skc,
                    })
                  }>
                  <Icon
                    name="message"
                    color="#0099FF"
                    size={28}
                    style={{marginRight: 15}}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Setting', {socket: socket})
                  }>
                  <Icon
                    name="setting"
                    color="#0099FF"
                    size={28}
                    style={{marginRight: 15}}
                  />
                </TouchableOpacity>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="AddMember"
          component={AddMember}
          initialParams={{token: token}}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon name="user" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Thêm thành viên
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="Setting"
          component={Setting}
          initialParams={{
            token: token,
            AuthContext: AuthContext,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon name="setting" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>Cài đặt</Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          initialParams={{token: token, user: user, AuthContext: AuthContext}}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon name="user" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Thông tin tài khoản
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={({navigation}) => ({
            // eslint-disable-next-line react/jsx-no-undef
            headerTitle: () => (
              <Flex>
                <Icon name="lock" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Đặt lại mật khẩu
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="FamilyInformation"
          component={FamilyInformation}
          initialParams={{token: token, user: user}}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon name="user" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Thông tin thành viên
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="MemberInformation"
          component={MemberInformation}
          initialParams={{token: token, user: user}}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon name="home" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Quản lí thông tin gia đình
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          initialParams={{
            token: token,
            AuthContext: AuthContext,
            user: user,
          }}
          options={({route, navigation}) => ({
            headerRight: () => (
              <Flex>
                <TouchableOpacity>
                  <IconFill
                    name="phone"
                    color="#0099FF"
                    size={25}
                    style={{marginRight: 20}}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <IconFill
                    name="video-camera"
                    color="#0099FF"
                    size={25}
                    style={{marginRight: 10}}
                  />
                </TouchableOpacity>
                <Image
                  style={{
                    backgroundColor: '#4ACD1F',
                    width: 7,
                    height: 7,
                    borderRadius: 10,
                    marginRight: 20,
                  }}
                />
              </Flex>
            ),
            headerTitle: () => (
              <Flex justify="start">
                {route.params.tabPrev === 'group-chat' ? (
                  <View
                    style={{flex: 1, flexDirection: 'row', marginLeft: -20}}>
                    <View style={(styles.bgAvatar, {marginTop: 4})}>
                      <Image
                        source={{uri: route.params.familyGroup.fImage}}
                        style={[styles.avatar, {width: 40, height: 40}]}
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
                          right: 0,
                          bottom: 0,
                        }}
                      />
                    </View>
                    <View style={{alignSelf: 'center'}}>
                      <Text style={{fontSize: 20, marginLeft: 15}}>
                        {route.params.familyGroup.fName}
                      </Text>
                    </View>
                  </View>
                ) : // route.params.usersActive.filter(
                //     element => element.mID === route.params.receiver.mID,
                //   ).length > 0
                route.params.receiver.mSocketID &&
                  route.params.receiver.mSocketID !== '' ? (
                  <View
                    style={{flex: 1, flexDirection: 'row', marginLeft: -20}}>
                    <View style={(styles.bgAvatar, {marginTop: 4})}>
                      <Image
                        source={{uri: route.params.receiver.mAvatar.image}}
                        style={[styles.avatar, {width: 40, height: 40}]}
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
                          right: 0,
                          bottom: 7,
                        }}
                      />
                    </View>
                    <View style={{alignSelf: 'center'}}>
                      <Text style={{fontSize: 20, marginLeft: 15}}>
                        {route.params.receiver.mName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginLeft: 15,
                          color: '#a3a3a3',
                        }}>
                        Đang hoạt động
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{flex: 1, flexDirection: 'row', marginLeft: -20}}>
                    <View style={(styles.bgAvatar, {marginTop: 4})}>
                      <Image
                        source={{uri: route.params.receiver.mAvatar.image}}
                        style={[styles.avatar, {width: 40, height: 40}]}
                      />
                    </View>
                    <View style={{alignSelf: 'center'}}>
                      <Text style={{fontSize: 20, marginLeft: 15}}>
                        {route.params.receiver.mName}
                      </Text>
                    </View>
                  </View>
                )}
              </Flex>
            ),
          })}
        />

        {/*chuyển màn hình trong chat từ đây */}
        <Stack.Screen
          name="MessageMain"
          component={MessageMain}
          initialParams={{
            token: token,
            user: user,
            AuthContext: AuthContext,
            socketchat: skc,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex justify="start">
                <Icon name="message" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>Tin nhắn</Text>
              </Flex>
            ),
          })}
        />

        {/* <Stack.Screen
          name="ListMember"
          component={ListMember}
          initialParams={{
            token: token,
            AuthContext: AuthContext,
            user: user,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex justify="start">
                <Icon name="user" style={{color: '#0099FF'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Thành viên trong gia đình
                </Text>
              </Flex>
            ),
          })}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
