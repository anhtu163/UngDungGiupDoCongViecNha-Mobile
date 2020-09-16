/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {
  Flex,
  Badge,
  Card,
  Icon,
  Provider,
  // Toast,
} from '@ant-design/react-native';
import {IconFill} from '@ant-design/icons-react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import {ScrollView} from 'react-native-gesture-handler';
import NewsItem from './NewsItem';

export default function FamilyMain({navigation, route}) {
  console.disableYellowBox = true;

  const {token} = route.params;
  //const {user} = route.params;
  const {socket} = route.params;
  const [listMember, setlistMember] = useState(null);
  const [listNews, setlistNews] = useState(null);
  const [user, setuser] = useState('');
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
  const isAdmin = user.mIsAdmin;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginTop: 20,
      margin: 5,
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });
  const getlistMember = () => {
    RNFetchBlob.fetch(
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
  const getlistNews = () => {
    RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-news',
      {
        Authorization: 'Bearer ' + token,
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      // console.log(t);
      setlistNews(t.listNews);
    });
  };
  useEffect(() => {
    getlistNews();
  }, []);
  useEffect(() => {
    getlistMember();
  }, []);
  useEffect(() => {
    //console.log(socket);
    if (socket) {
      socket.on('Member', data => {
        console.log(data);
        getlistNews();
        getlistMember();
        //getlistNews();
      });
      socket.on('News', data => {
        console.log(data);
        getlistNews();
      });
      socket.on('Family', data => {
        console.log(data);
        getlistNews();
      });
      socket.on('Task', data => {
        console.log(data);
        getlistNews();
      });
      socket.on('Task Category', data => {
        console.log(data);
        getlistNews();
      });
      socket.on('Event', data => {
        console.log(data);
        getlistNews();
      });
    }
  });
  //console.log(socket);
  return (
    <Provider>
      <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{marginTop: 10, margin: 5, backgroundColor: 'white'}}>
          <Card style={{padding: 5, elevation: 10}}>
            <Flex>
              <Flex.Item>
                <Flex
                  style={{
                    flex: 1,
                    alignContent: 'center',
                  }}>
                  <Icon
                    name="team"
                    color="#0099FF"
                    // size="md"
                    style={{
                      fontSize: 26,
                      marginLeft: 5,
                    }}
                  />
                  <Text
                    style={{
                      color: '#0099FF',
                      fontWeight: 'bold',
                      fontSize: 16,
                      marginLeft: 5,
                      padding: 6,
                    }}>
                    Thành viên gia đình
                  </Text>
                </Flex>
              </Flex.Item>
              {isAdmin && (
                <View
                  style={{
                    marginRight: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddMember', {
                        getlistMember: getlistMember,
                      })
                    }>
                    <Icon name="plus-circle" color="#0099FF" />
                  </TouchableOpacity>
                </View>
              )}
            </Flex>
          </Card>
          <Card style={{padding: 5, marginTop: 5, elevation: 10}}>
            {listMember === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <Flex
                justify="start"
                style={{marginTop: 15, margin: 5, padding: 5}}
                wrap="wrap">
                {listMember.map(item => (
                  <Flex
                    direction="column"
                    style={{margin: 5, marginLeft: 10}}
                    onPress={() => {
                      // console.log(item);
                      // console.log('++++++' + user);
                      //xử lí khi ấn chọn avatar trên list sẽ chuyển đến trang thông tin member
                      if (item._id !== user._id) {
                        navigation.navigate('MemberInformation', {
                          inforMember: item,
                        });
                      } else {
                        navigation.navigate('Account');
                      }
                    }}>
                    <Badge
                      text={item.mPoints || '0'}
                      overflowCount={parseInt(item.mPoints, 10) + 5}>
                      <Image
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 25,
                          borderColor: 'gray',
                          borderWidth: 2,
                          opacity: item.mAvatar.color ? 0.4 : 1,
                          backgroundColor: item.mAvatar.color,
                        }}
                        source={{uri: item.mAvatar.image}}
                        id={item._id}
                      />
                    </Badge>
                    <View>
                      <Text numberOfLines={1} style={{maxWidth: 60}}>
                        {item.mName}
                      </Text>
                    </View>
                  </Flex>
                ))}
              </Flex>
            )}
          </Card>

          <Card style={{padding: 5, marginTop: 5, elevation: 10}}>
            <Flex>
              <Flex.Item>
                <Flex
                  style={{
                    flex: 1,
                    alignContent: 'center',
                  }}>
                  <IconFill
                    name="notification"
                    color="#0099FF"
                    style={{
                      marginTop: 5,
                      marginLeft: 5,
                      marginBottom: 5,
                      fontSize: 26,
                    }}
                  />
                  <Text
                    style={{
                      color: '#0099FF',
                      fontWeight: 'bold',
                      fontSize: 16,
                      marginTop: 5,
                      marginLeft: 15,
                      marginBottom: 5,
                    }}>
                    Bảng tin gia đình
                  </Text>
                </Flex>
              </Flex.Item>
            </Flex>
          </Card>
          <View style={{}}>
            {listNews === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <View>
                {listNews.map(item => (
                  <NewsItem
                    id={item._id}
                    owner={item.mID}
                    content={item.content}
                    date={item.date}
                    subject={item.subject}
                    isAdmin={isAdmin}
                    token={token}
                    getlistNews={getlistNews}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
}
