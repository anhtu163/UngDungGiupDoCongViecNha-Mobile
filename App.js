import React from 'react';
// import {Provider} from 'react-redux';
import AuthManage from './src/Components/AuthManage/AuthManage';
import Home from './src/Components/Home/Home';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';
import {Modal} from '@ant-design/react-native';

const AuthContext = React.createContext();
// const store = createStore(myReducer);

export default function App() {
  // const [isLogin, setisLogin] = useState(false);
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.data.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            userToken: action.data.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      userToken: null,
    },
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
      try {
        // userToken = AsyncStorage.getItem('userToken');
        // u = AsyncStorage.getItem('user');
        // [userToken, u] = await Promise.all([
        userToken = await AsyncStorage.getItem('userToken');
        //AsyncStorage.getItem('user'),
        //]);
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
      dispatch({type: 'RESTORE_TOKEN', data: {token: userToken}});

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        // let token = AsyncStorage.getItem('userToken');
        const dt = {
          email: data.username,
          password: data.password,
        };
        console.log(data);
        RNFetchBlob.fetch(
          'POST',
          'https://househelperapp-api.herokuapp.com/users/login',
          {
            'Content-Type': 'application/json',
          },
          JSON.stringify(dt),
        ).then(async res => {
          const t = res.json();
          if (t.code === 2020) {
            try {
              await AsyncStorage.setItem('userToken', t.token);
            } catch (error) {
              console.log(error.message);
            }
            dispatch({
              type: 'SIGN_IN',
              data: {token: t.token},
            });
          } else {
            data.seterr(t.message);
            console.log(t.message);
          }
        });
      },
      signOut: async () => {
        try {
          await AsyncStorage.removeItem('userToken');
        } catch (error) {
          // Error retrieving data
          console.log(error.message);
        }
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        RNFetchBlob.fetch(
          'POST',
          'https://househelperapp-api.herokuapp.com/users/register-family',
          {
            'Content-Type': 'application/json',
          },
          JSON.stringify(data.NewF),
        ).then(async res => {
          const t = res.json();
          if (t.code === 2020) {
            Modal.alert(
              'Thông báo',
              'Vui lòng truy cập vào email để thực hiện kích hoạt tài khoản',
              [
                {
                  text: 'Quay về trang đăng nhập',
                  onPress: () => data.navigator.navigate('Login'),
                },
              ],
            );
          } else {
            data.seterr(t.message);
          }
        });
      },
    }),
    [],
  );
  return (
    <AuthContext.Provider value={authContext}>
      {state.userToken !== null ? (
        <Home AuthContext={AuthContext} token={state.userToken} />
      ) : (
        <AuthManage AuthContext={AuthContext} />
      )}
    </AuthContext.Provider>
  );
}
