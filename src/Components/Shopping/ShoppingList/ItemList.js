/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {View, Text} from 'react-native';
import PanelItemList from './PanelItemList';
import {List, Flex, Icon, Modal} from '@ant-design/react-native';
import ItemOfList from './ItemOfList';
import Swipeout from 'react-native-swipeout';
import RNFetchBlob from 'react-native-fetch-blob';

export default function ItemList(props) {
  const right = [
    {
      text: (
        <Flex direction="column" style={{backgroundColor: 'white'}}>
          <Icon name="info" color="#0099FF" size={20} />
          <Text style={{color: '#0099FF', fontSize: 13}}>Chi tiết</Text>
        </Flex>
      ),
      onPress: () => {
        console.log('chi tiết');
        props.navigator.navigate('DetailShoppingList', {data: props.data});
      },
      backgroundColor: 'white',
      style: {
        backgroundColor: 'red',
        color: 'white',
        fontSize: 15,
        margin: 5,
        marginTop: 10,
      },
    },
    {
      text: (
        <Flex direction="column" style={{backgroundColor: 'white'}}>
          <Icon name="delete" color="red" size={20} />
          <Text style={{color: 'red', fontSize: 13}}>Xoá</Text>
        </Flex>
      ),
      onPress: () => {
        console.log('click nè');
        Modal.alert('Xác nhận', 'Bạn có chắc muốn xóa danh sách này?', [
          {text: 'Hủy', style: 'cancel'},
          {
            text: 'Xác nhận',
            onPress: () => {
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/delete-shopping-list',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({slID: props.data._id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getShoppingList();
                }
                console.log(t);
              });
            },
          },
        ]);
      },
      backgroundColor: 'white',
      style: {
        backgroundColor: 'red',
        color: 'white',
        fontSize: 15,
        margin: 5,
        marginTop: 10,
      },
    },
  ];
  const register = {
    text: (
      <Flex direction="column" style={{backgroundColor: 'white'}}>
        <Icon name="user-add" color="green" size={20} />
        <Text style={{color: 'green', fontSize: 13}}>Đăng ký</Text>
      </Flex>
    ),
    onPress: () => {
      console.log('click nè');
      Modal.alert('Xác nhận', 'Bạn có chắc muốn đăng ký mua danh sách này?', [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xác nhận',
          onPress: () => {
            RNFetchBlob.fetch(
              'POST',
              'https://househelperapp-api.herokuapp.com/assign-shopping-list',
              {
                Authorization: 'Bearer ' + props.token,
                'Content-Type': 'application/json',
              },
              JSON.stringify({slID: props.data._id}),
            ).then(res => {
              const t = res.json();
              if (t.code === 2020) {
                props.getShoppingList();
              }
              console.log(t);
            });
          },
        },
      ]);
    },
    backgroundColor: 'white',
    style: {
      backgroundColor: 'red',
      color: 'white',
      fontSize: 15,
      margin: 5,
      marginTop: 10,
    },
  };
  if (props.data.assign === null) {
    right.push(register);
  }
  return (
    <Swipeout
      autoClose
      style={{
        backgroundColor: 'white',
      }}
      right={right}
      onOpen={() => console.log('open')}
      onClose={() => console.log('close')}>
      <PanelItemList
        title={props.data.name}
        length={props.data.listItems.length + 1}
        assign={props.data.assign}>
        <List>
          {props.data.listItems.map(item => (
            <ItemOfList
              data={item}
              listID={props.data._id}
              token={props.token}
            />
          ))}
        </List>
      </PanelItemList>
    </Swipeout>
  );
}
