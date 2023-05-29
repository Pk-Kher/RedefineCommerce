import { getCurrentBrowserData } from "helpers/currentBrowserDetails"

const initialState = {
  browser: getCurrentBrowserData(),
  location: '',
  ipAddress: '',
  macAddress: "00-00-00-00-00-00",
};

const LocationReducers = (state = initialState, action) => {
  if (action.payload) {
    const data = action.payload;
    switch (action.type) {
      case "storeUserLocation": {
        return {
          ...state,
          ...data
        };
      }
      default:
        return state;
    }
  }
  return state;
};
export default LocationReducers;
