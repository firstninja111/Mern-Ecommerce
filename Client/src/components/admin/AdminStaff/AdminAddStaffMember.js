import React, { useEffect, useState, useRef } from "react";
import { Transition } from "react-spring/renderprops";
import { faLongArrowAltLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import Modal from "react-modal";
import { css } from "@emotion/css";
import BounceLoader from "react-spinners/BounceLoader";
import phone from "phone";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import addEmployeeMutation from "../../../graphql/mutations/addEmployeeMutation";
import Dropdown from "react-dropdown";
import ACTION_ADMIN_STAFF_MEMBER_PHONE_NUMBER from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberPhoneNumber/ACTION_ADMIN_STAFF_MEMBER_PHONE_NUMBER";
import ACTION_ADMIN_STAFF_MEMBER_PHONE_NUMBER_RESET from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberPhoneNumber/ACTION_ADMIN_STAFF_MEMBER_PHONE_NUMBER_RESET";
import ACTION_LOADING_SPINNER_ACTIVE from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import ACTION_ADMIN_STAFF_MEMBER_EMAIL from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberEmail/ACTION_ADMIN_STAFF_MEMBER_EMAIL";
import ACTION_ADMIN_STAFF_MEMBER_EMAIL_RESET from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberEmail/ACTION_ADMIN_STAFF_MEMBER_EMAIL_RESET";
import ACTION_ADMIN_STAFF_MEMBER_LAST_NAME from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberLastName/ACTION_ADMIN_STAFF_MEMBER_LAST_NAME";
import ACTION_ADMIN_STAFF_MEMBER_LAST_NAME_RESET from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberLastName/ACTION_ADMIN_STAFF_MEMBER_LAST_NAME_RESET";
import ACTION_ADMIN_STAFF_MEMBER_FIRST_NAME from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberFirstName/ACTION_ADMIN_STAFF_MEMBER_FIRST_NAME";
import ACTION_ADMIN_STAFF_MEMBER_FIRST_NAME_RESET from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberFirstName/ACTION_ADMIN_STAFF_MEMBER_FIRST_NAME_RESET";
import ACTION_ADMIN_STAFF_MEMBER_ROLES from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberRoles/ACTION_ADMIN_STAFF_MEMBER_ROLES";
import ACTION_ADMIN_STAFF_MEMBER_ROLES_RESET from "../../../actions/Admin/AdminAddStaffMember/AdminStaffMemberRoles/ACTION_ADMIN_STAFF_MEMBER_ROLES_RESET";
import ACTION_LOADING_SPINNER_RESET from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import "react-dropdown/style.css";
import "react-day-picker/lib/style.css";
import "./AdminStaff.css";

const AdminAddStaffMember = (props) => {
  const dispatch = useDispatch();

  const otherRoleRef = useRef(null);

  const {
    getEmployeeData,
    getAllRolesData,
    getAllStoresData,
    addStaffMemberClicked,
    changeAddStaffMemberClicked,
    getEmployeesRefetch,
  } = props;

  const adminStaffMemberFirstName = useSelector(
    (state) => state.adminStaffMemberFirstName.admin_staff_member_first_name
  );
  const adminStaffMemberLastName = useSelector(
    (state) => state.adminStaffMemberLastName.admin_staff_member_last_name
  );
  const adminStaffMemberEmail = useSelector(
    (state) => state.adminStaffMemberEmail.admin_staff_member_email
  );
  const adminStaffMemberPhoneNumber = useSelector(
    (state) => state.adminStaffMemberPhoneNumber.admin_staff_member_phone_number
  );
  const adminStaffMemberRoles = useSelector(
    (state) => state.adminStaffMemberRoles.admin_staff_member_roles
  );

  const logoutClicked = useSelector(
    (state) => state.logoutClicked.log_out_clicked
  );
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );

  const [storeList, changeStoreList] = useState([]);
  const [otherRoles, changeOtherRoles] = useState([]);
  const [firstFocus, changeFirstFocus] = useState(false);

  // Errors
  const [firstNameError, changeFirstNameError] = useState(false);
  const [lastNameError, changeLastNameError] = useState(false);
  const [emailError, changeEmailError] = useState(false);
  const [phoneNumberError, changePhoneNumberError] = useState(false);
  const [roleError, changeRoleError] = useState(false);
  const [storeError, changeStoreError] = useState(false);

  const [functionalDown, changeFunctionalDown] = useState(false);

  const [
    addEmployee,
    { loading: addEmployeeLoading, data: addEmployeeData },
  ] = useMutation(addEmployeeMutation);

  const override = css`
    display: block;
    position: absolute;
    left: 25%;
    right: 25%;
  `;

  const NumberKeyUp = (e) => {
    if(e.keyCode >= 16 && e.keyCode <= 18 ) changeFunctionalDown(false);
  }

  const phoneNumberKeyTyping = (e) => {
    if(e.keyCode >= 16 && e.keyCode <= 18 ) changeFunctionalDown(true);
    if (
      functionalDown || 
      (e.keyCode >= 8 && e.keyCode < 32) ||
      (e.keyCode >= 37 && e.keyCode <= 40) ||
      (e.keyCode >= 96 && e.keyCode <= 109) ||
      (e.keyCode >= 48 && e.keyCode <= 57)
    ) {
      return e.keyCode;
    } else {
      e.preventDefault();
    }
  };

  const resetAllErrorStates = () => {
    if (firstNameError) {
      changeFirstNameError(false);
    }

    if (lastNameError) {
      changeLastNameError(false);
    }

    if (emailError) {
      changeEmailError(false);
    }

    if (phoneNumberError) {
      changePhoneNumberError(false);
    }

    if (roleError) {
      changeRoleError(false);
    }

    if (storeError) {
      changeStoreError(false);
    }
  };

  const phoneNumberTyping = (e) => {
    let currentTyping = e.currentTarget.value;

    resetAllErrorStates();
    e.currentTarget.value = currentTyping;
    dispatch(ACTION_ADMIN_STAFF_MEMBER_PHONE_NUMBER(currentTyping));
  };

  useEffect(() => {
    if (addEmployeeData && !loadingSpinnerActive) {
      changeAddStaffMemberClicked(false);
      getEmployeesRefetch();
    }
  }, [
    addEmployeeData,
    loadingSpinnerActive,
    changeAddStaffMemberClicked,
    getEmployeesRefetch,
  ]);

  useEffect(() => {
    if (addEmployeeLoading) {
      dispatch(ACTION_LOADING_SPINNER_ACTIVE());
    }
  }, [addEmployeeLoading, dispatch]);

  useEffect(() => {
    if (addEmployeeData) {
      if (loadingSpinnerActive) {
        dispatch(ACTION_LOADING_SPINNER_RESET());
      }
    }
  }, [addEmployeeData, loadingSpinnerActive, dispatch]);

  useEffect(() => {
    const refInterval = setInterval(() => {
      if (otherRoleRef) {
        if (otherRoleRef.current && firstFocus) {
          const currentRef = otherRoleRef.current;

          changeFirstFocus(false);
          currentRef.focus();
        }
      }
    }, 500);

    return () => {
      clearInterval(refInterval);
    };
  }, [firstFocus]);

  const handleBackToAllStaff = () => {
    changeAddStaffMemberClicked(false);
    changeOtherRoles([]);
    dispatch(ACTION_ADMIN_STAFF_MEMBER_FIRST_NAME_RESET());
    dispatch(ACTION_ADMIN_STAFF_MEMBER_LAST_NAME_RESET());
    dispatch(ACTION_ADMIN_STAFF_MEMBER_EMAIL_RESET());
    dispatch(ACTION_ADMIN_STAFF_MEMBER_PHONE_NUMBER_RESET());
    dispatch(ACTION_ADMIN_STAFF_MEMBER_ROLES_RESET());
  };

  const otherRolesValuesArr = otherRoles.map((role) => role.value);

  const otherRolesValuesFiltered = otherRolesValuesArr.filter((role) => role);

  const variablesModel = {
    firstName: adminStaffMemberFirstName,
    lastName: adminStaffMemberLastName,
    email: adminStaffMemberEmail,
    phoneNumber: adminStaffMemberPhoneNumber,
    employeeRole: adminStaffMemberRoles.concat(otherRolesValuesFiltered),
    store: []
  };

  const handleSubmit = () => {
    if(!getEmployeeData.employee.employeeRole.includes("Admin")){
      changeStoreList([
        getEmployeeData.employee.store.name
      ])
    }
    if (
      adminStaffMemberFirstName &&
      adminStaffMemberLastName &&
      adminStaffMemberPhoneNumber &&
      adminStaffMemberEmail &&
      adminStaffMemberRoles.length > 0 &&
      storeList.length > 0

    ) {
      let store_temp = getAllStoresData.all_stores.filter(item => storeList.includes(item.name));
      store_temp = store_temp.map(item => {
        return {
          _id: item._id,
          name: item.name,
          address: item.address,
          coordinateLat: item.coordinateLat,
          coordinateLng: item.coordinateLng,
          city: item.city,
          country: item.country,
          phone: item.phone,
          email: item.email,
          website: item.website,
          timezone: item.timezone,
          availableServices: item.availableServices,
        }
      });
      addEmployee({
        variables: {
          ...variablesModel,
          store: store_temp
        },
      });
    } else {
      if (!adminStaffMemberFirstName) {
        changeFirstNameError(true);
      }

      if (!adminStaffMemberLastName) {
        changeLastNameError(true);
      }

      if (!adminStaffMemberPhoneNumber) {
        changePhoneNumberError(true);
      }

      if (!adminStaffMemberEmail) {
        changeEmailError(true);
      } else {
        if (!isEmail(adminStaffMemberEmail)) {
          changeEmailError(true);
        }
      }

      if (adminStaffMemberRoles.length < 1) {
        changeRoleError(true);
      }

      if(storeList.length < 1) {
        changeStoreError(true)
      }
    }
  };

  return (
    <Transition
      items={addStaffMemberClicked}
      from={{ transform: "translateX(-100%)" }}
      enter={{ transform: "translateX(0%)" }}
      leave={{ transform: "translateX(-100%)" }}
      config={{ duration: 200 }}
    >
      {(createAppointmentClicked) =>
        createAppointmentClicked &&
        ((styleprops) => (
          <div
            className="admin_individual_selected_client_container"
            style={{
              ...styleprops,
              zIndex: logoutClicked || loadingSpinnerActive ? 0 : 5,
            }}
          >
            <Modal
              isOpen={loadingSpinnerActive}
              style={{
                content: {
                  position: "fixed",
                  zIndex: "10000",
                  height: "100%",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                  paddingBottom: "10%",
                  borderRadius: "none",
                  width: "100vw",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              <BounceLoader
                size={100}
                css={override}
                color={"rgb(44, 44, 52)"}
                loading={loadingSpinnerActive}
              />
            </Modal>
            <div className="admin_individual_selected_employee_contents">
              <div className="admin_individual_selected_client_back_container">
                <FontAwesomeIcon
                  icon={faLongArrowAltLeft}
                  className="admin_individual_selected_client_back_arrow_icon"
                  onClick={handleBackToAllStaff}
                />
                <p onClick={handleBackToAllStaff}>Back to all staff</p>
              </div>
              <div className="admin_create_appointment_section_header">
                <h2>New Staff Member Information</h2>
              </div>
              <div className="admin_create_appointment_input_information_container">
                <div className="admin_create_appointment_label admin_create_appointment_double_label">
                  First Name
                </div>
                <div
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-owns="react-autowhatever-1"
                  aria-controls="react-autowhatever-1"
                  aria-expanded="false"
                  className="react-autosuggest__container"
                  style={{
                    outline: firstNameError ? "3px solid red" : "none",
                    zIndex: firstNameError ? 99999 : "auto",
                  }}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls="react-autowhatever-1"
                    className="react-autosuggest__input"
                    value={adminStaffMemberFirstName}
                    onChange={(e) => {
                      resetAllErrorStates();
                      dispatch(
                        ACTION_ADMIN_STAFF_MEMBER_FIRST_NAME(e.target.value)
                      );
                    }}
                    placeholder="Staff member first name"
                  />
                </div>
                <div className="admin_create_appointment_label admin_create_appointment_double_label">
                  Last Name
                </div>
                <div
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-owns="react-autowhatever-1"
                  aria-controls="react-autowhatever-1"
                  aria-expanded="false"
                  className="react-autosuggest__container"
                  style={{
                    outline: lastNameError ? "3px solid red" : "none",
                    zIndex: lastNameError ? 99999 : "auto",
                  }}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls="react-autowhatever-1"
                    className="react-autosuggest__input"
                    value={adminStaffMemberLastName}
                    onChange={(e) => {
                      resetAllErrorStates();
                      dispatch(
                        ACTION_ADMIN_STAFF_MEMBER_LAST_NAME(e.target.value)
                      );
                    }}
                    placeholder="Staff member last name"
                  />
                </div>
              </div>
              <div className="admin_create_appointment_input_information_container">
                <div className="admin_create_appointment_label admin_create_appointment_double_label">
                  Email
                </div>
                <div
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-owns="react-autowhatever-1"
                  aria-controls="react-autowhatever-1"
                  aria-expanded="false"
                  className="react-autosuggest__container"
                  style={{
                    outline: emailError ? "3px solid red" : "none",
                    zIndex: emailError ? 99999 : "auto",
                  }}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls="react-autowhatever-1"
                    className="react-autosuggest__input"
                    placeholder="Email address"
                    value={adminStaffMemberEmail}
                    maxLength={100}
                    onChange={(e) => {
                      resetAllErrorStates();
                      dispatch(ACTION_ADMIN_STAFF_MEMBER_EMAIL(e.target.value));
                    }}
                  />
                </div>
                <div className="admin_create_appointment_label admin_create_appointment_double_label">
                  Phone
                </div>
                <div
                  role="combobox"
                  aria-haspopup="listbox"
                  aria-owns="react-autowhatever-1"
                  aria-controls="react-autowhatever-1"
                  aria-expanded="false"
                  className="react-autosuggest__container"
                  style={{
                    outline: phoneNumberError ? "3px solid red" : "none",
                    zIndex: phoneNumberError ? 99999 : "auto",
                  }}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    aria-autocomplete="list"
                    onKeyDown={phoneNumberKeyTyping}
                    onKeyUp={NumberKeyUp}
                    onChange={phoneNumberTyping}
                    maxLength={16}
                    value={adminStaffMemberPhoneNumber}
                    aria-controls="react-autowhatever-1"
                    className="react-autosuggest__input"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {adminStaffMemberRoles.length > 0
                ? adminStaffMemberRoles.map((role, index) => (
                    <div
                      className="admin_create_appointment_input_information_container"
                      key={index}
                    >
                      <div className="admin_create_appointment_label">
                        Role ({index + 1})
                      </div>
                      <div
                        role="combobox"
                        aria-haspopup="listbox"
                        aria-owns="react-autowhatever-1"
                        aria-controls="react-autowhatever-1"
                        aria-expanded="false"
                        className="react-autosuggest__container"
                        style={{
                          outline: roleError ? "3px solid red" : "none",
                          zIndex: roleError ? 99999 : "auto",
                        }}
                      >
                        <input
                          type="text"
                          autoComplete="off"
                          aria-autocomplete="list"
                          aria-controls="react-autowhatever-1"
                          className="react-autosuggest__input admin_create_appointent_dropdown_placeholder_time"
                          value={role}
                          maxLength={100}
                          disabled
                        />
                      </div>
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="admin_create_appointment_treatment_delete_button"
                        onClick={() => {
                          let newArr = [...adminStaffMemberRoles];
                          newArr.splice(index, 1);

                          if (newArr.length < 1) {
                            dispatch(ACTION_ADMIN_STAFF_MEMBER_ROLES_RESET());
                          } else {
                            dispatch(ACTION_ADMIN_STAFF_MEMBER_ROLES_RESET());
                            newArr.forEach((item) => {
                              dispatch(ACTION_ADMIN_STAFF_MEMBER_ROLES(item));
                            });
                          }
                          if(!newArr.includes("Admin") && !newArr.includes("Manager")) changeStoreList([])
                        }}
                      />
                    </div>
                  ))
                : null}
              {adminStaffMemberRoles.length < 3
                ? (
                <div className="admin_create_appointment_input_information_container">
                  <div className="admin_create_appointment_label">Role(s)</div>
                  <Dropdown
                    options={getAllRolesData.all_roles.map(item => item.name)
                      .filter((x) => {
                        if( !getEmployeeData.employee.employeeRole.includes("Admin") && x == "Admin" ) return false; 
                        return !adminStaffMemberRoles.includes(x) 
                      })}
                    onChange={(choice) => {
                      resetAllErrorStates();

                      if (choice.value === "Other") {
                        changeOtherRoles([...otherRoles, { value: "" }]);
                        changeFirstFocus(true);
                      } else {
                        dispatch(ACTION_ADMIN_STAFF_MEMBER_ROLES(choice.value));
                      }
                    }}
                    className="react-autosuggest__container"
                    controlClassName={
                      roleError
                        ? "react-autosuggest__input personal_event_error"
                        : "react-autosuggest__input"
                    }
                    placeholder="Staff member assigned role"
                    placeholderClassName="admin_add_staff_dropdown_placeholder_no_time"
                  />
                </div>
              ) : null}

              {getEmployeeData.employee.employeeRole.includes("Admin")
                ? storeList.length > 0
                  ? storeList.map((store, index) => (
                      <div
                        className="admin_create_appointment_input_information_container"
                        key={index}
                      >
                        <div className="admin_create_appointment_label admin_create_appointment_double_label">
                          Store ({index + 1})
                        </div>
                        <div
                          role="combobox"
                          aria-haspopup="listbox"
                          aria-owns="react-autowhatever-1"
                          aria-controls="react-autowhatever-1"
                          aria-expanded="false"
                          className="react-autosuggest__container"
                          style={{
                            outline: storeError ? "3px solid red" : "none",
                            zIndex: storeError ? 99999 : "auto",
                          }}
                        >
                          <input
                            type="text"
                            autoComplete="off"
                            aria-autocomplete="list"
                            aria-controls="react-autowhatever-1"
                            className="react-autosuggest__input admin_create_appointent_dropdown_placeholder_time"
                            value={store}
                            maxLength={100}
                            disabled
                          />
                        </div>
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="admin_create_appointment_treatment_delete_button"
                          onClick={() => {
                            let newArr = [...storeList];
                            newArr.splice(index, 1);
                            changeStoreList(newArr);
                          }}
                        />
                      </div>
                    ))
                  : null
                : null
              }
              {getEmployeeData.employee.employeeRole.includes("Admin")
                ? storeList.length < 1
                  ? <div className="admin_create_appointment_input_information_container">
                      <div className="admin_create_appointment_label admin_create_appointment_double_label">
                        Store(s)
                      </div>
                      <Dropdown
                        options={
                          getAllStoresData.all_stores.map(item => item.name)
                          .filter((x) => {
                            if(getEmployeeData.employee.employeeRole.includes("Admin")) return !storeList.includes(x)
                            return !storeList.includes(x) && getEmployeeData.employee.store.name == x
                          })
                        }
                        onChange={(choice) => {
                          resetAllErrorStates();
                          changeStoreList([...storeList, choice.value])
                        }}
                        className="react-autosuggest__container"
                        controlClassName={
                          storeError
                            ? "react-autosuggest__input personal_event_error"
                            : "react-autosuggest__input"
                        }
                        placeholder="Store service"
                        placeholderClassName="admin_add_store_dropdown_placeholder_no_time"
                      />
                    </div>
                  : null
                : null
              }
              <div className="admin_square_payment_form_container">
                <div className="sq-payment-form">
                  <div className="sq-creditcard" onClick={handleSubmit}>
                    Add Staff
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </Transition>
  );
};

export default AdminAddStaffMember;