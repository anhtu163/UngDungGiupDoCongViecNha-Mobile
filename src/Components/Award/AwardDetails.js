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
  Switch,
} from 'react-native';
import {
  Card,
  WingBlank,
  Flex,
  Icon,
  Button,
  Modal,
  Provider,
} from '@ant-design/react-native';
import Toast from 'react-native-root-toast';
import RNFetchBlob from 'react-native-fetch-blob';
export default function AwardDetails({route, navigation}) {
  const {token, award, user} = route.params;
  const [listMember, setlistMember] = useState(null);
  const [keyMember, setkeyMember] = useState([]);
  const [name, setname] = useState(award.name);
  const [pts, setpts] = useState(award.points); // point
  const [err, seterr] = useState('');
  //chọn assign
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
  //delete award
  const handleDeleteAward = () => {
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
          duration: 3000,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
        navigation.goBack();
      } else {
        seterr(`Xảy ra lỗi! ${t.message}`);
      }
    });
  };
  //edit award
  const handleEditAward = () => {
    const data = {
      rID: award._id,
      name: name,
      points: pts,
      assign: keyMember,
    };
    return RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/edit-reward',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        Toast.show(`Cập nhật phần thưởng ${award.name} thành công!`, {
          duration: 3000,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
        navigation.goBack();
      } else {
        seterr(`Xảy ra lỗi! ${t.message}`);
      }
    });
  };
  useEffect(() => {
    getlistMember();
    if (award.assign !== null) {
      let temp = [];
      award.assign.map(item => {
        temp.push(item._id);
      });
      setkeyMember(temp);
    }
  }, []);
  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView style={{paddingTop: 10}}>
          <WingBlank size="sm">
            {/*tên phần thưởng*/}
            <Card style={{padding: 10, marginHorizontal: 5, elevation: 5}}>
              <TextInput
                style={{fontSize: 20, textAlign: 'center'}}
                placeholder="Tên phần thưởng"
                defaultValue={name}
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
                  defaultValue={pts.toString()}
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
            {/*card chọn assign */}
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
              ) : keyMember === null ? null : (
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

            {/*card list member theo dõi phần thưởng này */}
            {award.followers.length > 0 ? (
              <Card style={{padding: 10, marginHorizontal: 5, marginTop: 5}}>
                <Flex>
                  <Icon name="team" color="black" size="md" />
                  <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                    Đang theo dõi
                  </Text>
                </Flex>
                <Flex justify="start" style={{marginTop: 10}} wrap="wrap">
                  {award.followers.map(item => (
                    <Flex direction="column" style={{margin: 5}}>
                      <Image
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: 25,
                          borderWidth: 0.5,
                        }}
                        source={{uri: item.mAvatar.image}}
                        id={item._id}
                      />
                      <View>
                        <Text numberOfLines={1} style={{maxWidth: 62}}>
                          {item.mName}
                        </Text>
                      </View>
                    </Flex>
                  ))}
                </Flex>
              </Card>
            ) : null}

            {err !== '' && (
              <Text style={{color: 'red', fontSize: 17, margin: 10}}>
                {err}
              </Text>
            )}
            {user.mIsAdmin === true ? (
              <Flex justify="center">
                <Button
                  full
                  type="warning"
                  style={{margin: 5, marginTop: 10, width: '45%'}}
                  onPress={() => {
                    Modal.alert(
                      'Xóa phần thưởng',
                      'Bạn đồng ý xóa phần thưởng này?',
                      [
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
                            console.log('Xóa');
                            handleDeleteAward();
                          },
                        },
                      ],
                    );
                  }}>
                  Xóa
                </Button>
                <Button
                  full
                  type="primary"
                  style={{margin: 5, marginTop: 10, width: '45%'}}
                  onPress={() => {
                    if (name !== '') {
                      if (pts <= 0 || pts === '') {
                        seterr(
                          'Điểm thưởng không hợp lệ! (Điểm là số dương và không để trống)',
                        );
                      } else {
                        handleEditAward();
                      }
                    } else {
                      seterr('Tên phần thưởng không được để trống!');
                    }
                  }}>
                  Lưu thay đổi
                </Button>
              </Flex>
            ) : null}
          </WingBlank>
        </ScrollView>
      </View>
    </Provider>
  );
}
