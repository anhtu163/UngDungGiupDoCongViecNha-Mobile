import {connect} from 'react-redux';
import * as actions from '../actions/index';
import TaskManage from '../Components/TaskManage/TaskManage';

const mapstToProps = state => {
  return {
    taskList: state.TaskReducer.taskList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllTasks: () => dispatch(actions.getAllTasksRequest()),
  };
};
const TaskContainer = connect(
  mapstToProps,
  mapDispatchToProps,
)(TaskManage);

export default TaskContainer;
