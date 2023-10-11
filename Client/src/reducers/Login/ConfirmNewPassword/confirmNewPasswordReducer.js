const CONFIRM_NEW_PASSWORD = "CONFIRM_NEW_PASSWORD";
const CONFIRM_NEW_PASSWORD_RESET = "CONFIRM_NEW_PASSWORD_RESET";

const confirmNewPasswordReducer = (
  state = { confirm_new_password: "" },
  action
) => {
  switch (action.type) {
    case CONFIRM_NEW_PASSWORD:
      return {
        ...state,
        confirm_new_password: action.confirm_new_password,
      };
    case CONFIRM_NEW_PASSWORD_RESET:
      return { ...state, confirm_new_password: "" };
    default:
      return { ...state };
  }
};

export default confirmNewPasswordReducer;
