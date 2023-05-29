const initialState = {
    data: []
  };
  
  const MenuListByUserRoleReducers = (state = initialState, action) => {
    if (action.payload) {
      const data = action.payload;
      switch (action.type) {
        case "storeMenuListByUserData": {
          return { ...state, data };
        }
        default:
          return state;
      }
    }
    return state;
  };
  export default MenuListByUserRoleReducers;