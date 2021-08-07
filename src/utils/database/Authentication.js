import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

/**
 * check if user is authenticated ?
 * @return {boolean}
 */

export const UserAuthenticated = () => {
  return auth()?.currentUser !== null;
};

/**
 * string as user uid ?
 * @return {string}
 */

export const getUserUID = () => {
  return auth()?.currentUser?.uid;
};

/**
 * getting user first name as string
 * @return {string}
 */
export const getFirstName = () => {
  database()
    .ref(`/users/${auth()?.currentUser?.uid}`)
    .once('value')
    .then(snapshot => {
      if (snapshot?.val().first_name) {
        return snapshot?.val().first_name;
      }
      return null;
    });
};

/**
 * getting user last name as string
 * @return {string}
 */

export const getLastName = () => {
  database()
    .ref(`/users/${auth()?.currentUser?.uid}`)
    .once('value')
    .then(snapshot => {
      if (snapshot?.val().last_name) {
        return snapshot?.val().last_name;
      }
      return null;
    });
};

/**
 * getting user avatar url as string
 */

export const getAvatarURL = () => {
  database()
    .ref(`/users/${auth()?.currentUser?.uid}`)
    .on('value', snapshot => {
      if (snapshot?.val().avatar) {
        return snapshot?.val().avatar;
      }
    });
};

/**export const getCustomData =  => {
  database()
    .ref(`/users/${auth()?.currentUser?.uid}`)
    .on('value', snapshot => {
      if (snapshot?.val().args) {
        const _avatarUrl = snapshot?.val().value;
        console.log(_avatarUrl typeof uri);
        return _avatarUrl;
      }
    });
  return null;
};*/

/**r
 * string as user phone number
 * @return {string}
 */

export const getUserPhoneNumber = () => {
  return auth()?.currentUser?.phoneNumber;
};
