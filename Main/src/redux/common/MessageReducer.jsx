// done

import { SET_SUCCESS_MESSAGE, SET_ERROR_MESSAGE, CLEAR_MESSAGE } from "./Types";

const initialState = { success: "", error: "" };

const someFunc = (state = initialState, action) => {
  const { type, payload } = action;

  if (initialState.success) {
    setTimeout(() => {
      initialState.success = "";
    }, 3000);
  }

  switch (type) {
    case SET_SUCCESS_MESSAGE:
      return { ...state, success: payload };

    case SET_ERROR_MESSAGE:
      return { ...state, error: payload };

    case CLEAR_MESSAGE:
      return {};

    default: {
      if (initialState.success) {
        setTimeout(() => {
          initialState.success = "";
        }, 3000);
      }
      return state;
    }
  }
};

export default someFunc;
