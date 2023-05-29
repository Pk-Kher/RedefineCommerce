import {

  LOGIN,
  LOGOUT,
} from "./Types";

export const addToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const RemoveFromLocalStorage = (WhatToRemove) => {
  localStorage.removeItem(WhatToRemove);
};

export const login = ({ token, ...rest }) => {
  addToLocalStorage('token', token);
  return ({ type: LOGIN, payload: { token, ...rest } });
};

export const logout = () => {
  RemoveFromLocalStorage('token');
  RemoveFromLocalStorage('persist:root');
  localStorage.clear();
  return ({ type: LOGOUT })
};



