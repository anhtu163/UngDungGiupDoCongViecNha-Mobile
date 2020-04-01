const initialState = {
  taskList: 'Cái gì nè',
};

function TaskReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_LIST_TASK':
      console.log('Vô nè');
      return {
        ...state,
        taskList: action.res.listTasks,
      };
    default:
      return state;
  }
}

export default TaskReducer;
