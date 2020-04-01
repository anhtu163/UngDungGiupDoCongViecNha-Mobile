/* eslint-disable react-native/no-inline-styles */
/* tslint:disable:no-console */
import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {Icon, Card} from '@ant-design/react-native';

export default function Login({navigation}) {
  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      flex: 1,
      backgroundColor: 'transparent',
      padding: 10,
      justifyContent: 'center',
      borderStyle: 'solid',
      borderColor: 'gray',
    },
    inputWrap: {
      flexDirection: 'row',
      marginVertical: 5,
      height: 36,
      backgroundColor: 'transparent',
    },
    input: {
      flex: 1,
      paddingHorizontal: 5,
      backgroundColor: '#FFF',
    },
    iconWrap: {
      paddingHorizontal: 7,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
    icon: {
      width: 20,
      height: 20,
    },
    button: {
      backgroundColor: '#d73352',
      paddingVertical: 8,
      marginVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },

    buttonText: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    forgotPasswordText: {
      color: 'green',
      backgroundColor: 'transparent',
      textAlign: 'left',
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  return (
    <View style={styles.wrapper}>
      <Card style={{backgroundColor: 'white', padding: 10}}>
        <Card.Header title="LOGIN" />
        <Card.Body>
          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Icon color="green" name="user" />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Username"
              //   onChangeText={userName => this.setState({userName})}
              underlineColorAndroid="transparent"
            />
          </View>

          <View style={styles.inputWrap}>
            <View style={styles.iconWrap}>
              <Icon color="green" name="lock" />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              //   onChangeText={password => this.setState({password})}
              underlineColorAndroid="transparent"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            // onPress={this._onPressLogin.bind(this)}
            keyboardShouldPersistTaps={true}>
            <View style={styles.button}>
              <Text style={styles.buttonText}> Login</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('ForgotPassPage')}>
            <View>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('SignUpPage')}
            keyboardShouldPersistTaps={true}>
            <View style={styles.button}>
              <Text style={styles.buttonText}> Create New Family</Text>
            </View>
          </TouchableOpacity>
        </Card.Body>
      </Card>
    </View>
  );
}
