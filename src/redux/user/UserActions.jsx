import { SET_USER, REMOVE_USER } from "./Types";

export const setUser = (data) => ({ payload: data, type: SET_USER });
export const removeUser = () => ({ type: REMOVE_USER });
