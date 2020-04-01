/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React from 'react';
import {List, SwipeAction} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function TaskItem(props) {
  const right = [
    {
      text: 'Done',
      onPress: () => {
        console.log('done');
      },
      style: {backgroundColor: 'white', color: '#2ecc71', fontSize: 15},
    },
    {
      text: 'Details',
      onPress: () =>
        props.navigator.navigate('TaskDetails', {
          name: props.name,
          time: props.time,
          point: props.point,
          date: props.date,
          note: props.note,
          img: props.img,
          id: props.id,
        }),
      style: {backgroundColor: 'white', color: '#3498db', fontSize: 15},
    },
    {
      text: 'Delete',
      onPress: () =>
        RNFetchBlob.fetch(
          'POST',
          'https://househelperapp-api.herokuapp.com/delete-task',
          {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k',
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
  return (
    <SwipeAction
      autoClose
      style={{backgroundColor: 'transparent'}}
      right={right}
      onOpen={() => console.log('open')}
      onClose={() => console.log('close')}>
      <List.Item extra={props.extra}>{props.name}</List.Item>
    </SwipeAction>
  );
}
