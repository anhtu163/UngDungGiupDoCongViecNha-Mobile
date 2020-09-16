/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Card, Flex, Icon} from '@ant-design/react-native';
export default function Setting({navigation, route}) {
  const {AuthContext} = route.params;
  const {signOut} = React.useContext(AuthContext);
  const {socket} = route.params;
  //console.log('socket ở setting: ' + route.params);
  //const ENDPOINT = 'https://househelperapp-api.herokuapp.com';
  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Card style={{padding: 10, margin: 5, marginBottom: 0, elevation: 0}}>
          <Flex align="center">
            <Icon
              name="user"
              size={28}
              color="#0099FF"
              style={{marginLeft: 20}}
            />
            <Flex.Item>
              <Flex justify="center">
                <Text style={{fontSize: 19}}>Thông tin tài khoản</Text>
              </Flex>
            </Flex.Item>
          </Flex>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('FamilyInformation')}>
        <Card style={{padding: 10, margin: 5, marginBottom: 0, elevation: 0}}>
          <Flex align="center">
            <Icon
              name="lock"
              size={28}
              color="#0099FF"
              style={{marginLeft: 20}}
            />
            <Flex.Item>
              <Flex justify="center">
                <Text style={{fontSize: 19}}>Thông tin gia đình</Text>
              </Flex>
            </Flex.Item>
          </Flex>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          socket.disconnect();
          signOut();
        }}>
        <Card style={{padding: 10, margin: 5, marginBottom: 0, elevation: 0}}>
          <Flex align="center">
            <Icon
              name="logout"
              size={28}
              color="#0099FF"
              style={{marginLeft: 20}}
            />
            <Flex.Item>
              <Flex justify="center">
                <Text style={{fontSize: 19}}>Đăng xuất</Text>
              </Flex>
            </Flex.Item>
          </Flex>
        </Card>
      </TouchableOpacity>
    </View>
  );
}
