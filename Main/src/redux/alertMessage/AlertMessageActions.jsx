export const showAlertMessage = ({ ...rest }) => ({ type: "show", payload: { ...rest } });
export const hideAlertMessage = () => ({ type: "hide", payload: { message: '', type: '' } });
