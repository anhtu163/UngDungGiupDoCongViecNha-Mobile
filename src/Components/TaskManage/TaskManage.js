/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon, Button, Flex} from '@ant-design/react-native';
import {Text, View} from 'react-native';

import AddTask from './AddTask';
import TaskList from './TaskList';
import TaskDetails from './TaskDetails';
import AddTaskCategory from './AddTaskCategory';
import EditTaskCategory from './EditTaskCategory';

export default function TaskManage(props) {
  const Stack = createStackNavigator();
  const token = props.token;
  const user = props.user;
  const AuthContext = props.AuthContext;
  const socket = props.socket;
  // const [user, setuser] = useState('');
  // const getUser = useCallback(() => {
  //   RNFetchBlob.fetch('GET', 'https://househelperapp-api.herokuapp.com/me', {
  //     Authorization: 'Bearer ' + token,
  //   }).then(res => {
  //     const t = res.json();
  //     setuser(t.userInfo);
  //   });
  // });
  // useEffect(() => {
  //   getUser();
  // }, []);

  // console.log(sk);
  // console.log('token của TaskManage: ' + token);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TaskList"
          component={TaskList}
          initialParams={{
            token: token,
            AuthContext: AuthContext,
            user: user,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon style={{color: '#0099FF'}} size={30} name="file-done" />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Quản lý công việc
                </Text>
              </Flex>
            ),
            headerRight: () => (
              <View>
                {user.mIsAdmin && (
                  <Button
                    icon={<Icon name="plus" />}
                    type="ghost"
                    style={{borderColor: 'white'}}
                    onPress={() => navigation.navigate('AddTask')}>
                    <Text style={{fontSize: 35}}>+</Text>
                  </Button>
                )}
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTask}
          initialParams={{token: token, socket: socket}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Thêm mới công việc</Text>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetails}
          initialParams={{token: token, socket: socket}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Chi tiết công việc</Text>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="AddTaskCategory"
          component={AddTaskCategory}
          initialParams={{token: token}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Thêm loại công việc</Text>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="EditTaskCategory"
          component={EditTaskCategory}
          initialParams={{token: token}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Chỉnh sửa loại công việc</Text>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
