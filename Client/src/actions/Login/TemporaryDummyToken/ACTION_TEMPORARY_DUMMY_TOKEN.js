const TEMPORARY_DUMMY_TOKEN = "TEMPORARY_DUMMY_TOKEN";

const ACTION_TEMPORARY_DUMMY_TOKEN = (temporary_dummy_token) => {
  return {
    type: TEMPORARY_DUMMY_TOKEN,
    temporary_dummy_token,
  };
};

export default ACTION_TEMPORARY_DUMMY_TOKEN;
