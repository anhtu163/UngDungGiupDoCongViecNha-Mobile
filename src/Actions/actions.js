import axios from 'axios';
import * as constants from '../Constants/Constants';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k';

// export function getListTask() {
//   return {
//     type: constants.GET_LIST_TASK,
//     headers: {
//       Authorization:
//         'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTZjOTM4NGFiYmZjNDQ4NThiMTdkZWEiLCJtTmFtZSI6IlPhu69hIFPhu69hIiwibUVtYWlsIjoic3Vhc3VhQGdtYWlsLmNvbSIsIm1BZ2UiOm51bGwsIm1Sb2xlIjpudWxsLCJtSXNBZG1pbiI6ZmFsc2UsImZJRCI6IjVlNmI3YWFlNjUyYjAzM2IxYzkwZTA3ZiIsImlhdCI6MTU4NDE3Njg5M30.XJBgpNMD2zubJFyTTWF3qm-99h4DFPmlP53pQRZrj-k',
//     },
//     payload: {
//       request: {
//         url: '/list-task',
//       },
//     },
//   };
// }

function SendGetAllTasks() {
  const res = axios({
    method: 'GET',
    url: 'https://datn-house-helper-app.herokuapp.com/list-task',
    headers: {Authorization: `Bearer ${token}`},
  }).catch(err => {
    return err;
  });

  return res;
}

export const getAllTasks = res => ({
  type: constants.GET_LIST_TASK,
  data: {
    res,
  },
});

export const getAllTasksRequest = () => {
  return dispatch => {
    SendGetAllTasks().then(res => {
      // console.log("request",res.data);
      return dispatch(getAllTasks(res));
    });
  };
};
