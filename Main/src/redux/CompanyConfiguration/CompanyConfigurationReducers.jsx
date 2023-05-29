const initialState = {
  data: "1"
};

const CompanyConfigurationReducers = (state = initialState, action) => {
  if (action.payload) {
    const data = action.payload;
    switch (action.type) {
      case "storeCompanyConfigurationData": {
        return { ...state, ...data };
      }
      default:
        return state;
    }
  }
  return state;
};
export default CompanyConfigurationReducers;
