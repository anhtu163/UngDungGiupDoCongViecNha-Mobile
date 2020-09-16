/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Flex,
  WhiteSpace,
  Icon,
  WingBlank,
  Button,
  InputItem,
} from '@ant-design/react-native';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-root-toast';
export default function FamilyInformation({navigation, route}) {
  const {token} = route.params;
  const {user} = route.params;
  const {getUser} = route.params;
  const [listMember, setlistMember] = useState(null);
  const [name, setname] = useState('');
  const [loading, setLoading] = useState(null);
  const [err, seterr] = useState(null);
  const [collapsed, setcollapsed] = useState(false);
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [image, setImage] = useState({
    uri: 'http://getdrawings.com/free-icon-bw/gta-v-icon-22.jpg',
  });
  const YOUR_CLOUDINARY_NAME = 'datn22020';
  const YOUR_CLOUDINARY_PRESET = 'DATN_HouseHelperApp_Image';
  const pickImageHandler = () => {
    if (user.mIsAdmin !== true) {
      return;
    }
    const options = {
      title: 'Chọn hình ảnh',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, res => {
      if (res.didCancel) {
        console.log('User cancelled!');
      } else if (res.error) {
        console.log('Error', res.error);
      } else {
        // setImage({uri: res.uri});
        setLoading(false);
        uploadFile(res).then(async response => {
          let data = await response.json();
          setImage({
            uri: data.url,
          });
          setLoading(true);
          console.log(data.url);
        });
      }
    });
  };
  const uploadFile = file => {
    return RNFetchBlob.fetch(
      'POST',
      'https://api.cloudinary.com/v1_1/' +
        YOUR_CLOUDINARY_NAME +
        '/image/upload?upload_preset=' +
        YOUR_CLOUDINARY_PRESET,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'file',
          filename: file.fileName,
          data: RNFetchBlob.wrap(file.path),
        },
      ],
    );
  };

  const HandleEditFamily = async () => {
    const data = {
      fName: name,
      fImage: image.uri,
    };
    var res2 = await RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/edit-family',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    );
    console.log(res2.json());
    if (res2.json().code === 2020) {
      if (collapsed) {
        const data1 = {
          oldPassword: currentPassword,
          newPassword: newPassword,
        };
        var res1 = await RNFetchBlob.fetch(
          'POST',
          'https://househelperapp-api.herokuapp.com/change-family-password',
          {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          JSON.stringify(data1),
        );
        console.log(res1.json());
        if (res1.json().code !== 2020) {
          seterr(res1.json().message);
          return;
        }
      }
      Toast.show('Cập nhật thông tin gia đình thành công!', {
        duration: 3000,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });
      setconfirmPassword('');
      setcurrentPassword('');
      setnewPassword('');
      //navigation.navigate('Setting');
    } else {
      seterr(res2.json().message);
    }
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
  useEffect(() => {
    getUser;
    setname(user.fName);
    setImage({uri: user.fImage});
  }, []);
  useEffect(() => {
    if (collapsed === false) {
      setconfirmPassword('');
      setcurrentPassword('');
      setnewPassword('');
    }
  }, [collapsed]);
  useEffect(() => {
    getlistMember();
  }, [listMember]);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{paddingTop: 20}}>
        <ScrollView>
          <WingBlank size="md">
            <Flex justify="center">
              {loading === false && (
                <Flex>
                  <View
                    style={{
                      flex: 1,
                      marginTop: 20,
                      margin: 5,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                      padding: 10,
                    }}>
                    <ActivityIndicator size="large" color="#0099FF" />
                  </View>
                </Flex>
              )}

              <View
                style={{
                  flex: 1,
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                {(loading === true || loading === null) && (
                  <Flex justify="center">
                    <View>
                      <TouchableOpacity
                        onPress={pickImageHandler}
                        disabled={!user.mIsAdmin}>
                        <Image
                          style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            borderColor: 'gray',
                            borderWidth: 2,
                            margin: 10,
                            opacity: 0.8,
                          }}
                          source={{
                            uri: image.uri,
                          }}
                        />
                      </TouchableOpacity>
                      {user.mIsAdmin ? (
                        <Icon
                          name="camera"
                          size={30}
                          style={{
                            backgroundColor: '#ebebeb',
                            color: '#363636',
                            position: 'absolute',
                            right: 10,
                            bottom: 2,
                          }}
                        />
                      ) : (
                        <View />
                      )}
                    </View>
                  </Flex>
                )}
              </View>
            </Flex>

            <Card style={{padding: 10, elevation: 5}}>
              <Flex justify="center">
                <TextInput
                  clear
                  style={{fontSize: 20}}
                  editable={user.mIsAdmin}
                  placeholder="Tên gia đình"
                  defaultValue={name}
                  onChangeText={value => {
                    setname(value);
                    console.log(name);
                    seterr(null);
                  }}
                />
              </Flex>
            </Card>
            <WhiteSpace />
            {user.mIsAdmin ? (
              <View>
                <Card style={{elevation: 5}}>
                  <Collapse onToggle={isCollapsed => setcollapsed(isCollapsed)}>
                    <CollapseHeader>
                      <Flex
                        style={{
                          flexDirection: 'row-reverse',
                          height: 50,
                          padding: 15,
                          paddingTop: 20,
                        }}>
                        {collapsed ? (
                          <Icon
                            name="caret-down"
                            size={25}
                            color="#0099FF"
                            style={{padding: 5}}
                          />
                        ) : (
                          <Icon
                            name="caret-right"
                            size={25}
                            color="#0099FF"
                            style={{padding: 5}}
                          />
                        )}

                        <Flex.Item
                          style={{
                            alignSelf: 'center',
                            alignItems: 'flex-start',
                          }}>
                          <Text style={{fontSize: 18}}>
                            Đổi mật khẩu tài khoản gia đình
                          </Text>
                        </Flex.Item>
                      </Flex>
                    </CollapseHeader>
                    <CollapseBody>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#CCCCCC',
                          margin: 10,
                          padding: 5,
                        }}>
                        <InputItem
                          clear
                          type="password"
                          placeholder="Mật khẩu hiện tại"
                          style={{
                            fontSize: 18,
                          }}
                          defaultValue={currentPassword}
                          onChangeText={value => {
                            setcurrentPassword(value);
                            seterr(null);
                          }}
                        />
                      </View>

                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#CCCCCC',
                          margin: 10,
                          padding: 5,
                        }}>
                        <InputItem
                          clear
                          type="password"
                          placeholder="Mật khẩu mới"
                          style={{
                            fontSize: 18,
                          }}
                          defaultValue={newPassword}
                          onChangeText={value => {
                            setnewPassword(value);
                            seterr(null);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: '#CCCCCC',
                          margin: 10,
                          padding: 5,
                        }}>
                        <InputItem
                          clear
                          type="password"
                          placeholder="Xác nhận mật khẩu mới"
                          style={{fontSize: 18}}
                          defaultValue={confirmPassword}
                          onChangeText={value => {
                            setconfirmPassword(value);
                            seterr(null);
                          }}
                        />
                      </View>
                      <Flex.Item>
                        <Flex justify="end">
                          <TouchableOpacity
                            onPress={() => {
                              seterr(null);
                              if (/@/.test(user.mEmail)) {
                                navigation.navigate('ForgotPassword', {
                                  prevScreen: 'FamilyInformation',
                                  type: 'family',
                                  email: user.mEmail,
                                });
                              } else {
                                seterr(
                                  'Hãy cập nhật email để đặt lại mật khẩu gia đình!',
                                );
                              }
                            }}>
                            <Text
                              style={{
                                color: '#108EE9',
                                marginRight: 10,
                                fontSize: 15,
                                paddingBottom: 5,
                              }}>
                              Quên mật khẩu?
                            </Text>
                          </TouchableOpacity>
                        </Flex>
                      </Flex.Item>
                    </CollapseBody>
                  </Collapse>
                </Card>
                {err !== null && (
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'red',
                      marginTop: 5,
                      marginHorizontal: 15,
                    }}>
                    {err}
                  </Text>
                )}
                <Flex justify="center">
                  <Button
                    type="primary"
                    style={{margin: 10, width: '50%'}}
                    onPress={() => {
                      if (name === '') {
                        seterr('Các trường không được để trống');
                      } else {
                        if (collapsed === true) {
                          if (
                            currentPassword === '' ||
                            newPassword === '' ||
                            confirmPassword === ''
                          ) {
                            seterr('Các trường không được để trống');
                            return;
                          } else {
                            if (newPassword !== confirmPassword) {
                              seterr('Nhập mật khẩu mới không khớp!');
                              return;
                            }
                          }
                        }
                      }
                      HandleEditFamily();
                    }}>
                    Lưu thay đổi
                  </Button>
                </Flex>
              </View>
            ) : (
              <View />
            )}

            <Text style={{paddingLeft: 15, fontSize: 18}}>
              Thành viên gia đình
            </Text>
            <WhiteSpace />
            {listMember === null ? (
              <View
                style={{
                  flex: 1,
                  marginTop: 20,
                  margin: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 10,
                }}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <View>
                {listMember.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      // console.log(item);
                      // console.log('++++++' + user);
                      if (item._id !== user._id) {
                        navigation.navigate('MemberInformation', {
                          inforMember: item,
                        });
                      } else {
                        navigation.navigate('Account');
                      }
                    }}>
                    <Card
                      style={{
                        marginBottom: -5,
                      }}>
                      <Flex
                        justify="end"
                        align="start"
                        style={{
                          flexDirection: 'row-reverse',
                          padding: 10,
                          height: 60,
                        }}>
                        <Flex.Item>
                          <Flex justify="end">
                            <Icon
                              name="caret-right"
                              size={25}
                              color="#0099FF"
                              style={{padding: 10}}
                            />
                          </Flex>
                        </Flex.Item>
                        <View
                          style={{
                            width: '70%',
                            alignSelf: 'center',
                            alignItems: 'flex-start',
                          }}>
                          {item.mIsAdmin ? (
                            <Text style={{fontSize: 18}}>
                              {item.mName} ({item.mRole}/ Admin)
                            </Text>
                          ) : (
                            <Text style={{fontSize: 18}}>
                              {item.mName} ({item.mRole})
                            </Text>
                          )}
                          {user.mIsAdmin ? (
                            <Text style={{fontSize: 15}}>{item.mEmail}</Text>
                          ) : (
                            <View />
                          )}
                        </View>

                        <View
                          style={{
                            width: 55,
                            alignItems: 'flex-start',
                          }}>
                          <Image
                            style={{
                              width: 45,
                              height: 45,
                              borderColor: '#0099FF',
                              borderRadius: 25,
                              borderWidth: 2,
                              opacity: item.mAvatar.color ? 0.4 : 1,
                              backgroundColor: item.mAvatar.color,
                            }}
                            source={{
                              uri: item.mAvatar.image,
                            }}
                          />
                        </View>
                      </Flex>
                    </Card>
                    <WhiteSpace />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </WingBlank>
        </ScrollView>
      </View>
    </View>
  );
}
