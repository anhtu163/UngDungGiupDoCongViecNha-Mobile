import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import myReducer from './src/Reducers';
import {Icon, TabBar} from '@ant-design/react-native';
import TaskManage from './src/Components/TaskManage/TaskManage';
import Family from './src/Components/Family/Family';
import Calendar from './src/Components/Calendar/Calendar';
import Shopping from './src/Components/Shopping/Shopping';
import Award from './src/Components/Award/Award';
const store = createStore(myReducer);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'Tab3',
    };
  }

  onChangeTab(tabName) {
    this.setState({
      selectedTab: tabName,
    });
  }
  render() {
    return (
      <Provider store={store}>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="green"
          barTintColor="#f5f5f5">
          <TabBar.Item
            title="Family"
            icon={<Icon name="home" />}
            selected={this.state.selectedTab === 'Tab1'}
            onPress={() => this.onChangeTab('Tab1')}>
            <Family />
          </TabBar.Item>
          <TabBar.Item
            icon={<Icon name="calendar" />}
            title="Calendar"
            selected={this.state.selectedTab === 'Tab2'}
            onPress={() => this.onChangeTab('Tab2')}>
            <Calendar />
          </TabBar.Item>
          <TabBar.Item
            icon={<Icon name="check" />}
            title="Tasks"
            selected={this.state.selectedTab === 'Tab3'}
            onPress={() => this.onChangeTab('Tab3')}>
            <TaskManage />
          </TabBar.Item>
          <TabBar.Item
            icon={<Icon name="gift" />}
            title="Reward"
            selected={this.state.selectedTab === 'Tab5'}
            onPress={() => this.onChangeTab('Tab5')}>
            <Award />
          </TabBar.Item>
          <TabBar.Item
            icon={<Icon name="shopping-cart" />}
            title="Groceries"
            selected={this.state.selectedTab === 'Tab4'}
            onPress={() => this.onChangeTab('Tab4')}>
            <Shopping />
          </TabBar.Item>
        </TabBar>
      </Provider>
    );
  }
}
