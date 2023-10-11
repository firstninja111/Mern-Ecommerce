const NEW_PASSWORD = "NEW_PASSWORD";
const NEW_PASSWORD_RESET = "NEW_PASSWORD_RESET";

const newPasswordReducer = (
  state = { new_password: "" },
  action
) => {
  switch (action.type) {
    case NEW_PASSWORD:
      return { ...state, new_password: action.new_password };
    case NEW_PASSWORD_RESET:
      return { ...state, new_password: "" };
    default:
      return { ...state };
  }
};

export default newPasswordReducer;
