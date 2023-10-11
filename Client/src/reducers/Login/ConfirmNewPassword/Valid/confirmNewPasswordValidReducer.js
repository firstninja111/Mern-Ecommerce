const CONFIRM_NEW_PASSWORD_VALID = "CONFIRM_NEW_PASSWORD_VALID";
const CONFIRM_NEW_PASSWORD_NOT_VALID =
  "CONFIRM_NEW_PASSWORD_NOT_VALID";

const confirmNewPasswordValidReducer = (
  state = { confirm_new_password_valid: false },
  action
) => {
  switch (action.type) {
    case CONFIRM_NEW_PASSWORD_VALID:
      return { ...state, confirm_new_password_valid: true };
    case CONFIRM_NEW_PASSWORD_NOT_VALID:
      return { ...state, confirm_new_password_valid: false };
    default:
      return { ...state };
  }
};

export default confirmNewPasswordValidReducer;
