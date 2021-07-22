import auth from '@react-native-firebase/auth';

/**
 * check if user is authenticated ?
 * @return {boolean}
 */
export const UserAuthenticated = () => {
  return auth().currentUser !== null;
};
/**
 * string as user uid ?
 * @return {string}
 */
export const getUserUID = () => {
  return auth?.()?.currentUser?.uid;
};
/**
 * string as user phone number
 * @return {string}
 */
export const getUserPhoneNumber = () => {
  return auth().currentUser.phoneNumber;
};
