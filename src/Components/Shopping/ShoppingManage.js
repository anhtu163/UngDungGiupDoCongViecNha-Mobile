/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon, Button, Flex} from '@ant-design/react-native';
import {Text, View} from 'react-native';

import ShoppingList from './ShoppingList/ShoppingList';
import AddShoppingList from './AddAndDetailShoppingList/AddShoppingList';
import DetailShoppingList from './AddAndDetailShoppingList/DetailShoppingList';
import AddShoppingType from './ShoppingType/AddShoppingType';
import DetailsShoppingType from './ShoppingType/DetailsShoppingType';
import ImageBill from './AddAndDetailShoppingList/ImageBill';

export default function TaskManage(props) {
  const Stack = createStackNavigator();
  const token = props.token;
  //const user = props.user;
  //   const AuthContext = props.AuthContext;
  const socket = props.socket;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingList}
          initialParams={{
            token: token,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon
                  style={{color: '#0099FF'}}
                  size={30}
                  name="shopping-cart"
                />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Danh sách mua sắm
                </Text>
              </Flex>
            ),
            headerRight: () => (
              <View>
                <Button
                  icon={<Icon name="plus" />}
                  type="ghost"
                  style={{borderColor: 'white'}}
                  onPress={() => navigation.navigate('AddShoppingList')}>
                  <Text style={{fontSize: 35}}>+</Text>
                </Button>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="AddShoppingList"
          component={AddShoppingList}
          initialParams={{
            token: token,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon
                  style={{color: '#0099FF'}}
                  size={30}
                  name="shopping-cart"
                />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Thêm danh sách
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="DetailShoppingList"
          component={DetailShoppingList}
          initialParams={{
            token: token,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon
                  style={{color: '#0099FF'}}
                  size={30}
                  name="shopping-cart"
                />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Chi tiết danh sách
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="ImageBill"
          component={ImageBill}
          initialParams={{
            token: token,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon
                  style={{color: '#0099FF'}}
                  size={30}
                  name="shopping-cart"
                />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Chi tiết ảnh hóa đơn
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="AddShoppingType"
          component={AddShoppingType}
          initialParams={{
            token: token,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon
                  style={{color: '#0099FF'}}
                  size={30}
                  name="shopping-cart"
                />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Thêm loại mua sắm
                </Text>
              </Flex>
            ),
          })}
        />
        <Stack.Screen
          name="DetailsShoppingType"
          component={DetailsShoppingType}
          initialParams={{
            token: token,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon
                  style={{color: '#0099FF'}}
                  size={30}
                  name="shopping-cart"
                />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Chi tiết loại mua sắm
                </Text>
              </Flex>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
