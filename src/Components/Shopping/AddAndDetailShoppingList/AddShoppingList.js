/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Switch,
} from 'react-native';
import {
  List,
  InputItem,
  Button,
  Provider,
  Flex,
  Card,
  Icon,
} from '@ant-design/react-native';
import Item from './Item';
import RNFetchBlob from 'react-native-fetch-blob';
import {ScrollView} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function AddShoppingList({navigation, route}) {
  //console.log(parseInt('0', 10));
  // const [choose, setchoose] = useState(1);
  const {socket} = route.params;
  const [list, setlist] = useState([]);
  const [nameItem, setnameItem] = useState(null);
  const [detail, setdetail] = useState(null);
  const [name, setname] = useState('');
  const [keyMember, setkeyMember] = useState(null);
  const [listMember, setlistMember] = useState(null);
  const [err, seterr] = useState('');
  const [loading, setLoading] = useState(null);
  const [image, setImage] = useState({
    uri:
      'https://png.pngtree.com/png-vector/20190527/ourlarge/pngtree-shopping-basket-icon-png-image_1093537.jpg',
  });
  const [listType, setlistType] = useState(null);
  const [keyType, setkeyType] = useState(null);

  const [times, settimes] = useState(1);
  console.log(times);
  const [showRepeat, setshowRepeat] = useState(false);
  const [repeat, setrepeat] = useState(null);
  const [startdate, setstartdate] = useState(new Date());
  const [starttime, setstarttime] = useState(new Date());
  const [RStartTime, setRStartTime] = useState(null);
  const [isDateRepeatPickerVisible, setDateRepeatPickerVisibility] = useState(
    false,
  );
  const [isTimeRepeatPickerVisible, setTimeRepeatPickerVisibility] = useState(
    false,
  );
  const [isReminder, setisReminder] = useState(false);
  const toggleSwitch = () => setisReminder(previousState => !previousState);

  const showDateRepeatPicker = () => {
    setDateRepeatPickerVisibility(true);
  };

  const hideDateRepeatPicker = () => {
    setDateRepeatPickerVisibility(false);
  };
  const showTimeRepeatPicker = () => {
    setTimeRepeatPickerVisibility(true);
  };

  const hideTimeRepeatPicker = () => {
    setTimeRepeatPickerVisibility(false);
  };

  const handleTimeRepeatConfirm = dt => {
    hideTimeRepeatPicker();
    setstarttime(dt);
    setRStartTime(
      startdate.getFullYear() +
        '-' +
        (startdate.getMonth() + 1) +
        '-' +
        startdate.getDate() +
        ' ' +
        dt.getHours() +
        ':' +
        dt.getMinutes() +
        ':00 +07:00',
    );
  };

  const handleRepeatConfirm = dt => {
    hideDateRepeatPicker();
    setstartdate(dt);
    setRStartTime(
      `${dt.getFullYear()}-${dt.getMonth() +
        1}-${dt.getDate()} ${starttime.getHours()}:${starttime.getMinutes()}:00 +07:00`,
    );
  };
  // Add your Cloudinary name here
  const YOUR_CLOUDINARY_NAME = 'datn22020';

  // If you dont't hacve a preset id, head over to cloudinary and create a preset, and add the id below
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
  const handleAdd = () => {
    if (nameItem) {
      setlist([...list, {name: nameItem, details: detail, photo: image.uri}]);
      setdetail(null);
      setnameItem(null);
      setImage({
        uri:
          'https://png.pngtree.com/png-vector/20190527/ourlarge/pngtree-shopping-basket-icon-png-image_1093537.jpg',
      });
    }
  };
  const handleRemove = index => {
    const t = [...list];
    t.splice(index, 1);
    console.log(t);
    setlist(t);
  };
  const getlistMember = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-member',
      {
        Authorization: 'Bearer ' + route.params.token,
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      setlistMember(t.listMembers);
    });
  };
  const getlistType = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-shopping-type',
      {
        Authorization: 'Bearer ' + route.params.token,
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setlistType(t.listShoppingTypes);
      }
    });
  };
  useEffect(() => {
    getlistMember();
    getlistType();
  }, []);
  useEffect(() => {
    if (listType) {
      setkeyType(listType[0]._id);
    }
  }, [listType]);
  const handleCheckMember = index => {
    if (keyMember !== index) {
      setkeyMember(index);
    } else {
      setkeyMember(null);
    }
  };
  const handleCheckType = index => {
    if (keyType === index) {
      navigation.navigate('DetailsShoppingType', {
        listType,
        id: index,
        getlistType,
      });
    } else {
      setkeyType(index);
    }
  };
  useEffect(() => {
    if (socket) {
      socket.on('ShoppingType', data => {
        getlistType();
      });
      socket.on('Member', data => {
        getlistMember();
      });
    }
  }, []);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });
  const handleAddList = () => {
    console.log({
      name: name,
      assign: keyMember,
      stID: keyType,
      listItems: list,
      repeat: repeat
        ? {
            type: repeat,
            every: times,
            isRemindered: isReminder,
            start: RStartTime,
          }
        : null,
    });
    if (name === null || name === '') {
      setname(null);
      seterr('Tên danh sách không được bỏ trống');
    } else if (showRepeat && repeat === null) {
      seterr('Vui lòng chọn loại lặp');
    } else if (showRepeat && repeat && RStartTime === null) {
      seterr('Vui lòng chọn thời gian bắt đầu lặp');
    } else if (showRepeat && repeat && times < 1) {
      seterr('Vui lòng nhập khoảng cách lặp lớn hơn hoặc bằng 1');
    } else if (list.length === 0) {
      seterr('Danh sách phải chứa ít nhất 1 vật phẩm');
    } else {
      return RNFetchBlob.fetch(
        'POST',
        'https://househelperapp-api.herokuapp.com/add-shopping-list',
        {
          Authorization: 'Bearer ' + route.params.token,
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          name: name,
          assign: keyMember,
          stID: keyType,
          listItems: list,
          repeat: repeat
            ? {
                type: repeat,
                every: times,
                isRemindered: isReminder,
                start: RStartTime,
              }
            : null,
        }),
      ).then(res => {
        const t = res.json();
        console.log(t);
        if (t.code === 2020) {
          navigation.navigate('ShoppingList');
        } else {
          seterr(t.message);
        }
      });
    }
  };
  return (
    <Provider>
      <ScrollView>
        <View style={{margin: 5}}>
          <Card style={{padding: 10, margin: 5}}>
            <Flex justify="center">
              <TextInput
                style={{fontSize: 20, fontFamily: ''}}
                placeholder="Tên danh sách"
                defaultValue={name}
                onChangeText={value => {
                  setname(value);
                  //seterr('');
                }}
              />
            </Flex>
          </Card>
          <Card style={{padding: 10, margin: 5}}>
            <Flex>
              <Icon name="team" color="black" size="md" />
              <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                Thành viên
              </Text>
            </Flex>
            {listMember === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <Flex justify="start" style={{marginTop: 10}} wrap="wrap">
                {listMember.map(item => (
                  <Flex direction="column" style={{margin: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckMember(item._id);
                        //seterr('');
                        // handleCheckMoreTwoMember();
                        // console.log('checkKeyMember: ' + keyMember
                      }}>
                      <Image
                        style={
                          keyMember === item._id
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
          <Card style={{padding: 10, margin: 5}}>
            <Flex>
              <Icon name="team" color="black" size="md" />
              <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                Loại mua sắm
              </Text>
            </Flex>
            {listType === null ? (
              <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color="#0099FF" />
              </View>
            ) : (
              <Flex justify="start" style={{marginTop: 10}} wrap="wrap">
                {listType.map(item => (
                  <Flex direction="column" style={{margin: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        handleCheckType(item._id);
                        //seterr('');
                        // handleCheckMoreTwoMember();
                        // console.log('checkKeyMember: ' + keyMember
                      }}>
                      <Image
                        style={
                          keyType === item._id
                            ? {
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                borderColor: '#0099FF',
                                borderWidth: 3,
                              }
                            : {
                                width: 45,
                                height: 45,
                                borderRadius: 25,
                                borderColor: 'gray',
                                borderWidth: 2,
                              }
                        }
                        source={{uri: item.image}}
                        id={item._id}
                      />
                    </TouchableOpacity>
                    <View>
                      <Text numberOfLines={1} style={{maxWidth: 62}}>
                        {item.name}
                      </Text>
                    </View>
                  </Flex>
                ))}
                <View style={{margin: 15, marginTop: -5}}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('AddShoppingType', {
                        getlistType: getlistType,
                      })
                    }>
                    <Icon name="plus-circle" size="lg" color="#0099FF" />
                  </TouchableOpacity>
                </View>
              </Flex>
            )}
          </Card>
          <Card style={{backgroundColor: 'white', margin: 5}}>
            <Flex justify="start" style={{padding: 10, paddingBottom: 5}}>
              <Icon name="redo" size="md" color="black" />

              <View>
                <TouchableOpacity
                  onPress={() => {
                    setshowRepeat(!showRepeat);
                  }}>
                  <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                    Lặp lại
                  </Text>
                </TouchableOpacity>
              </View>
              {showRepeat && (
                <View style={{flex: 10}}>
                  <Flex justify="end">
                    <Text
                      style={{color: '#0099FF', fontSize: 14, marginLeft: 5}}>
                      Nhắc nhở
                    </Text>
                    <Switch
                      trackColor={{false: '#767577', true: '#34ace0'}}
                      thumbColor={isReminder ? '#0099FF' : '#0099FF'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isReminder}
                    />
                  </Flex>
                </View>
              )}
            </Flex>
            <View>
              {showRepeat === true && (
                <View style={{marginBottom: 10}}>
                  <Flex
                    justify="around"
                    style={{marginTop: 10, marginBottom: 5}}>
                    <TouchableOpacity
                      style={
                        repeat === 'day'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        setrepeat('day');
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          padding: 3,
                        }}>
                        Hàng ngày
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        repeat === 'week'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        setrepeat('week');
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          padding: 3,
                        }}>
                        Hàng tuần
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        repeat === 'month'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        setrepeat('month');
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          padding: 3,
                        }}>
                        Hàng tháng
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={
                        repeat === 'year'
                          ? {borderColor: '#0099FF', borderWidth: 2}
                          : {
                              borderColor: 'gray',
                              borderWidth: 2,
                            }
                      }
                      onPress={() => {
                        setrepeat('year');
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          padding: 3,
                        }}>
                        Hàng năm
                      </Text>
                    </TouchableOpacity>
                  </Flex>
                  <InputItem
                    clear
                    type="number"
                    placeholder="Khoảng cách lặp"
                    defaultValue={times.toString()}
                    style={{
                      fontSize: 16,
                      marginTop: 2,
                      minWidth: 10,
                      marginLeft: 80,
                    }}
                    onChangeText={value => {
                      if (value === '' || parseInt(value, 10) < 0) {
                        settimes(1);
                      } else {
                        settimes(parseInt(value, 10));
                      }
                    }}>
                    <View style={{width: 150}}>
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 5,
                          color: '#0099FF',
                        }}>
                        Khoảng cách lặp:
                      </Text>
                    </View>
                  </InputItem>
                  <Flex justify="start" style={{marginLeft: 10}}>
                    <View style={{flex: 1}}>
                      <TouchableOpacity onPress={showDateRepeatPicker}>
                        <Flex>
                          <Icon
                            name="calendar"
                            size="md"
                            color="black"
                            style={{marginLeft: 5, backgroundColor: 'white'}}
                          />
                          <Text
                            style={{
                              marginLeft: 10,
                              color: '#0099FF',
                              fontSize: 16,
                            }}>
                            {RStartTime
                              ? startdate.getDate() >= 10 &&
                                startdate.getMonth() + 1 >= 10
                                ? startdate.getDate() +
                                  '/' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                                : startdate.getDate() < 10 &&
                                  startdate.getMonth() + 1 >= 10
                                ? '0' +
                                  startdate.getDate() +
                                  '/' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                                : startdate.getDate() >= 10 &&
                                  startdate.getMonth() + 1 < 10
                                ? startdate.getDate() +
                                  '/0' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                                : '0' +
                                  startdate.getDate() +
                                  '/0' +
                                  (startdate.getMonth() + 1) +
                                  '/' +
                                  startdate.getFullYear()
                              : 'Ngày bắt đầu'}
                          </Text>
                        </Flex>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isDateRepeatPickerVisible}
                        date={startdate}
                        mode="date"
                        onDateChange={dt => {
                          setstartdate(dt);
                          console.log(dt);
                          //seterr('');
                        }}
                        onConfirm={handleRepeatConfirm}
                        onCancel={hideDateRepeatPicker}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <TouchableOpacity onPress={showTimeRepeatPicker}>
                        <Flex>
                          <Icon
                            name="clock-circle"
                            size="md"
                            color="black"
                            style={{backgroundColor: 'white'}}
                          />
                          <Text
                            style={{
                              marginLeft: 8,
                              color: '#0099FF',
                              fontSize: 16,
                            }}>
                            {RStartTime
                              ? starttime.getHours() < 10 &&
                                starttime.getMinutes() >= 10
                                ? '0' +
                                  starttime.getHours() +
                                  ' : ' +
                                  starttime.getMinutes()
                                : starttime.getHours() >= 10 &&
                                  starttime.getMinutes() < 10
                                ? starttime.getHours() +
                                  ' : 0' +
                                  starttime.getMinutes()
                                : starttime.getHours() < 10 &&
                                  starttime.getMinutes() < 10
                                ? '0' +
                                  starttime.getHours() +
                                  ' : 0' +
                                  starttime.getMinutes()
                                : starttime.getHours() +
                                  ' : ' +
                                  starttime.getMinutes()
                              : 'Thời gian bắt đầu'}
                          </Text>
                        </Flex>
                      </TouchableOpacity>
                      <DateTimePickerModal
                        isVisible={isTimeRepeatPickerVisible}
                        date={starttime}
                        mode="time"
                        is24Hour={true}
                        onDateChange={dt => {
                          setstarttime(dt);
                          console.log(dt);
                          //seterr('');
                        }}
                        onConfirm={handleTimeRepeatConfirm}
                        onCancel={hideTimeRepeatPicker}
                      />
                    </View>
                  </Flex>
                </View>
              )}
            </View>
          </Card>
          <View>
            <Card style={{margin: 5, padding: 10, paddingRight: 10}}>
              <Flex>
                <Icon name="paper-clip" color="black" size="md" />
                <Text style={{color: '#0099FF', fontSize: 16, marginLeft: 5}}>
                  Danh sách vật phẩm:
                </Text>
              </Flex>
              {list.length !== 0 ? (
                <List
                  style={{
                    margin: 5,
                    elevation: 2,
                    backgroundColor: 'transparent',
                  }}>
                  {list.map((item, index) => (
                    <Item dt={item} handleRemove={handleRemove} index={index} />
                  ))}
                </List>
              ) : (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    margin: 10,
                    marginBottom: 15,
                    height: 50,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontStyle: 'italic',
                      color: 'gray',
                    }}>
                    (Rỗng)
                  </Text>
                </View>
              )}
              <View
                style={{
                  borderBottomColor: '#0099FF',
                  borderBottomWidth: 1,
                }}
              />
              <Flex>
                <View style={{flex: 5}}>
                  <View style={{flex: 5, marginTop: 5}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#0099FF',
                      }}>
                      Tên vật phẩm:
                    </Text>
                    <InputItem
                      value={nameItem}
                      style={{
                        backgroundColor: 'white',
                        borderColor: '#0099FF',
                        borderWidth: 1,
                        height: 35,
                        padding: 5,
                        fontSize: 14,
                      }}
                      placeholder="Tên vật phẩm"
                      onChangeText={value => {
                        setnameItem(value);
                      }}
                    />
                  </View>
                  <View style={{flex: 5, marginTop: 5}}>
                    <Text
                      style={{
                        marginLeft: 10,
                        fontSize: 15,
                        color: '#0099FF',
                      }}>
                      Ghi chú:
                    </Text>
                    <InputItem
                      value={detail}
                      style={{
                        backgroundColor: 'white',
                        borderColor: '#0099FF',
                        borderWidth: 1,
                        height: 35,
                        padding: 5,
                        fontSize: 14,
                      }}
                      placeholder="Ghi chú vật phẩm"
                      onChangeText={value => {
                        setdetail(value);
                      }}
                    />
                  </View>
                  {/* <View style={{flex: 2}}>
                  <Text
                    style={{
                      marginLeft: 15,
                      margin: 5,
                      fontSize: 16,
                      color: '#0099FF',
                    }}>
                    Số lượng:
                  </Text>

                  <Flex justify="around" style={{margin: 10}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (num > 1) {
                          setnum(num - 1);
                        }
                      }}>
                      <Icon name="minus-circle" size={25} color="#0099FF" />
                    </TouchableOpacity>
                    <Text style={{fontSize: 16}}>{num}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setnum(num + 1);
                      }}>
                      <Icon name="plus-circle" size={25} color="#0099FF" />
                    </TouchableOpacity>
                  </Flex>
                </View> */}
                </View>
                <View style={{flex: 2, marginTop: 25, marginRight: 5}}>
                  <TouchableOpacity onPress={pickImageHandler}>
                    <Image
                      source={image}
                      style={{
                        backgroundColor: 'pink',
                        height: 90,
                        width: 90,
                        borderRadius: 50,
                        borderColor: '#0099FF',
                        borderWidth: 2,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </Flex>
              <View
                style={{
                  flex: 1,
                  alignSelf: 'flex-end',
                  margin: 10,
                  marginRight: 15,
                }}>
                <Button type="ghost" onPress={handleAdd} style={{height: 30}}>
                  <Text style={{fontSize: 15, color: '#0099FF'}}>Thêm</Text>
                </Button>
              </View>
            </Card>
          </View>
          {err !== '' && (
            <Text style={{color: 'red', fontSize: 17, margin: 10}}>{err}</Text>
          )}
          <Button type="primary" style={{margin: 5}} onPress={handleAddList}>
            <Text>Thêm danh sách</Text>
          </Button>
        </View>
      </ScrollView>
    </Provider>
  );
}
