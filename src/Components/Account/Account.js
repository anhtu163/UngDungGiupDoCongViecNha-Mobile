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
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import Toast from 'react-native-root-toast';

export default function Account({navigation, route}) {
  //   const {nameFamily} = route.params;
  //   const {password} = route.params;
  //   const {imageF} = route.params;
  //   const {signUp} = React.useContext(route.params.AuthContext);
  const {AuthContext} = route.params;
  const {signOut} = React.useContext(AuthContext);
  const {token} = route.params;
  const {user} = route.params;
  const {getUser} = route.params;
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
  const [collapsed, setcollapsed] = useState(false);
  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
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
          setbgColor(null);
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
  const HandleEditMember = async () => {
    const data = {
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
    var res = await RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/edit-member',
      {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      JSON.stringify(data),
    );
    console.log(res.json());
    if (res.json().code === 2020) {
      let temp = 1;
      if (collapsed) {
        const data1 = {
          oldPassword: currentPassword,
          newPassword: newPassword,
        };
        var res1 = await RNFetchBlob.fetch(
          'POST',
          'https://househelperapp-api.herokuapp.com/change-password',
          {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          JSON.stringify(data1),
        );
        console.log(res1.json());
        temp = res1.json().code;
        if (res1.json().code !== 2020) {
          seterr(res1.json().message);
          return;
        }
      }
      Toast.show('Cập nhật thông tin cá nhân thành công!', {
        duration: 3000,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
      });
      navigation.goBack();
    } else {
      seterr(res.json().message);
    }
  };
  useEffect(() => {
    getUser;
    setname(user.mName);
    setemail(user.mEmail);
    setage(user.mAge);
    setSelect(user.mRole);
    setisAdmin(user.mIsAdmin);
    setImage({uri: user.mAvatar.image});
    setbgColor(user.mAvatar.color);
  }, []);
  useEffect(() => {
    if (collapsed === false) {
      setconfirmPassword('');
      setcurrentPassword('');
      setnewPassword('');
    }
  }, [collapsed]);
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
                        opacity: bgColor ? 0.8 : 1,
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
                  <TouchableOpacity onPress={pickImageHandler}>
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
                    <TouchableOpacity onPress={() => HandleChangeBG(item)}>
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
                style={{fontSize: 18, justifyContent: 'flex-start'}}
                defaultValue={name}
                onChangeText={value => {
                  setname(value);
                  seterr(null);
                }}>
                <Flex align="start" style={{marginRight: 15}}>
                  <Icon name="user" color="gray" />
                </Flex>
              </InputItem>
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
                placeholder="Age"
                style={{fontSize: 18}}
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
              <Flex.Item style={{borderColor: '#bdc3c7', borderWidth: 1}}>
                <Flex justify="around">
                  <Flex align="center">
                    <Icon name="team" color="gray" style={{marginLeft: 20}} />
                  </Flex>
                  <Picker
                    note
                    mode="dropdown"
                    style={{marginLeft: 40}}
                    textStyle={{fontSize: 25}}
                    itemTextStyle={{fontSize: 25}}
                    selectedValue={select}
                    onValueChange={setSelect.bind(this)}>
                    <Picker.Item label="Bố" value="Bố" />
                    <Picker.Item label="Mẹ" value="Mẹ" />
                    <Picker.Item label="Con Trai" value="Con Trai" />
                    <Picker.Item label="Con Gái" value="Con Gái" />
                  </Picker>
                </Flex>
              </Flex.Item>
              <Flex>
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
              </Flex>
            </Flex>
            <View>
              <Collapse
                onToggle={isCollapsed => {
                  setcollapsed(isCollapsed);
                }}>
                <CollapseHeader>
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
                    <Text style={{fontSize: 18}}>Đổi mật khẩu</Text>
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
                      style={{
                        fontSize: 18,
                      }}
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
                        onPress={() =>
                          navigation.navigate('ForgotPassword', {
                            prevScreen: 'Account',
                            type: 'member',
                            email: user.mEmail,
                          })
                        }>
                        <Text
                          style={{
                            color: '#108EE9',
                            marginRight: 10,
                            fontSize: 15,
                          }}>
                          Quên mật khẩu?
                        </Text>
                      </TouchableOpacity>
                    </Flex>
                  </Flex.Item>
                </CollapseBody>
              </Collapse>
            </View>
            {err !== null && (
              <Text style={{fontSize: 18, color: 'red', margin: 10}}>
                {err}
              </Text>
            )}
            <Flex justify="center">
              <Button
                full
                type="warning"
                style={{margin: 5, marginTop: 10, width: '45%'}}
                onPress={() => {
                  Modal.alert(
                    'Xóa tài khoản',
                    'Bạn có chắc chắn muốn xóa tài khoản này? Hệ thống sẽ tự động đăng xuất sau khi xóa.',
                    [
                      {
                        text: 'Hủy',
                        onPress: () => console.log('cancel'),
                        style: 'cancel',
                      },
                      {
                        text: 'Xóa',
                        onPress: () => {
                          const data1 = {};
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
                              signOut();
                            } else {
                              seterr(r.message);
                            }
                          });
                        },
                      },
                    ],
                  );
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
                      return;
                    }
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
                    HandleEditMember();
                  }
                }}>
                Lưu thay đổi
              </Button>
            </Flex>
          </View>
        </ScrollView>
      </View>
    </Provider>
  );
}
