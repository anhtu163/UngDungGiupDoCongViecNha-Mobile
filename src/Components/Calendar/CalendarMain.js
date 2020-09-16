import React from 'react';
import {Provider} from '@ant-design/react-native';
import Calendar from './Calendar';

export default function CalendarMain({navigation, route}) {
  const {token} = route.params;
  const {socket} = route.params;
  return (
    <Provider>
      <Calendar navigation={navigation} token={token} socket={socket} />
    </Provider>
  );
}
