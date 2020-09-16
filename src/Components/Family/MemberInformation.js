/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Icon,
  Flex,
  Button,
  InputItem,
  Checkbox,
  Modal,
  Provider,
} from '@ant-design/react-native';
import {Picker} from 'native-base';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-root-toast';

export default function Account({navigation, route}) {
  const {token} = route.params;
  const {user} = route.params;
  const {getUser} = route.params;
  const {inforMember} = route.params;
  const [image, setImage] = useState({
    uri: 'http://getdrawings.com/free-icon-bw/gta-v-icon-22.jpg',
  });
  const [loading, setLoading] = useState(null);
  const [bgColor, setbgColor] = useState(null);
  const [select, setSelect] = useState('Bố');
  const [err, seterr] = useState(null);
  const [name, setname] = useState('');
  const [age, setage] = useState('');
  const [email, setemail] = useState('');
  const [isAdmin, setisAdmin] = useState(false);
  const listCL = [
    '#e74c3c',
    '#f1c40f',
    '#e67e22',
    '#9b59b6',
    '#3498db',
    '#2ecc71',
  ];
  // console.log(isAdmin);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      marginBottom: 25,
      alignContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
    },
  });

  const YOUR_CLOUDINARY_NAME = 'datn22020';
  const YOUR_CLOUDINARY_PRESET = 'DATN_HouseHelperApp_Image';
  const pickImageHandler = () => {
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
  const HandleChangeBG = color => {
    setbgColor(color);
  };
  const HandleEditMember = () => {
    if (user.mIsAdmin === false) {
      seterr('Quản lí thành viên thuộc về quyền của quản trị viên gia đình!');
    } else {
      const data = {
        mID: inforMember._id,
        mName: name,
        mAvatar: {
          image: image.uri,
          color: bgColor,
        },
        mEmail: email,
        mAge: age,
        mRole: select,
        mIsAdmin: isAdmin,
      };
      RNFetchBlob.fetch(
        'POST',
        'https://househelperapp-api.herokuapp.com/edit-member',
        {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        JSON.stringify(data),
      ).then(res => {
        const t = res.json();
        console.log(t);
        if (t.code === 2020) {
          Toast.show('Cập nhật thông tin thành viên thành công!', {
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
    }
  };
  useEffect(() => {
    getUser;
    setname(inforMember.mName);
    setemail(inforMember.mEmail);
    setage(inforMember.mAge);
    setSelect(inforMember.mRole);
    setisAdmin(inforMember.mIsAdmin);
    setImage({uri: inforMember.mAvatar.image});
    setbgColor(inforMember.mAvatar.color);
  }, []);
  // console.log(isAdmin);
  return (
    <Provider>
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ScrollView>
          <View
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              margin: 20,
              backgroundColor: 'white',
            }}>
            <Flex justify="center">
              {loading === false && (
                <Flex>
                  <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="green" />
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
                  <Flex justify="center" style={{marginBottom: 10}}>
                    <Image
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        borderColor: 'gray',
                        borderWidth: 2,
                        margin: 10,
                        backgroundColor: bgColor,
                        opacity: 0.8,
                      }}
                      source={{
                        uri: image.uri,
                      }}
                    />
                  </Flex>
                )}
              </View>
            </Flex>
            <Flex justify="center">
              <View
                style={{
                  flex: 1,
                  alignContent: 'center',
                  justifyContent: 'center',
                  marginBottom: 25,
                }}>
                <Flex justify="around">
                  <TouchableOpacity
                    onPress={pickImageHandler}
                    disabled={!user.mIsAdmin}>
                    <Flex
                      justify="center"
                      align="center"
                      style={{
                        width: 45,
                        height: 45,
                        borderRadius: 50,
                        borderColor: 'black',
                        borderWidth: 2,
                      }}>
                      <Icon name="camera" size="md" color="black" />
                    </Flex>
                  </TouchableOpacity>

                  {listCL.map(item => (
                    <TouchableOpacity
                      onPress={() => HandleChangeBG(item)}
                      disabled={!isAdmin}>
                      <Image
                        id={item}
                        style={
                          bgColor === item
                            ? {
                                width: 45,
                                height: 45,
                                borderRadius: 50,
                                borderColor: '#2980b9',
                                borderWidth: 2,
                                backgroundColor: item,
                                opacity: 0.8,
                              }
                            : {
                                width: 45,
                                height: 45,
                                borderRadius: 50,
                                borderColor: item,
                                borderWidth: 2,
                                backgroundColor: item,
                                opacity: 0.4,
                              }
                        }
                      />
                    </TouchableOpacity>
                  ))}
                </Flex>
              </View>
            </Flex>
            <View
              style={{
                borderWidth: 1,
                borderColor: '#CCCCCC',
                margin: 10,
                padding: 5,
              }}>
              <InputItem
                clear
                placeholder="Name"
                style={{
                  fontSize: 18,
                  justifyContent: 'flex-start',
                }}
                defaultValue={name}
                disabled={!user.mIsAdmin}
                onChangeText={value => {
                  setname(value);
                  seterr(null);
                }}>
                <Flex align="start" style={{marginRight: 15}}>
                  <Icon name="user" color="gray" />
                </Flex>
              </InputItem>
            </View>
            {user.mIsAdmin ? (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#CCCCCC',
                  margin: 10,
                  padding: 5,
                }}>
                <InputItem
                  clear
                  placeholder="Email"
                  style={{fontSize: 18}}
                  defaultValue={email}
                  onChangeText={value => {
                    setemail(value);
                    seterr(null);
                  }}>
                  <Flex align="center">
                    <Icon name="mail" color="gray" />
                  </Flex>
                </InputItem>
              </View>
            ) : null}
            <View
              style={{
                borderWidth: 1,
                borderColor: '#CCCCCC',
                margin: 10,
                padding: 5,
              }}>
              <InputItem
                clear
                type="number"
                disabled={!user.mIsAdmin}
                placeholder="Age"
                style={{fontSize: 18, backgroundColor: 'transparent'}}
                defaultValue={age.toString()}
                onChangeText={value => {
                  if (value === '') {
                    setage('');
                  } else {
                    setage(parseInt(value, 10));
                  }
                  seterr(null);
                }}>
                <Flex align="center">
                  <Icon name="gift" color="gray" style={{marginRight: 5}} />
                </Flex>
              </InputItem>
            </View>
            <Flex style={{padding: 10}}>
              <View style={{borderColor: '#bdc3c7', borderWidth: 1, flex: 4.5}}>
                <Flex justify="around">
                  <Flex align="center">
                    <Icon name="team" color="gray" style={{marginLeft: 20}} />
                  </Flex>
                  <Picker
                    note
                    mode="dropdown"
                    style={{marginLeft: 20}}
                    textStyle={{fontSize: 25}}
                    itemTextStyle={{fontSize: 25}}
                    selectedValue={select}
                    onValueChange={setSelect.bind(this)}>
                    <Picker.Item label="Bố" value="Bố" />
                    <Picker.Item label="Mẹ" value="Mẹ" />
                    <Picker.Item label="Con Trai" value="Con Trai" />
                    <Picker.Item label="Con Gái" value="Con Gái" />
                    <Picker.Item label="Ông" value="Ông" />
                    <Picker.Item label="Bà" value="Bà" />
                    <Picker.Item label="Khác" value="Khác" />
                  </Picker>
                </Flex>
              </View>
              <View style={{flex: 3}}>
                <View
                  style={{
                    width: 135,
                  }}>
                  <Checkbox.AgreeItem
                    disabled={!user.mIsAdmin}
                    defaultChecked={isAdmin}
                    checked={isAdmin}
                    onChange={event => {
                      setisAdmin(event.target.checked);
                      seterr(null);
                    }}
                    style={{
                      color: 'black',
                    }}>
                    <Text style={{fontSize: 16}}>Quản trị viên</Text>
                  </Checkbox.AgreeItem>
                </View>
              </View>
            </Flex>
            {user.mIsAdmin ? (
              <TouchableOpacity
                onPress={() => {
                  seterr(null);
                  Modal.prompt(
                    'Khôi phục về mật khẩu gia đình',
                    'Vui lòng nhập mật khẩu gia đình để thực hiện.',
                    [
                      {
                        text: 'Hủy',
                        onPress: () => console.log('cancel'),
                        style: 'cancel',
                      },
                      {
                        text: 'Đặt lại',
                        onPress: password => {
                          const data2 = {
                            mID: inforMember._id,
                            fPassword: password,
                          };
                          RNFetchBlob.fetch(
                            'POST',
                            'https://househelperapp-api.herokuapp.com/recover-family-password',
                            {
                              Authorization: 'Bearer ' + token,
                              'Content-Type': 'application/json',
                            },
                            JSON.stringify(data2),
                          ).then(res => {
                            const rlt = res.json();
                            console.log(rlt);
                            if (rlt.code === 2020) {
                              Toast.show(
                                'Khôi phục về mật khẩu gia đình thành công!',
                                {
                                  duration: 3000,
                                  position: Toast.positions.BOTTOM,
                                  shadow: true,
                                  animation: true,
                                  hideOnPress: true,
                                },
                              );
                            } else {
                              seterr(rlt.message);
                            }
                          });
                        },
                      },
                    ],
                    'secure-text',
                    '',
                  );
                }}>
                <Flex
                  justify="start"
                  style={{
                    fontSize: 18,
                    margin: 10,
                    padding: 5,
                  }}>
                  <Icon
                    name="lock"
                    color="gray"
                    style={{marginLeft: 15, marginRight: 10}}
                  />
                  <Text style={{fontSize: 18, color: '#0099FF'}}>
                    Khôi phục về mật khẩu gia đình
                  </Text>
                </Flex>
              </TouchableOpacity>
            ) : null}
            {err !== null && (
              <Text style={{fontSize: 18, color: 'red', margin: 10}}>
                {err}
              </Text>
            )}
            {user.mIsAdmin && (
              <Flex justify="center">
                <Button
                  full
                  type="warning"
                  style={{margin: 5, marginTop: 10, width: '45%'}}
                  onPress={() => {
                    if (user.mIsAdmin) {
                      Modal.alert(
                        'Xóa tài khoản',
                        'Bạn có chắc chắn muốn xóa tài khoản này? Hệ thống sẽ tự động ngắt kết nối với tài khoản này sau khi xóa.',
                        [
                          {
                            text: 'Hủy',
                            onPress: () => console.log('cancel'),
                            style: 'cancel',
                          },
                          {
                            text: 'Xóa',
                            onPress: () => {
                              const data1 = {mID: inforMember._id};
                              RNFetchBlob.fetch(
                                'POST',
                                'https://househelperapp-api.herokuapp.com/delete-member',
                                {
                                  Authorization: 'Bearer ' + token,
                                  'Content-Type': 'application/json',
                                },
                                JSON.stringify(data1),
                              ).then(res => {
                                const r = res.json();
                                console.log(r);
                                if (r.code === 2020) {
                                  Toast.show('Xóa thành viên thành công!', {
                                    duration: 3000,
                                    position: Toast.positions.BOTTOM,
                                    shadow: true,
                                    animation: true,
                                    hideOnPress: true,
                                  });
                                  navigation.goBack();
                                } else {
                                  seterr(r.message);
                                }
                              });
                            },
                          },
                        ],
                      );
                    } else {
                      seterr(
                        'Quản lí thành viên thuộc về quyền của quản trị viên gia đình!',
                      );
                    }
                  }}>
                  Xóa tài khoản
                </Button>
                <Button
                  full
                  type="primary"
                  style={{margin: 5, marginTop: 10, width: '45%'}}
                  onPress={() => {
                    //kiểm tra các trường thông tin cá nhân không được để trống
                    if (name === '' || email === '' || age === '') {
                      seterr('Các trường không được để trống');
                    } else {
                      if (age < 1) {
                        seterr('Tuổi phải là số nguyên dương!');
                      } else {
                        HandleEditMember();
                      }
                    }
                  }}>
                  Lưu thay đổi
                </Button>
              </Flex>
            )}
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
}
