// done

import {
  LOGIN,
  LOGOUT,
} from "./Types";

const token = localStorage.getItem("token");

const initialState = token ? { isAuthorized: true, token: JSON.parse(token) } : { isAuthorized: false, token: null };

const AuthReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN:
      return {
        ...state,
        isAuthorized: payload.isauthorized,
        token: payload.token,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthorized: false,
        token: null,
      };
    default:
      return state;
  }
};

export default AuthReducer;
