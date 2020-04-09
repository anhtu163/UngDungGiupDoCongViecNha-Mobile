/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon, Button, Flex} from '@ant-design/react-native';
import {Text, View} from 'react-native';

import AddTask from './AddTask';
import TaskList from './TaskList';
import TaskDetails from './TaskDetails';
import Login from '../Login/Login';

export default function TaskManage(props) {
  const Stack = createStackNavigator();
  const token = props.token;
  const AuthContext = props.AuthContext;
  // console.log('token của TaskManage: ' + token);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TaskList"
          component={TaskList}
          initialParams={{token: token, AuthContext: AuthContext}}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon style={{color: 'green'}} size={30} name="file-done" />
                <Text style={{fontSize: 20, marginLeft: 10}}>Task Manage</Text>
              </Flex>
            ),
            headerRight: () => (
              <Button
                icon={<Icon name="plus" />}
                type="ghost"
                style={{borderColor: 'white'}}
                onPress={() => navigation.navigate('AddTask')}>
                <Text style={{fontSize: 35}}>+</Text>
              </Button>
            ),
          })}
        />
        <Stack.Screen
          name="AddTask"
          component={AddTask}
          initialParams={{token: token}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Add New Task</Text>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetails}
          initialParams={{token: token}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Task Details</Text>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
