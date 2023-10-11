const IS_ECOMMERCE_MEETNOW_ACTIVE = "IS_ECOMMERCE_MEETNOW_ACTIVE";
const IS_ECOMMERCE_MEETNOW_NOT_ACTIVE = "IS_ECOMMERCE_MEETNOW_NOT_ACTIVE";
const ecommerceMeetNowReducer = (
  state = { ecommerceMeetNowActive: false },
  action
) => {
  switch (action.type) {
    case IS_ECOMMERCE_MEETNOW_ACTIVE:
      return { ...state, ecommerceMeetNowActive: true };
    case IS_ECOMMERCE_MEETNOW_NOT_ACTIVE:
      return { ...state, ecommerceMeetNowActive: false };
    default:
      return { ...state };
  }
};

export default ecommerceMeetNowReducer;
