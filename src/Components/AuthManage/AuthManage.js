/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {View} from 'react-native';

import Login from '../Login/Login';
import Register from '../Register/Register';
import NewFamily from '../Register/NewFamily';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

export default function AuthManage(props) {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
          // options={({navigation}) => ({
          //   headerTitle: () => (
          //     <View style={{backgroundColor: 'transparent'}} />
          //   ),
          // })}
          initialParams={{
            AuthContext: props.AuthContext,
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{headerShown: false}}
          // options={({navigation}) => ({
          //   headerTitle: () => <View />,
          // })}
        />
        <Stack.Screen
          name="NewFamily"
          component={NewFamily}
          // options={({navigation}) => ({
          //   headerTitle: () => <View />,
          // })}
          options={{headerShown: false}}
          initialParams={{
            AuthContext: props.AuthContext,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={({navigation}) => ({
            headerTitle: () => <View />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
