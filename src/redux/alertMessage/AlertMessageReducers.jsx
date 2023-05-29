import {
  showAlertMessage,
  hideAlertMessage,
} from "redux/alertMessage/AlertMessageActions";
const initialState = {
  view: false,
  message: "",
  type: "danger",
};

const alertMessageReducers = (state = initialState, action) => {
  if (action.payload) {
    const { type, message } = action.payload;
    switch (action.type) {
      case "show": {
        return {
          ...state,
          message: message,
          type: type,
        };
      }
      case "hide":
        return { message: null, type: "" };
      default:
        return state;
    }
  }
  return state;
};
export default alertMessageReducers;

export const setAlertMessage = (props) => {
  return async (dispatch) => {
    setTimeout(() => {
      dispatch(hideAlertMessage());
    }, 6000);
    dispatch(showAlertMessage({ ...props }));
  };
};
