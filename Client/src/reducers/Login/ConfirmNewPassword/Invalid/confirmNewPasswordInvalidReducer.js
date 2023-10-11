const CONFIRM_NEW_PASSWORD_INVALID = "CONFIRM_NEW_PASSWORD_INVALID";
const CONFIRM_NEW_PASSWORD_NOT_INVALID =
  "CONFIRM_NEW_PASSWORD_NOT_INVALID";

const confirmNewPasswordInvalidReducer = (
  state = { confirm_new_password_invalid: false },
  action
) => {
  switch (action.type) {
    case CONFIRM_NEW_PASSWORD_INVALID:
      return { ...state, confirm_new_password_invalid: true };
    case CONFIRM_NEW_PASSWORD_NOT_INVALID:
      return { ...state, confirm_new_password_invalid: false };
    default:
      return { ...state };
  }
};

export default confirmNewPasswordInvalidReducer;
