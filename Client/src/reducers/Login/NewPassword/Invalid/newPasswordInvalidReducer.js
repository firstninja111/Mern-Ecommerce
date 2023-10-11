const NEW_PASSWORD_INVALID = "NEW_PASSWORD_INVALID";
const NEW_PASSWORD_NOT_INVALID = "NEW_PASSWORD_NOT_INVALID";

const newPasswordInvalidReducer = (
  state = { new_password_invalid: false },
  action
) => {
  switch (action.type) {
    case NEW_PASSWORD_INVALID:
      return { ...state, new_password_invalid: true };
    case NEW_PASSWORD_NOT_INVALID:
      return { ...state, new_password_invalid: false };
    default:
      return { ...state };
  }
};

export default newPasswordInvalidReducer;
