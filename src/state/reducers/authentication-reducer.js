const authenticationState = {
  user: null,
};
const AuthenticationReducer = (state = authenticationState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
      };
    case 'UPDATE_USER':
      return {
        user: {...state.user, ...action.payload},
      };
    case 'LOGOUT_SUCCESS':
      return {
        user: null,
      };
    default:
      return state;
  }
};
export default AuthenticationReducer;
