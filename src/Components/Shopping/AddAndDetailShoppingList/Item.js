/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {List, Card, Flex, Icon} from '@ant-design/react-native';

export default function Item(props) {
  return (
    <List.Item style={{minHeight: 50, padding: 5}}>
      <Flex align="center">
        <View style={{flex: 1, margin: 5}}>
          <Text style={{fontSize: 15, marginLeft: -10}}>
            {(props.index + 1).toString()}.
          </Text>
        </View>
        <View style={{flex: 4, margin: 5}}>
          <Text style={{fontSize: 15, marginLeft: -10}}>{props.dt.name}</Text>
        </View>
        <View style={{flex: 2}}>
          <Image
            style={{
              height: 40,
              width: 40,
              borderRadius: 50,
              borderColor: '#0099FF',
              borderWidth: 2,
            }}
            source={{uri: props.dt.photo}}
          />
        </View>

        <View style={{flex: 4, margin: 5}}>
          <Text style={{fontSize: 16, color: 'gray'}}>{props.dt.details}</Text>
        </View>
        <TouchableOpacity onPress={() => props.handleRemove(props.index)}>
          <Icon
            name="close"
            size="xxs"
            style={{marginTop: 4, marginRight: -5}}
            color="gray"
          />
        </TouchableOpacity>
      </Flex>
    </List.Item>
  );
}
