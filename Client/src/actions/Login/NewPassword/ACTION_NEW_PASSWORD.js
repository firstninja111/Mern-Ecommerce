const NEW_PASSWORD = "NEW_PASSWORD";

const ACTION_NEW_PASSWORD = (new_password) => {
  return {
    type: NEW_PASSWORD,
    new_password,
  };
};

export default ACTION_NEW_PASSWORD;
