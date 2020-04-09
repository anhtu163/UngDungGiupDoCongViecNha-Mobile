import React, {useState} from 'react';
// import {Provider} from 'react-redux';
import AuthManage from './src/Components/AuthManage/AuthManage';
import Home from './src/Components/Home/Home';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';

const AuthContext = React.createContext();
// const store = createStore(myReducer);

export default function App({navigation}) {
  // const [isLogin, setisLogin] = useState(false);
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: true,
      userToken: null,
    },
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
      console.log('token: ' + userToken);
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
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
          console.log(t.user);
          if (t.code === 2020) {
            state.userToken = t.token;
            state.isSignout = false;
            try {
              await AsyncStorage.setItem('userToken', state.userToken);
              await AsyncStorage.setItem('isSignout', state.isSignout);
            } catch (error) {
              // Error retrieving data
              console.log(error.message);
            }
            //console.log('Token từ App: ' + state.userToken);
            // navigation.setParams({isLogin: true});
            // navigation.goBack();
            dispatch({type: 'SIGN_IN', token: state.userToken});
          } else {
            console.log('Lỗi');
          }
        });
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
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
          JSON.stringify(data),
        ).then(res => {
          const t = res.json();
          console.log(t);
          if (t.code === 2020) {
            state.userToken = t.token;
            state.isSignout = false;
            //console.log('Token từ App: ' + state.userToken);
            // navigation.setParams({isLogin: true});
            // navigation.goBack();
            dispatch({type: 'SIGN_IN', token: state.userToken});
          } else {
            console.log('Lỗi');
          }
        });

        // dispatch({type: 'SIGN_IN', token: state.userToken});
      },
    }),
    [state.isSignout, state.userToken],
  );
  // console.log('Token từ App: ' + state.userToken);
  const t = state.userToken;
  return (
    <AuthContext.Provider value={authContext}>
      {state.userToken !== null ? (
        <Home AuthContext={AuthContext} token={t} />
      ) : (
        <AuthManage AuthContext={AuthContext} />
      )}
    </AuthContext.Provider>
  );
}
