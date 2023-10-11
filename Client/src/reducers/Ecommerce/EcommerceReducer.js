const IS_ECOMMERCEPAGE_ACTIVE = "IS_ECOMMERCEPAGE_ACTIVE";
const IS_ECOMMERCEPAGE_NOT_ACTIVE = "IS_ECOMMERCEPAGE_NOT_ACTIVE";
const IS_ECOMMERCE_MEETNOW_ACTIVE = "IS_ECOMMERCEPAGE_ACTIVE";
const IS_ECOMMERCE_MEETNOW_NOT_ACTIVE = "IS_ECOMMERCEPAGE_NOT_ACTIVE";
const servicesReducer = (
  state = { ecommercePageActive: true },
  action
) => {
  switch (action.type) {
    case IS_ECOMMERCEPAGE_ACTIVE:
      return { ...state, ecommercePageActive: true };
    case IS_ECOMMERCEPAGE_NOT_ACTIVE:
      return { ...state, ecommercePageActive: false };
    default:
      return { ...state };
  }
};

export default servicesReducer;
