
const initialState = null

const PermissionReducers = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PERMISSION':
            return action.payload;
        case 'REMOVE_PERMISSION':
            return null;
        default:
            return state;
    }

}
export default PermissionReducers;