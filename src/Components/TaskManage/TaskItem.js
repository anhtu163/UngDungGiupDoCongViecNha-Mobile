/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React from 'react';
import {Image, Text, View} from 'react-native';
import {List, SwipeAction, Icon, Flex} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function TaskItem(props) {
  const right = [
    {
      text: (
        <Flex direction="column">
          <Icon name="check" color="green" />
          <Text>Done</Text>
        </Flex>
      ),
      onPress: () => {
        console.log('done');
      },
      style: {backgroundColor: 'white', color: '#2ecc71', fontSize: 15},
    },
    {
      text: (
        <Flex direction="column">
          <Icon name="exclamation" color="blue" />
          <Text>Details</Text>
        </Flex>
      ),
      onPress: () =>
        props.navigator.navigate('TaskDetails', {
          name: props.name,
          time: props.time,
          point: props.point,
          date: props.date,
          note: props.note,
          img: props.img,
          assign: props.assign,
          category: props.category,
          id: props.id,
          token: props.token,
        }),
      style: {backgroundColor: 'white', color: '#3498db', fontSize: 15},
    },
    {
      text: (
        <Flex direction="column">
          <Icon name="delete" color="red" />
          <Text>Delete</Text>
        </Flex>
      ),
      onPress: () =>
        RNFetchBlob.fetch(
          'POST',
          'https://househelperapp-api.herokuapp.com/delete-task',
          {
            Authorization: 'Bearer ' + props.token,
            'Content-Type': 'application/json',
          },
          JSON.stringify({id: props.id}),
          //JSON.stringify({id: props.id}),
        ).then(res => {
          const t = res.json();
          props.getlist();
          console.log(t);
        }),
      style: {backgroundColor: 'white', color: '#e74c3c', fontSize: 15},
    },
  ];
  const date = new Date();
  const defaultD =
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    (date.getYear() + 1900);
  return (
    <SwipeAction
      autoClose
      style={{backgroundColor: 'transparent'}}
      right={right}
      onOpen={() => console.log('open')}
      onClose={() => console.log('close')}>
      <List.Item
        style={{
          padding: 2,
        }}
        extra={
          props.assign &&
          props.assign.mAssigns.map(item => (
            <Image
              style={{
                width: 20,
                height: 20,
                borderRadius: 25,
                borderColor: 'green',
                borderWidth: 2,
                opacity: 0.4,
                backgroundColor: item.mID.mAvatar.color,
              }}
              source={{uri: item.mID.mAvatar.image}}
            />
          ))
        }>
        {props.name}
        <Text style={{color: 'gray', fontSize: 13}}>{defaultD}</Text>
      </List.Item>
    </SwipeAction>
  );
}
