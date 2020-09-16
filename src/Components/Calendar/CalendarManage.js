/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon, Flex} from '@ant-design/react-native';
import {Text} from 'react-native';
import CalendarMain from './CalendarMain';
import AddEvent from './AddEvent';
import DetailEvent from './DetailEvent';
export default function CalendarManage(props) {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="CalendarMain"
          component={CalendarMain}
          initialParams={{
            token: props.token,
            socket: props.socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon style={{color: '#0099FF'}} size={30} name="file-done" />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Quản lý lịch trình
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="AddEvent"
          component={AddEvent}
          initialParams={{
            token: props.token,
          }}
          options={({route}) => ({
            headerTitle: () => (
              <Flex>
                <Icon style={{color: '#0099FF'}} size={25} name="plus-square" />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Thêm mới sự kiện
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="DetailEvent"
          component={DetailEvent}
          initialParams={{
            token: props.token,
          }}
          options={({route}) => ({
            headerTitle: () => (
              <Flex>
                <Icon style={{color: '#0099FF'}} size={25} name="plus-square" />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Chi tiết sự kiện
                </Text>
              </Flex>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
