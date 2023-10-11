const TEMPORARY_DUMMY_TOKEN = "TEMPORARY_DUMMY_TOKEN";
const TEMPORARY_DUMMY_TOKEN_RESET = "TEMPORARY_DUMMY_TOKEN_RESET";

const temporaryDummyTokenReducer = (
  state = { temporary_dummy_token: null },
  action
) => {
  switch (action.type) {
    case TEMPORARY_DUMMY_TOKEN:
      return {
        ...state,
        temporary_dummy_token: action.temporary_dummy_token,
      };
    case TEMPORARY_DUMMY_TOKEN_RESET:
      return { ...state, temporary_dummy_token: null };
    default:
      return { ...state };
  }
};

export default temporaryDummyTokenReducer;
