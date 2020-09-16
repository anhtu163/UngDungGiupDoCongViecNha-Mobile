/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  Image,
  // StyleSheet,
  // ActivityIndicator,
  // TouchableOpacity,
} from 'react-native';

import {
  Flex,
  // Badge,
  Card,
  Icon,
  // Button,
  // Provider,
  // InputItem,
  SwipeAction,
  Modal,
  // Toast,
} from '@ant-design/react-native';
import Swipeout from 'react-native-swipeout';
// import {IconFill} from '@ant-design/icons-react-native';
// import {Textarea} from 'native-base';
// import {ScrollView} from 'react-native-gesture-handler';
import RNFetchBlob from 'react-native-fetch-blob';

export default function NewsItem(props) {
  // const [like, setlike] = useState(false);
  // const [comment, setcomment] = useState(false);
  const content = props.content;
  const owner = props.owner;
  const subject = props.subject;
  const dt = new Date(props.date);
  const id = props.id;
  const date =
    dt.getDate() > 10 && dt.getMonth() + 1 > 10
      ? dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear()
      : dt.getDate() < 10 && dt.getMonth() + 1 > 10
      ? '0' + dt.getDate() + '/' + (dt.getMonth() + 1) + '/' + dt.getFullYear()
      : dt.getDate() > 10 && dt.getMonth() + 1 < 10
      ? dt.getDate() + '/0' + (dt.getMonth() + 1) + '/' + dt.getFullYear()
      : '0' +
        dt.getDate() +
        '/0' +
        (dt.getMonth() + 1) +
        '/' +
        dt.getFullYear();
  const right = [
    {
      text: (
        <Flex direction="column" style={{backgroundColor: 'red'}}>
          <Icon name="delete" color="white" />
          <Text style={{color: 'white'}}>Xoá</Text>
        </Flex>
      ),
      onPress: () => {
        console.log('click nè');
        Modal.alert('Xác nhận', 'Bạn có chắc muốn xóa tin này?', [
          {text: 'Hủy', style: 'cancel'},
          {
            text: 'Xác nhận',
            onPress: () => {
              RNFetchBlob.fetch(
                'POST',
                'https://househelperapp-api.herokuapp.com/delete-news',
                {
                  Authorization: 'Bearer ' + props.token,
                  'Content-Type': 'application/json',
                },
                JSON.stringify({nID: id}),
              ).then(res => {
                const t = res.json();
                if (t.code === 2020) {
                  props.getlistNews();
                }
                console.log(t);
              });
            },
          },
        ]);
      },
      backgroundColor: 'red',
      style: {
        backgroundColor: 'red',
        color: 'white',
        fontSize: 15,
        margin: 5,
        marginTop: 10,
      },
    },
  ];
  return (
    <Swipeout
      autoClose
      style={{
        marginTop: 10,
        marginRight: 2,
        marginLeft: 2,
        elevation: 10,
      }}
      right={props.isAdmin && right}
      onOpen={() => console.log('open')}
      onClose={() => console.log('close')}>
      <Card style={{}}>
        <View style={{}}>
          <Flex
            justify="start"
            style={{marginTop: 5, margin: 5, marginBottom: -5, padding: 2}}
            wrap="wrap">
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 50,
                borderColor: 'gray',
                borderWidth: 2,
                margin: 10,
                opacity: owner.mAvatar.color ? 0.6 : 1,
                backgroundColor: owner.mAvatar.color,
              }}
              source={{
                uri: owner.mAvatar.image,
              }}
            />
            <View style={{flex: 1, justifyContent: 'flex-start', padding: 5}}>
              <Text style={{fontSize: 17, fontWeight: '200'}}>
                {owner.mName}
              </Text>
              <Text>{date}</Text>
            </View>
          </Flex>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              padding: 5,
              marginLeft: 25,
              marginBottom: 10,
            }}>
            <Text style={{fontSize: 16, color: '#0099FF'}}>({subject})</Text>
            <Text style={{fontSize: 16, marginRight: 10}}>{content}</Text>
          </View>
        </View>
      </Card>
    </Swipeout>
  );
}

{
  /* <View style={{backgroundColor: 'gray', height: 0.5, margin: 5}} />
        <Flex style={{margin: 10}}>
          <TouchableOpacity onPress={() => setlike(!like)}>
            <View style={{width: 50}}>
              {like ? (
                <IconFill name="heart" color="#e74c3c" style={{fontSize: 26}} />
              ) : (
                <IconFill name="heart" color="gray" style={{fontSize: 26}} />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setcomment(!comment)}>
            <View style={{width: 50}}>
              {comment ? (
                <IconFill
                  name="message"
                  color="#0099FF"
                  style={{fontSize: 26}}
                />
              ) : (
                <IconFill name="message" color="gray" style={{fontSize: 26}} />
              )}
            </View>
          </TouchableOpacity>
        </Flex>
      </View>
      <View>
        {comment && (
          <View>
            <View style={{backgroundColor: 'gray', height: 0.5, margin: 5}} />
            <View>
              <Flex align="start" justify="start">
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    borderColor: 'gray',
                    borderWidth: 2,
                    margin: 10,
                    marginTop: 5,
                  }}
                  source={{
                    uri:
                      'http://getdrawings.com/free-icon-bw/gta-v-icon-22.jpg',
                  }}
                />
                <Flex direction="column" style={{backgroundColor: ''}}>
                  <Flex justify="start">
                    <Text style={{fontSize: 17}}>Tên thành viên</Text>
                  </Flex>
                  <Flex
                    justify="center"
                    wrap="wrap"
                    style={{padding: 10, width: 330}}>
                    <Text>
                      Bình luận cái quần què gì đó mà mà t cũng không biết ghi
                      gì thêm nữa, ghi cho nó dài ra để test cái wrap chứ không
                      có gì đâu. Sau này mới đổ dữ liệu vào đó mà{' '}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </View>
            <View
              style={{
                borderColor: 'gray',
                borderWidth: 0.5,
                margin: 10,
                borderRadius: 25,
              }}>
              <InputItem
                clear
                // value={this.state.value}
                // onChange={value => {
                //   this.setState({
                //     value,
                //   });
                // }}
                extra={<Icon name="arrow-right" color="#0099FF" />}
                onExtraClick={() => console.log('Extra click')}
                placeholder="Viết bình luận"
              />
            </View>
          </View>
        )}
      </View> */
}
