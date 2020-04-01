/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {List, Button} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import TaskItem from './TaskItem';

export default function TaskView(props) {
  const navigation = props.navigation;
  const [tasklist, setTaskList] = useState([]);
  const getlist = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-task',
      {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k',
        // more headers  ..
      },
    ).then(res => {
      const r = res.json();
      setTaskList(r.listTasks);
    });
  };
  useEffect(() => {
    // Update the document title using the browser API
    getlist();
  }, []);

  //const st = this.props;
  // getlist();
  console.log(tasklist);
  if (!tasklist) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <View style={{paddingTop: 10}}>
        <List>
          {tasklist &&
            tasklist.map(item => (
              <TaskItem
                extra={item.points}
                name={item.name}
                time={item.time}
                point={item.points}
                date={new Date()}
                note={item.notes || ''}
                img={item.photo}
                id={item._id}
                navigator={navigation}
                getlist={getlist}
              />
            ))}
        </List>
        <Button onPress={() => navigation.navigate('Login')}>Đăng nhập</Button>
      </View>
    );
  }
}
