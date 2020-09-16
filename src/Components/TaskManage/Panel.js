/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Animated,
} from 'react-native';
import {IconFill} from '@ant-design/icons-react-native';
import {Badge} from '@ant-design/react-native';

export default function Panel(props) {
  // console.log(props.length);
  const [icons, seticons] = useState({
    up: 'caret-up',
    down: 'caret-down',
  });
  const [expanded, setexpanded] = useState(true);
  const [maxHeight, setmaxHeight] = useState(0);
  const [minHeight, setminHeight] = useState(0);
  const [statePanel, setstatePanel] = useState({
    title: props.title,
    animation: new Animated.Value(props.length * 52),
  });
  useEffect(() => {
    if (props.length - 1 === 0) {
      setexpanded(false);
    }
    setstatePanel({
      title: props.title,
      animation: new Animated.Value(props.length * 52),
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
      padding: 5,
    },
    title: {
      flex: 1,
      padding: 10,
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
    <Animated.View
      style={[
        styles1.container,
        {height: statePanel.animation, elevation: 10},
      ]}>
      <View onLayout={_setMinHeight.bind(this)}>
        <TouchableHighlight
          style={styles1.button}
          onPress={toggle.bind(this)}
          underlayColor="#f1f1f1">
          <View style={styles1.titleContainer}>
            <Text style={styles1.title}>
              {statePanel.title} ({props.length - 1})
            </Text>
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
