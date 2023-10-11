const CONFIRM_NEW_PASSWORD = "CONFIRM_NEW_PASSWORD";

const ACTION_CONFIRM_NEW_PASSWORD = (confirm_new_password) => {
  return {
    type: CONFIRM_NEW_PASSWORD,
    confirm_new_password,
  };
};

export default ACTION_CONFIRM_NEW_PASSWORD;
