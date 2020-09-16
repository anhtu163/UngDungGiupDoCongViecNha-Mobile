/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Animated,
  Image,
} from 'react-native';
import {IconFill} from '@ant-design/icons-react-native';
import {Badge, Flex} from '@ant-design/react-native';

export default function PanelItemList(props) {
  // console.log(props.length);
  const [icons, seticons] = useState({
    up: 'caret-up',
    down: 'caret-down',
  });
  const [expanded, setexpanded] = useState(false);
  const [maxHeight, setmaxHeight] = useState(0);
  const [minHeight, setminHeight] = useState(0);
  const [statePanel, setstatePanel] = useState({
    title: props.title,
    animation: new Animated.Value(33),
  });
  useEffect(() => {
    // if (props.length - 1 === 0) {
    //   setexpanded(false);
    // }
    setstatePanel({
      title: props.title,
      animation: new Animated.Value(33),
    });
  }, [props.length, props.title]);
  const toggle = () => {
    //Step 1
    let initialValue = expanded ? maxHeight + minHeight : minHeight;
    let finalValue = expanded ? minHeight : maxHeight + minHeight;

    setexpanded(!expanded);
    statePanel.animation.setValue(initialValue);

    Animated.spring(
      //Step 4
      statePanel.animation,
      {
        toValue: finalValue,
        duration: 80,
      },
    ).start(); //Step 5
  };

  const _setMaxHeight = event => {
    setmaxHeight(event.nativeEvent.layout.height);
  };

  const _setMinHeight = event => {
    setminHeight(event.nativeEvent.layout.height);
  };

  const styles1 = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      margin: 5,
      overflow: 'hidden',
    },
    titleContainer: {
      flexDirection: 'row',
      padding: 2,
    },
    title: {
      flex: 1,
      padding: 5,
      color: '#2a2f43',
      fontWeight: 'bold',
      fontSize: 16,
    },
    button: {},
    buttonImage: {
      paddingTop: 10,
      width: 30,
      height: 30,
    },
    body: {
      padding: 10,
      paddingTop: 0,
    },
  });

  //Step 5
  return (
    <Animated.View style={[styles1.container, {height: statePanel.animation}]}>
      <View onLayout={_setMinHeight.bind(this)}>
        <TouchableHighlight
          style={styles1.button}
          onPress={toggle.bind(this)}
          underlayColor="#f1f1f1">
          <View style={styles1.titleContainer}>
            <Text style={styles1.title}>{statePanel.title}</Text>

            <Text
              style={{
                padding: 5,
                color: '#2a2f43',
                fontWeight: 'bold',
                fontSize: 16,
                marginRight: 5,
              }}>
              ({props.length - 1})
            </Text>
            {props.assign ? (
              <Image
                style={{
                  marginTop: 5,
                  marginRight: 5,
                  width: 25,
                  height: 25,
                  borderRadius: 30,
                  borderColor: '#0099FF',
                  borderWidth: 2,
                  opacity: props.assign.mAvatar.color ? 0.6 : 2,
                  backgroundColor: props.assign.mAvatar.color,
                }}
                source={{uri: props.assign.mAvatar.image}}
              />
            ) : (
              <View style={{marginTop: 5, marginRight: 5, width: 25}} />
            )}
            <IconFill
              style={styles1.buttonImage}
              name={expanded ? 'caret-up' : 'caret-down'}
              color="#0099FF"
            />
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles1.body} onLayout={_setMaxHeight.bind(this)}>
        {props.children}
      </View>
    </Animated.View>
  );
}
