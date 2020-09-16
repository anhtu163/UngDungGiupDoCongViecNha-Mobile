/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {List, Icon, Flex, Modal, Toast} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function ItemOfList(props) {
  const [check, setcheck] = useState(props.data.isChecked);
  const handleCheck = () => {
    setcheck(true);
    handleCheckDone();
  };
  const handleCheckDone = () => {
    return RNFetchBlob.fetch(
      'POST',
      'https://househelperapp-api.herokuapp.com/check-bought',
      {
        Authorization: 'Bearer ' + props.token,
        'Content-Type': 'application/json',
      },
      JSON.stringify({
        slID: props.listID, //id của shopping list
        islID: props.data._id, //id item của shopping list
      }),
    ).then(res => {
      const t = res.json();
      if (t.code === 2020) {
        setcheck(true);
        Toast.info(t.message, 1);
      } else {
        if (!props.data.isChecked) {
          setcheck(false);
        }
        Toast.info(t.message, 1);
      }
      console.log(t);
    });
  };
  // useEffect(() => {
  //   if (check) {
  //     console.log('Done'); // xử lý check Done
  //     handleCheckDone();
  //   }
  // }, [check]);
  // console.log(props.data.photo);
  return (
    <List.Item>
      <TouchableOpacity onPress={handleCheck}>
        <Flex>
          <View style={{flex: 7}}>
            <Flex>
              <Icon
                name="check-circle"
                size={28}
                style={{marginRight: 10}}
                color={check ? 'green' : 'gray'}
              />
              <Text style={{fontSize: 15, flex: 1, flexWrap: 'wrap'}}>
                {props.data.name}
              </Text>
            </Flex>
          </View>
          <View style={{flex: 2}}>
            {props.data.photo ? (
              <Image
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                  borderColor: '#0099FF',
                  borderWidth: 2,
                }}
                source={{
                  uri: props.data.photo,
                }}
              />
            ) : null}
          </View>
          <View style={{flex: 4}}>
            <Text style={{fontSize: 15, color: 'gray', marginLeft: 5}}>
              {props.data.details}
            </Text>
          </View>
        </Flex>
      </TouchableOpacity>
    </List.Item>
  );
}
