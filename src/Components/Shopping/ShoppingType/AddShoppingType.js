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
  Provider,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function AddShoppingType({navigation, route}) {
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
    if (ImgType) {
      setimg(ImgType[0]);
    }
  }, [ImgType]);
  const hanldeAddShoppingType = () => {
    if (name === null || name === '') {
      console.log('Tên loại mua sắm không được để trống');
    } else {
      RNFetchBlob.fetch(
        'POST',
        'https://househelperapp-api.herokuapp.com/add-shopping-type',
        {
          Authorization: 'Bearer ' + route.params.token,
          'Content-Type': 'application/json',
        },
        JSON.stringify({
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

        <Button
          type="primary"
          style={{margin: 10, elevation: 2}}
          onPress={hanldeAddShoppingType}>
          <Text>Thêm loại mua sắm</Text>
        </Button>
      </ScrollView>
    </Provider>
  );
}
