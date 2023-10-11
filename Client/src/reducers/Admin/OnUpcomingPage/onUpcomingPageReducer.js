const ON_UPCOMING_PAGE = "ON_UPCOMING_PAGE";
const ON_UPCOMING_PAGE_RESET = "ON_UPCOMING_PAGE_RESET";

const onUpcomingPageReducer = (state = { on_upcoming_page: false }, action) => {
  switch (action.type) {
    case ON_UPCOMING_PAGE:
      return { ...state, on_upcoming_page: true };
    case ON_UPCOMING_PAGE_RESET:
      return { ...state, on_upcoming_page: false };
    default:
      return { ...state };
  }
};

export default onUpcomingPageReducer;
