const ADMIN_PERSONAL_EVENT_NOTES = "ADMIN_PERSONAL_EVENT_NOTES";

const ACTION_ADMIN_PERSONAL_EVENT_NOTES = (notes) => {
  return {
    type: ADMIN_PERSONAL_EVENT_NOTES,
    notes,
  };
};

export default ACTION_ADMIN_PERSONAL_EVENT_NOTES;