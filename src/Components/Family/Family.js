/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FamilyMain from './FamilyMain';
import {Flex, Icon} from '@ant-design/react-native';
import {Text} from 'react-native';

export default function Family(props) {
  const token = props.token;
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="FamilyMain"
          component={FamilyMain}
          initialParams={{token: token}}
          options={({navigation}) => ({
            headerTitle: () => (
              <Flex>
                <Icon name="home" style={{color: 'green'}} size={28} />
                <Text style={{fontSize: 20, marginLeft: 10}}>
                  Quản lý gia đình
                </Text>
              </Flex>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
