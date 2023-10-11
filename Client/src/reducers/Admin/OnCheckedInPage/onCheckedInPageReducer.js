const ON_CHECKEDIN_UPDATE = "ON_CHECKEDIN_UPDATE";
const ON_CHECKEDIN_UPDATE_RESET = "ON_CHECKEDIN_UPDATE_RESET";
const ON_MEETING_PAGE = "ON_MEETING_PAGE";
const ON_MEETING_PAGE_RESET = "ON_MEETING_PAGE_RESET";

const onCheckedInPageReducer = (state = { on_checkedin_update: false, on_meeting_page: false }, action) => {
  switch (action.type) {
    case ON_CHECKEDIN_UPDATE:
      return { ...state, on_checkedin_update: true };
    case ON_CHECKEDIN_UPDATE_RESET:
      return { ...state, on_checkedin_update: false };
    case ON_MEETING_PAGE:
      return { ...state, on_meeting_page: true};
    case ON_MEETING_PAGE_RESET:
      return { ...state, on_meeting_page: false};
    default:
      return { ...state };
  }
};

export default onCheckedInPageReducer;
