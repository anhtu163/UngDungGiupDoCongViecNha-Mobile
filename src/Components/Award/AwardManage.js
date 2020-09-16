/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Icon, Flex, Button} from '@ant-design/react-native';
import {Text, View} from 'react-native';
import AwardMain from './AwardMain';
import AddAward from './AddAward';
import AwardDetails from './AwardDetails';

export default function AwardManage(props) {
  const Stack = createStackNavigator();
  const token = props.token;
  const user = props.user;
  const AuthContext = props.AuthContext;
  const socket = props.socket;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="AwardMain"
          component={AwardMain}
          initialParams={{
            token: token,
            AuthContext: AuthContext,
            user: user,
            socket: socket,
          }}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon style={{color: '#0099FF'}} size={30} name="gift" />
                <Text style={{fontSize: 20, marginLeft: 10}}>Nhận thưởng</Text>
              </Flex>
            ),
            headerRight: () => (
              <View>
                {user.mIsAdmin && (
                  <Button
                    icon={<Icon name="plus" />}
                    type="ghost"
                    style={{borderColor: 'white'}}
                    onPress={() => navigation.navigate('AddAward')}>
                    <Text style={{fontSize: 35}}>+</Text>
                  </Button>
                )}
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="AwardDetails"
          component={AwardDetails}
          initialParams={{token: token, user: user}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Chi tiết phần thưởng</Text>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="AddAward"
          component={AddAward}
          initialParams={{token: token}}
          options={() => ({
            headerTitle: () => (
              <View>
                <Text style={{fontSize: 20}}>Thêm phần thưởng mới</Text>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
