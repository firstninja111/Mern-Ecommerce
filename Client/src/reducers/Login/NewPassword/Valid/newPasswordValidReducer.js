const NEW_PASSWORD_VALID = "NEW_PASSWORD_VALID";
const NEW_PASSWORD_NOT_VALID = "NEW_PASSWORD_NOT_VALID";

const newPasswordValidReducer = (
  state = { new_password_valid: false },
  action
) => {
  switch (action.type) {
    case NEW_PASSWORD_VALID:
      return { ...state, new_password_valid: true };
    case NEW_PASSWORD_NOT_VALID:
      return { ...state, new_password_valid: false };
    default:
      return { ...state };
  }
};

export default newPasswordValidReducer;
