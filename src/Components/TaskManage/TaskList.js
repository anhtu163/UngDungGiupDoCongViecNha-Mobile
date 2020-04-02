/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {List, Button} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import TaskItem from './TaskItem';

export default function TaskView(props) {
  const navigation = props.navigation;
  const [tasklist, setTaskList] = useState(null);
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
    getlist();
  }, [tasklist]);

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

  // console.log(tasklist);
  if (tasklist === null) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  } else {
    return (
      <View style={{paddingTop: 10, margin: 5}}>
        <ScrollView>
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
                  assign={item.assign}
                  category={item.tcID}
                  navigator={navigation}
                  getlist={getlist}
                />
              ))}
          </List>
          <Button onPress={() => navigation.navigate('Login')}>
            Đăng nhập
          </Button>
        </ScrollView>
      </View>
    );
  }
}
