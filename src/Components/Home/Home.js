import React, {useState} from 'react';
import {Icon, TabBar} from '@ant-design/react-native';
import TaskManage from '../TaskManage/TaskManage';
import Family from '../Family/Family';
import Calendar from '../Calendar/Calendar';
import Shopping from '../Shopping/Shopping';
import Award from '../Award/Award';

export default function Home(props) {
  const [selectedTab, setselectedTab] = useState('Tab3');
  const token = props.token;
  //console.log('props của Home' + props);
  //console.log('token của Home: ' + token);
  return (
    <TabBar
      unselectedTintColor="#949494"
      tintColor="green"
      barTintColor="#f5f5f5">
      <TabBar.Item
        title="Family"
        icon={<Icon name="home" />}
        selected={selectedTab === 'Tab1'}
        onPress={() => setselectedTab('Tab1')}>
        <Family />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="calendar" />}
        title="Calendar"
        selected={selectedTab === 'Tab2'}
        onPress={() => setselectedTab('Tab2')}>
        <Calendar />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="check" />}
        title="Tasks"
        selected={selectedTab === 'Tab3'}
        onPress={() => setselectedTab('Tab3')}>
        <TaskManage token={token} />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="gift" />}
        title="Reward"
        selected={selectedTab === 'Tab5'}
        onPress={() => setselectedTab('Tab5')}>
        <Award />
      </TabBar.Item>
      <TabBar.Item
        icon={<Icon name="shopping-cart" />}
        title="Groceries"
        selected={selectedTab === 'Tab4'}
        onPress={() => setselectedTab('Tab4')}>
        <Shopping />
      </TabBar.Item>
    </TabBar>
  );
}
