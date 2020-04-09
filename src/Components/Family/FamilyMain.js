/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, ActivityIndicator} from 'react-native';

import {
  Flex,
  Badge,
  Card,
  Icon,
  // Toast,
} from '@ant-design/react-native';
import RNFetchBlob from 'react-native-fetch-blob';

export default function FamilyMain({navigation, route}) {
  const {token} = route.params;
  const [listMember, setlistMember] = useState(null);
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
  });
  const getlistMember = () => {
    return RNFetchBlob.fetch(
      'GET',
      'https://househelperapp-api.herokuapp.com/list-member',
      {
        Authorization: 'Bearer ' + token,
        // more headers  ..
      },
    ).then(res => {
      const t = res.json();
      setlistMember(t.listMembers);
      console.log(t.listMembers);
    });
  };
  useEffect(() => {
    getlistMember();
  }, []);
  console.log(listMember);
  return (
    <View style={{marginTop: 10, margin: 5}}>
      <Card style={{padding: 5}}>
        <Flex style={{marginTop: 5}}>
          <Icon name="team" color="black" size="md" />
          <Text
            style={{
              color: 'green',
              fontSize: 18,
              marginLeft: 5,
              marginBottom: 5,
            }}>
            Thành viên gia đình
          </Text>
        </Flex>
        {listMember === null ? (
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator size="large" color="green" />
          </View>
        ) : (
          <Flex justify="around" style={{marginTop: 10, margin: 5}} wrap="wrap">
            {listMember.map(item => (
              <Flex direction="column" style={{margin: 5}}>
                <Badge text={item.mPoints || '0'}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      borderColor: 'black',
                      borderWidth: 0.5,
                      opacity: 0.4,
                      backgroundColor: item.mAvatar.color,
                    }}
                    source={{uri: item.mAvatar.image}}
                    id={item._id}
                  />
                </Badge>
                <View>
                  <Text numberOfLines={1} style={{width: 60}}>
                    {item.mName}
                  </Text>
                </View>
              </Flex>
            ))}
          </Flex>
        )}
      </Card>
    </View>
  );
}
