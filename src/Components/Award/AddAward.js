/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  WingBlank,
  Flex,
  Icon,
  Button,
  // Toast,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Toast from 'react-native-root-toast';
export default function AwardList({route, navigation}) {
  const {token} = route.params;
  const [listMember, setlistMember] = useState(null);
  const [keyMember, setkeyMember] = useState([]);
  const [name, setname] = useState('haha');
  const [pts, setpts] = useState(0); // point
  const [err, seterr] = useState('');
  const handleCheckMember = index => {
    const i = keyMember.indexOf(index);
    if (i !== -1) {
      const t = keyMember;
      t.splice(i, 1);
      setkeyMember([...t]);
    } else {
      setkeyMember([...keyMember, index]);
    }
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
      setlistMember(t.listMembers);
    });
  };

  //add reward
  const handleAddReward = () => {
    const data = {
      name: name,
      points: pts,
      assign: keyMember,
    };
    return RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/add-reward',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        Toast.show('Tạo phần thưởng thành công!', {
          duration: 3000,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
        navigation.goBack();
      } else {
        seterr(t.message);
      }
    });
  };
  useEffect(() => {
    getlistMember();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView style={{paddingTop: 10}}>
        <WingBlank size="sm">
          <Card style={{padding: 10, marginHorizontal: 5, elevation: 5}}>
            <TextInput
              style={{fontSize: 20, textAlign: 'center'}}
              placeholder="Tên phần thưởng"
              onChangeText={value => {
                setname(value);
                seterr('');
              }}
            />
          </Card>
          <View
            style={{
              width: 250,
              backgroundColor: '#1979a9',
              margin: 5,
              alignSelf: 'center',
              borderRadius: 5,
              elevation: 5,
            }}>
            <Flex
              style={{
                justifyContent: 'flex-start',
                paddingHorizontal: 50,
              }}>
              <Icon name="star" size={25} color="white" />
              <TextInput
                keyboardType="numeric"
                style={{
                  fontSize: 18,
                  color: 'white',
                  width: 70,
                  textAlign: 'right',
                }}
                autoFocus
                // defaultValue={
                //   reminder !== -1 && reminder.toString()
                // }
                defaultValue="0"
                placeholder="0"
                onChangeText={() => {
                  seterr('');
                }}
                onEndEditing={e => {
                  if (!isNaN(parseInt(e.nativeEvent.text, 10))) {
                    let t = parseInt(e.nativeEvent.text, 10);
                    seterr('');
                    setpts(t);
                  } else {
                    seterr('Vui lòng nhập điểm thưởng hợp lệ!');
                  }
                }}
              />
              <Text style={{fontSize: 18, color: 'white', marginBottom: 2}}>
                điểm
              </Text>
            </Flex>
          </View>
          <Card style={{padding: 10, marginHorizontal: 5, elevation: 5}}>
            <Flex>
              <Icon name="team" color="black" size="md" />
              <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                Thành viên
              </Text>
            </Flex>
            {listMember === null ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  padding: 10,
                }}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <Flex justify="start" style={{marginTop: 10}} wrap="wrap">
                {listMember.map(item => (
                  <Flex direction="column" style={{margin: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckMember(item._id);
                        seterr('');
                      }}>
                      <Image
                        style={
                          keyMember.indexOf(item._id) !== -1
                            ? {
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                borderColor: '#0099FF',
                                borderWidth: 3,
                                opacity: item.mAvatar.color ? 0.6 : 1,
                                backgroundColor: item.mAvatar.color,
                              }
                            : {
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                borderColor: 'gray',
                                borderWidth: 2,
                                opacity: item.mAvatar.color ? 0.6 : 1,
                                backgroundColor: item.mAvatar.color,
                              }
                        }
                        source={{uri: item.mAvatar.image}}
                        id={item._id}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text numberOfLines={1} style={{maxWidth: 62}}>
                        {item.mName}
                      </Text>
                    </View>
                  </Flex>
                ))}
              </Flex>
            )}
          </Card>
          {err !== '' && (
            <Text style={{color: 'red', fontSize: 17, margin: 10}}>{err}</Text>
          )}
          <Button
            type="primary"
            style={{margin: 10, width: 250, alignSelf: 'center'}}
            onPress={() => {
              if (name !== '') {
                if (pts <= 0 || pts === '') {
                  seterr(
                    'Điểm thưởng không hợp lệ! (Điểm là số dương và không để trống)',
                  );
                } else {
                  handleAddReward();
                }
              } else {
                seterr('Tên phần thưởng không được để trống!');
              }
            }}>
            Thêm
          </Button>
        </WingBlank>
      </ScrollView>
    </View>
  );
}
