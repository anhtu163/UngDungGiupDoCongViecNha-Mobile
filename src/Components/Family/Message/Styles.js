import {StyleSheet} from 'react-native';

// eslint-disable-next-line no-undef
export default (styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  inItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    padding: 20,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  bgAvatar: {
    flex: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  info: {
    flex: 10,
    flexDirection: 'column',
    paddingLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  bgSeen: {
    flex: 2,
  },
  avatarSeen: {
    width: 20,
    height: 20,
    borderRadius: 25,
  },
}));
