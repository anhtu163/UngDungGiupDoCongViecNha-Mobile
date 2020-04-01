/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon, Button} from '@ant-design/react-native';
import {Text, View} from 'react-native';

import AddTask from './AddTask';
import TaskList from './TaskList';
import TaskDetails from './TaskDetails';
import Login from '../Login/Login';

export default class TaskManage extends Component {
  Stack = createStackNavigator();

  render() {
    return (
      <NavigationContainer>
        <this.Stack.Navigator>
          <this.Stack.Screen
            name="TaskList"
            component={TaskList}
            options={({navigation}) => ({
              headerTitle: () => (
                <Icon style={{color: 'green'}} size="lg" name="file-done" />
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
          <this.Stack.Screen
            name="AddTask"
            component={AddTask}
            options={() => ({
              headerTitle: props => (
                <View>
                  <Text style={{fontSize: 20}}>Add New Task</Text>
                </View>
              ),
            })}
          />
          <this.Stack.Screen
            name="TaskDetails"
            component={TaskDetails}
            options={() => ({
              headerTitle: props => (
                <View>
                  <Text style={{fontSize: 20}}>Task Details</Text>
                </View>
              ),
            })}
          />
          <this.Stack.Screen
            name="Login"
            component={Login}
            options={() => ({
              headerTitle: props => (
                <View>
                  <Text style={{fontSize: 20}}>Login</Text>
                </View>
              ),
            })}
          />
        </this.Stack.Navigator>
      </NavigationContainer>
    );
  }
}
