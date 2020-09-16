/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Image} from 'react-native';

export default function ImageBill({route}) {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={{uri: route.params.img}}
        style={{height: 550, width: 350, resizeMode: 'contain'}}
      />
    </View>
  );
}
