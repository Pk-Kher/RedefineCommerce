const initialState = {
    toLoad: false,
};

const CompanyConfigurationReducers = (state = initialState, action) => {
    const payload = action.payload;

    switch (action.type) {
        case "addLoading": {
            return { ...state, toLoad: payload };
        }
        default:
            return state;
    }
};
export default CompanyConfigurationReducers;
