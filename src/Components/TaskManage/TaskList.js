/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {useState, useEffect, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator, ScrollView} from 'react-native';
import {List, Button} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import TaskItem from './TaskItem';

export default function TaskView({navigation, route}) {
  // const navigation = props.navigation;
  const {token} = route.params;
  const {AuthContext} = route.params;
  // console.log(route.params);
  const {signOut} = React.useContext(AuthContext);
  const [tasklist, setTaskList] = useState(null);
  //console.log('Bearer ' + token);
  const getlist = useCallback(() => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-task',
      {
        Authorization: 'Bearer ' + token,
        // more headers  ..
      },
    ).then(res => {
      const r = res.json();
      setTaskList(r.listTasks);
    });
  });
  useEffect(() => {
    getlist();
  }, [getlist, tasklist]);

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
                  token={token}
                />
              ))}
          </List>
          <Button onPress={() => signOut()}>Đăng xuất</Button>
        </ScrollView>
      </View>
    );
  }
}
