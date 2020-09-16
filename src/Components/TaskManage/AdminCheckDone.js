/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Switch,
  Platform,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import {Flex, Modal} from '@ant-design/react-native';

export default function AdminCheckDone(props) {
  // const [listMember, setlistMember] = useState(null);

  const [tmpID, settmpID] = useState('');
  // console.log(props);
  //   const getlistMember = () => {
  //     return RNFetchBlob.fetch(
  //       'GET',
  //       'https://househelperapp-api.herokuapp.com/list-member',
  //       {
  //         Authorization: 'Bearer ' + props.token,
  //         // more headers  ..
  //       },
  //     ).then(res => {
  //       const t = res.json();
  //       setlistMember(t.listMembers);
  //     });
  //   };
  //   useEffect(() => {
  //     getlistMember();
  //   }, []);
  //const [keyMember, setkeyMember] = useState(null);
  //   const handleCheckMember = index => {
  //     props.tmpID = index;
  //   };
  //   // console.log(props.tmpID);
  //   const styles = StyleSheet.create({
  //     container: {
  //       flex: 1,
  //       justifyContent: 'center',
  //     },
  //     horizontal: {
  //       flexDirection: 'row',
  //       justifyContent: 'space-around',
  //       padding: 10,
  //     },
  //   });
  // console.log(props.keyMember);
  return (
    <Flex justify="around" wrap="wrap">
      {props.assign !== null
        ? props.assign.mAssigns.map(item => (
            <Flex direction="column" style={{margin: 7.5}}>
              <TouchableOpacity
                onPress={() => {
                  settmpID(item.mID._id);
                  console.log(tmpID);
                }}>
                <Image
                  style={
                    tmpID === item.mID.mName
                      ? {
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          borderColor: '#0099FF',
                          borderWidth: 2.5,
                          opacity: 0.4,
                          backgroundColor: item.mID.mAvatar.color,
                        }
                      : {
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          borderColor: 'black',
                          borderWidth: 0.5,
                          opacity: 0.4,
                          backgroundColor: item.mID.mAvatar.color,
                        }
                  }
                  source={{uri: item.mID.mAvatar.image}}
                  id={item.mID._id}
                />
              </TouchableOpacity>
              <View>
                <Text numberOfLines={1} style={{maxWidth: 62}}>
                  {item.mID.mName}
                </Text>
              </View>
            </Flex>
          ))
        : props.listMember.map(item => (
            <Flex direction="column" style={{margin: 7.5}}>
              <TouchableOpacity
                onPress={() => {
                  settmpID(item.mID._id);
                  console.log(tmpID);
                }}>
                <Image
                  style={
                    tmpID === item.mName
                      ? {
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          borderColor: '#0099FF',
                          borderWidth: 2.5,
                          opacity: 0.4,
                          backgroundColor: item.mAvatar.color,
                        }
                      : {
                          width: 50,
                          height: 50,
                          borderRadius: 25,
                          borderColor: 'black',
                          borderWidth: 0.5,
                          opacity: 0.4,
                          backgroundColor: item.mAvatar.color,
                        }
                  }
                  source={{uri: item.mAvatar.image}}
                  id={item._id}
                />
              </TouchableOpacity>
              <View>
                <Text numberOfLines={1} style={{maxWidth: 62}}>
                  {item.mName}
                </Text>
              </View>
            </Flex>
          ))}
    </Flex>
  );
}
