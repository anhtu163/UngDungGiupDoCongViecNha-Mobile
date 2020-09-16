/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {
  Flex,
  Card,
  InputItem,
  Icon,
  Button,
  Modal,
  Toast,
  Provider,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function DetailsShoppingType({navigation, route}) {
  //console.log(route.params);
  const {listType} = route.params;
  const {id} = route.params;
  const [detail, setdetail] = useState(null);
  const [ImgType, setImgType] = useState(null);
  const [img, setimg] = useState(null);
  const [name, setname] = useState(null);
  const [checkImg, setcheckImg] = useState(null);
  const getShoppingTypeList = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-shopping-type-icon',
      {
        Authorization: 'Bearer ' + route.params.token,
      },
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setImgType(t.list);
      }
    });
  };
  useEffect(() => {
    getShoppingTypeList();
  }, []);
  useEffect(() => {
    if (listType) {
      const t = listType.find(e => e._id === id);
      setdetail(t);
    }
  }, []);
  useEffect(() => {
    if (detail) {
      setimg(detail.image);
      setname(detail.name);
    }
  }, [detail]);
  const HandleDeleteShoppingType = () => {
    let tmpID;
    Modal.alert(
      'Chọn loại mua sắm thay thế',
      <Flex justify="between" wrap="wrap">
        {listType
          .filter(item1 => item1._id !== id)
          .map(item => (
            <Flex direction="column" style={{margin: 7.5}}>
              <TouchableOpacity
                onPress={() => {
                  tmpID = item._id;
                  console.log(tmpID);
                  Toast.info('Bạn đã chọn : ' + item.name, 0.3);
                }}>
                <Image
                  style={
                    tmpID === item._id
                      ? {
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          borderColor: '#0099FF',
                          borderWidth: 2.5,
                        }
                      : {
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          borderColor: 'black',
                          borderWidth: 0.5,
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
      </Flex>,
      [
        {
          text: 'Hủy',
          style: {color: 'red'},
        },
        {
          text: 'Chọn',
          onPress: () => {
            console.log('Loại mua sắm thay thế: ' + tmpID);
            const data = {
              stIDDelete: id,
              stIDReplace: tmpID,
            };
            RNFetchBlob.fetch(
              'POST',
              'https://househelperapp-api.herokuapp.com/delete-shopping-type',
              {
                Authorization: 'Bearer ' + route.params.token,
                'Content-Type': 'application/json',
              },
              JSON.stringify(data),
            ).then(res => {
              const t = res.json();
              console.log(t);
              route.params.getlistType();
              navigation.goBack();
            });
          },
        },
      ],
    );
  };
  const hanldeEditShoppingType = () => {
    if (name === null || name === '') {
      console.log('Tên loại mua sắm không được để trống');
    } else {
      RNFetchBlob.fetch(
        'POST',
        'https://househelperapp-api.herokuapp.com/edit-shopping-type',
        {
          Authorization: 'Bearer ' + route.params.token,
          'Content-Type': 'application/json',
        },
        JSON.stringify({
          stID: detail._id,
          name: name,
          image: img,
        }),
      ).then(res => {
        const t = res.json();
        if (t.code === 2020) {
          route.params.getlistType();
          navigation.goBack();
        }
        console.log(t);
      });
    }
  };
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
  return (
    <Provider>
      <ScrollView style={{margin: 5, marginBottom: 10}}>
        <Card>
          <Flex justify="center" style={{padding: 10, paddingBottom: -2}}>
            <Image
              style={{
                height: 60,
                width: 60,
                borderColor: '#0099FF',
                borderWidth: 2,
                borderRadius: 50,
                backgroundColor: 'white',
              }}
              source={{uri: img}}
            />
            <TextInput
              placeholder="Tên loại mua sắm"
              defaultValue={name}
              onChangeText={value => setname(value)}
              style={{
                fontSize: 18,
                padding: 10,
              }}
            />
          </Flex>
        </Card>

        <Card style={{padding: 5, elevation: 10, marginTop: 10}}>
          {ImgType === null ? (
            <View style={[styles.container, styles.horizontal]}>
              <ActivityIndicator size="large" color="#0099FF" />
            </View>
          ) : (
            <Flex justify="between" wrap="wrap">
              {ImgType &&
                ImgType.map(item => (
                  <TouchableOpacity
                    onPress={() => {
                      setimg(item);
                    }}>
                    <Image
                      style={
                        img === item
                          ? {
                              height: 60,
                              width: 60,
                              borderWidth: 2,
                              borderColor: '#0099FF',
                              borderRadius: 50,
                            }
                          : {height: 60, width: 60}
                      }
                      source={{
                        uri: item,
                      }}
                    />
                  </TouchableOpacity>
                ))}
            </Flex>
          )}
        </Card>
        <Flex justify="center">
          <Button
            full
            type="warning"
            style={{margin: 10, marginTop: 10}}
            onPress={HandleDeleteShoppingType}>
            Xóa loại mua sắm
          </Button>
          <Button
            type="primary"
            style={{margin: 10, elevation: 2}}
            onPress={hanldeEditShoppingType}>
            <Text>Lưu thay đổi</Text>
          </Button>
        </Flex>
      </ScrollView>
    </Provider>
  );
}
