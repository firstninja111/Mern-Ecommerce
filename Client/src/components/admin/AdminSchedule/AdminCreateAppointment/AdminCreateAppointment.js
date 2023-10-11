import React, { useState, useEffect, useCallback } from "react";
import { Transition } from "react-spring/renderprops";
import { faLongArrowAltLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DayPickerInput from "react-day-picker/DayPickerInput";
import { formatDate, parseDate } from "react-day-picker/moment";
import Dropdown from "react-dropdown";
import { useSelector, useDispatch } from "react-redux";
import ClientAutosuggest from "./Autosuggest/ClientAutosuggest";
import AdminPaymentInfo from "./AdminPaymentInfo/AdminPaymentInfo";
import { Collapse } from "reactstrap";
import addAppointmentMutation from "../../../../graphql/mutations/addAppointmentMutation";
import { useMutation } from "@apollo/react-hooks";
import moment from "moment";
import Modal from "react-modal";
import { css } from "@emotion/css";
import BounceLoader from "react-spinners/BounceLoader";
import ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentStaffMember/ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER";
import ACTION_ADMIN_CLIENT_EMAIL from "../../../../actions/Admin/AdminCreateAppointment/AdminClientEmail/ACTION_ADMIN_CLIENT_EMIAL";
import ACTION_ADMIN_CLIENT_PHONE_NUMBER from "../../../../actions/Admin/AdminCreateAppointment/AdminClientPhoneNumber/ACTION_ADMIN_CLIENT_PHONE_NUMBER";
import ACTION_ADMIN_CLIENT_LAST_NAME from "../../../../actions/Admin/AdminCreateAppointment/AdminClientLastName/ACTION_ADMIN_CLIENT_LAST_NAME";
import ACTION_ADMIN_APPOINTMENT_NOTES from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentNotes/ACTION_ADMIN_APPOINTMENT_NOTES";
import ACTION_ADMIN_APPOINTMENT_DATE from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentDate/ACTION_ADMIN_APPOINTMENT_DATE";
import ACTION_ADMIN_APPOINTMENT_TIME from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentTime/ACTION_ADMIN_APPOINTMENT_TIME";
import ACTION_ADMIN_CLIENT_FIRST_NAME_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminClientFirstName/ACTION_ADMIN_CLIENT_FIRST_NAME_RESET";
import ACTION_ADMIN_CLIENT_LAST_NAME_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminClientLastName/ACTION_ADMIN_CLIENT_LAST_NAME_RESET";
import ACTION_ADMIN_CLIENT_PHONE_NUMBER_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminClientPhoneNumber/ACTION_ADMIN_CLIENT_PHONE_NUMBER_RESET";
import ACTION_ADMIN_CLIENT_EMAIL_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminClientEmail/ACTION_ADMIN_CLIENT_EMAIL_RESET";
import ACTION_ADMIN_APPOINTMENT_DATE_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentDate/ACTION_ADMIN_APPOINTMENT_DATE_RESET";
import ACTION_ADMIN_APPOINTMENT_NOTES_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentNotes/ACTION_ADMIN_APPOINTMENT_NOTES_RESET";
import ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentStaffMember/ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER_RESET";
import ACTION_ADMIN_APPOINTMENT_TIME_RESET from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentTime/ACTION_ADMIN_APPOINTMENT_TIME_RESET";
import ACTION_ADMIN_APPOINTMENT_DURATION from "../../../../actions/Admin/AdminCreateAppointment/AdminAppointmentDuration/ACTION_ADMIN_APPOINTMENT_DURATION";
import ACTION_LOADING_SPINNER_ACTIVE from "../../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import ACTION_LOADING_SPINNER_RESET from "../../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import ACTION_TOTAL_PRICE_RESET from "../../../../actions/TotalPrice/ACTION_TOTAL_PRICE_RESET";
import ACTION_TOTAL_PRICE from "../../../../actions/TotalPrice/ACTION_TOTAL_PRICE";
import "react-dropdown/style.css";
import "react-day-picker/lib/style.css";
import "./AdminCreateAppointment.css";
// Minified Bootstrap CSS file (for Collapse feature)
import "../../../../bootstrap.min.css";
import { DEFAULT_DEPRECATION_REASON } from "graphql";

const AdminCreateAppointment = (props) => {
  const dispatch = useDispatch();

  const {
    stopTransition,
    createAppointmentClicked,
    getClientsData,
    getAllServicesData,
    getAllStoresData,
    getClientsRefetch,
    changeStopTransition,
    randomColorArray,
    changeCreateAppointmentClicked,
    changePersonalEventClicked,
    getAllAppointmentsRefetch,
    allEmployeeOptions,
    getEmployeeData,
    renderLoggedInStaffName,
  } = props;

  const [clickOutsideDayPicker, changeClickOutsideDayPicker] = useState(true);
  const [addCardCollapseOpen, changeAddCardCollapseOpen] = useState(false);
  const [
    bookWithoutCardCollapseOpen,
    changeBookWithoutCardCollapseOpen,
  ] = useState(false);

  const adminClientFirstName = useSelector(
    (state) => state.adminClientFirstName.admin_client_first_name
  );
  const adminClientLastName = useSelector(
    (state) => state.adminClientLastName.admin_client_last_name
  );
  const adminClientEmail = useSelector(
    (state) => state.adminClientEmail.admin_client_email
  );
  const adminClientPhoneNumber = useSelector(
    (state) => state.adminClientPhoneNumber.admin_client_phone_number
  );
  const adminAppointmentNotes = useSelector(
    (state) => state.adminAppointmentNotes.admin_appointment_notes
  );
  const adminAppointmentStaffMember = useSelector(
    (state) => state.adminAppointmentStaffMember.admin_appointment_staff_member
  );
  const adminSelectedTreatments = useSelector(
    (state) => state.adminSelectedTreatments.admin_selected_treatments
  );
  const adminAppointmentDate = useSelector(
    (state) => state.adminAppointmentDate.admin_appointment_date
  );
  const adminAppointmentTime = useSelector(
    (state) => state.adminAppointmentTime.admin_appointment_time
  );
  const totalPrice = useSelector((state) => state.totalPrice.totalPrice);
  const logoutClicked = useSelector(
    (state) => state.logoutClicked.log_out_clicked
  );
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );

  const [duration, changeDuration] = useState(30);
  const [serviceList, changeServiceList] = useState([]);
  const [storeList, changeStoreList] = useState([]);

  // Errors
  const [firstNameError, changeFirstNameError] = useState(false);
  const [lastNameError, changeLastNameError] = useState(false);
  const [emailError, changeEmailError] = useState(false);
  const [phoneNumberError, changePhoneNumberError] = useState(false);
  const [dateError, changeDateError] = useState(false);
  const [timeError, changeTimeError] = useState(false);
  const [durationError, changeDurationError] = useState(false);
  const [serviceError, changeServiceError] = useState(false);
  const [storeError, changeStoreError] = useState(false);

  const [functionalDown, changeFunctionalDown] = useState(false);
  const [
    addAppointment,
    { loading: addAppointmentLoading, data: addAppointmentData },
  ] = useMutation(addAppointmentMutation);

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

  const phoneNumberTyping = (e) => {
    let currentTyping = e.currentTarget.value;
    resetAllErrorStates();
    e.currentTarget.value = currentTyping;
    dispatch(ACTION_ADMIN_CLIENT_PHONE_NUMBER(currentTyping));
  };

  useEffect(() => {
    const dayPickerClickFunction = (e) => {
      if (e.target) {
        if (e.target.placeholder === "Appointment Date") {
          if (clickOutsideDayPicker) {
            changeClickOutsideDayPicker(false);
          }
        } else if (e.target.getAttribute("class")) {
          if (typeof (e.target.className === "string")) {
            if (!e.target.className.baseVal) {
              if (
                e.target.className.split(" ").includes("DayPicker-Day") ||
                e.target.className.split(" ").includes("DayPicker-NavButton")
              ) {
                if (clickOutsideDayPicker) {
                  changeClickOutsideDayPicker(false);
                }
              } else {
                if (!clickOutsideDayPicker) {
                  changeClickOutsideDayPicker(true);
                }
              }
            } else {
              if (!clickOutsideDayPicker) {
                changeClickOutsideDayPicker(true);
              }
            }
          } else {
            if (!clickOutsideDayPicker) {
              changeClickOutsideDayPicker(true);
            }
          }
        } else {
          if (!clickOutsideDayPicker) {
            changeClickOutsideDayPicker(true);
          }
        }
      }
    };

    window.addEventListener("click", dayPickerClickFunction);

    return () => {
      window.removeEventListener("click", dayPickerClickFunction);
    };
  }, [clickOutsideDayPicker]);

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

    if (dateError) {
      changeDateError(false);
    }

    if (timeError) {
      changeTimeError(false);
    }

    if (durationError) {
      changeDurationError(false);
    }

    if (serviceError) {
      changeServiceError(false);
    }

    if (storeError) {
      changeStoreError(false);
    }
    
  };

  const variablesModel = {
    firstName: adminClientFirstName,
    lastName: adminClientLastName,
    email: adminClientEmail,
    phoneNumber: adminClientPhoneNumber,
    notes: adminAppointmentNotes,
    duration: duration,
    price: 1,
    store: [],
  };

  const handleBackToSchedule = useCallback(() => {
    changeCreateAppointmentClicked(false);

    dispatch(ACTION_ADMIN_CLIENT_FIRST_NAME_RESET());
    dispatch(ACTION_ADMIN_CLIENT_LAST_NAME_RESET());
    dispatch(ACTION_ADMIN_CLIENT_PHONE_NUMBER_RESET());
    dispatch(ACTION_ADMIN_CLIENT_EMAIL_RESET());
    dispatch(ACTION_ADMIN_APPOINTMENT_DATE_RESET());
    dispatch(ACTION_ADMIN_APPOINTMENT_TIME_RESET());
    dispatch(ACTION_ADMIN_APPOINTMENT_NOTES_RESET());
    dispatch(ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER_RESET());

    resetAllErrorStates();
    changeAddCardCollapseOpen(false);
    changeClickOutsideDayPicker(false);
  }, [dispatch, changeCreateAppointmentClicked]);

  const handleSubmitBooking = (e, isInStoreMeeting) => {
    e.preventDefault();
    if(
      adminClientFirstName &&
      adminClientLastName &&
      adminClientPhoneNumber &&
      adminClientEmail &&
      adminAppointmentDate &&
      adminAppointmentTime &&
      duration &&
      serviceList &&
      storeList.length > 0
    ) {
      const appDate = moment(adminAppointmentDate, "MM/DD/YYYY").format(
        "MMMM D, YYYY"
      );

      const startTime = moment(
        appDate + " " + adminAppointmentTime,
        "MMMM D, YYYY h:mm A"
      )
      .format("h:mm A");

      const endTime = moment(
        appDate + " " + startTime,
        "MMMM D, YYYY h:mm A"
      )
      .add(duration, "minutes")
      .format("h:mm");

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

      if(isInStoreMeeting){
        const appointment = {
          ...variablesModel,
          date: appDate,
          startTime: startTime.split(" ")[0],
          morningOrEvening: startTime.split(" ")[1],
          endTime: endTime,
          esthetician: adminAppointmentStaffMember.toString(),
          duration: Number(duration),
          service: serviceList[0],
          isStoreSchedule: true,
        }
        addAppointment({
          variables: {
            ...appointment
          },
        });
      } else {
        const appointment = {
          ...variablesModel,
          date: appDate,
          startTime: startTime.split(" ")[0],
          morningOrEvening: startTime.split(" ")[1],
          endTime: endTime,
          esthetician: adminAppointmentStaffMember.toString(),
          duration: Number(duration),
          service: serviceList[0],
          store: store_temp
        }
        addAppointment({
          variables: {
            ...appointment
          },
        });
      }

      setTimeout(() => {
        getAllAppointmentsRefetch();
        dispatch(ACTION_LOADING_SPINNER_RESET());
        handleBackToSchedule();
      }, 2000);

    } else {
      if (!adminClientFirstName) {
        changeFirstNameError(true);
      }
  
      if (!adminClientLastName) {
        changeLastNameError(true);
      }
  
      if (!adminClientEmail) {
        changeEmailError(true);
      }
  
      if (!adminClientPhoneNumber) {
        changePhoneNumberError(true);
      }
  
      if (!adminAppointmentDate) {
        changeDateError(true);
      }
  
      if (!adminAppointmentTime) {
        changeTimeError(true);
      }

      if (!duration) {
        changeDurationError(true);
      }
  
      if (!serviceList.length) {
        changeServiceError(true);
      }

      if (!storeList.length) {
        changeStoreError(true);
      }
    }
  };


  useEffect(() => {
    if (addAppointmentData && !loadingSpinnerActive) {
      handleBackToSchedule();
    }
  }, [handleBackToSchedule, addAppointmentData, loadingSpinnerActive]);

  useEffect(() => {
    if (addAppointmentLoading) {
      dispatch(ACTION_LOADING_SPINNER_ACTIVE());
    }
  }, [addAppointmentLoading, dispatch]);

  return (
    <Transition
      items={createAppointmentClicked}
      from={{ transform: "translateX(-100%)" }}
      enter={{ transform: "translateX(0%)" }}
      leave={{ transform: "translateX(-100%)" }}
      config={{ duration: 200 }}
      immediate={stopTransition}
    >
      {(createAppointmentClicked) =>
        createAppointmentClicked &&
        ((styleprops) => (
          <div
            className="admin_create_appointment_container"
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
            <div className="admin_individual_selected_client_back_container">
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                className="admin_individual_selected_client_back_arrow_icon"
                onClick={handleBackToSchedule}
              />
              <p onClick={handleBackToSchedule}>Back to schedule</p>
              <div className="admin_individual_selected_client_top_page_options">
                {/* <p
                  onClick={() => {
                    changePersonalEventClicked(true);
                    changeCreateAppointmentClicked(false);
                    changeStopTransition(true);
                    setTimeout(() => {
                      changeStopTransition(false);
                    }, 1000);
                  }}
                >
                  Create Personal Event
                </p> */}
                <p className="admin_individual_selected_client_chosen_create_page">
                  Create Appointment
                </p>
              </div>
            </div>
            <div className="admin_create_appointment_section_header">
              <h2>Client Information</h2>
            </div>
            <div className="admin_create_appointment_input_information_container">
              <div className={`admin_create_appointment_label admin_create_appointment_double_label ${firstNameError ? "input_error" :""}`}>
                First Name
              </div>
              <ClientAutosuggest
                getClientsData={getClientsData}
                randomColorArray={randomColorArray}
                resetAllErrorStates={resetAllErrorStates}
              />
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
                  value={adminClientLastName}
                  onChange={(e) => {
                    resetAllErrorStates();
                    dispatch(ACTION_ADMIN_CLIENT_LAST_NAME(e.target.value))
                  }}
                  placeholder="Client last name"
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
                  value={adminClientEmail}
                  maxLength={100}
                  onChange={(e) => {
                    resetAllErrorStates();
                    dispatch(ACTION_ADMIN_CLIENT_EMAIL(e.target.value))
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
                  value={adminClientPhoneNumber}
                  aria-controls="react-autowhatever-1"
                  className="react-autosuggest__input"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="admin_create_appointment_section_header">
              <h2>Appointment Details</h2>
            </div>
            <div className="admin_create_appointment_input_information_container">
              <div className={`admin_create_appointment_label admin_create_appointment_double_label ${dateError ? "input_error" :""}`}>
                Date
              </div>
              <DayPickerInput
                classNames={{
                  container: "react-autosuggest__container",
                  overlay: "",
                  overlayWrapper: clickOutsideDayPicker
                    ? "react-autosuggest__input_hide"
                    : "",
                }}
                dayPickerProps={{ disabledDays: { before: new Date() } }}
                inputProps={{
                  className: "react-autosuggest__input",
                  style: {
                    color: "rgb(74, 144, 226)",
                  },
                }}
                style={{
                  outline: dateError ? "3px solid red" : "none",
                  zIndex: dateError ? 99999 : "auto",
                }}
                formatDate={formatDate}
                parseDate={parseDate}
                onDayChange={(day) => {
                  resetAllErrorStates();
                  dispatch(ACTION_ADMIN_APPOINTMENT_DATE(day))
                }}
                format="L"
                value={adminAppointmentDate}
                placeholder="Appointment Date"
              />
              <div className="admin_create_appointment_label admin_create_appointment_double_label">
                Time
              </div>
              <Dropdown
                options={props.timeOptions()}
                onChange={(choice) => {
                  resetAllErrorStates();
                  dispatch(ACTION_ADMIN_APPOINTMENT_TIME(choice.value))
                }}
                value={adminAppointmentTime}
                controlClassName="react-autosuggest__input"
                className="react-autosuggest__container"
                placeholder={
                  adminAppointmentTime
                    ? adminAppointmentTime
                    : "Appointment Time"
                }
                placeholderClassName={
                  adminAppointmentTime
                    ? "admin_create_appointent_dropdown_placeholder_time"
                    : "admin_create_appointent_dropdown_placeholder_no_time"
                }
                style={{
                  outline: timeError ? "3px solid red" : "none",
                  zIndex: timeError ? 99999 : "auto",
                }}
              />
            </div>

            <div className="admin_create_appointment_input_information_container">
              <div className="admin_create_appointment_label">Staff</div>
              <Dropdown
                options={
                  getEmployeeData
                    ? getEmployeeData.employee
                      ? getEmployeeData.employee.employeeRole.includes("Admin")
                        ? allEmployeeOptions()
                        : renderLoggedInStaffName()
                      : renderLoggedInStaffName()
                    : renderLoggedInStaffName()
                }
                onChange={(choice) =>
                  dispatch(ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER(choice))
                }
                value={adminAppointmentStaffMember}
                controlClassName="react-autosuggest__input"
                className="react-autosuggest__container"
                placeholder={
                  adminAppointmentStaffMember
                    ? adminAppointmentStaffMember
                    : "Selected Staff"
                }
                placeholderClassName={
                  adminAppointmentStaffMember
                    ? "admin_create_appointent_dropdown_placeholder_time"
                    : "admin_create_appointent_dropdown_placeholder_no_time"
                }
              />
            </div>

            <div className="admin_create_appointment_input_information_container">
              <div className="admin_create_appointment_label admin_create_appointment_double_label">
                Duration(minutes)
              </div>
              <div
                role="combobox"
                aria-haspopup="listbox"
                aria-owns="react-autowhatever-1"
                aria-controls="react-autowhatever-1"
                aria-expanded="false"
                className="react-autosuggest__container"
                style={{
                  outline: durationError ? "3px solid red" : "none",
                  zIndex: durationError ? 99999 : "auto",
                }}
              >
                <input
                  type="text"
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="react-autowhatever-1"
                  className="react-autosuggest__input"
                  value={duration}
                  onKeyDown={phoneNumberKeyTyping}
                  onChange={(e) => {
                    resetAllErrorStates();
                    changeDuration(e.target.value);
                  }}
                  placeholder="Duration"
                />
              </div>
            </div>
            
            <div className="admin_create_appointment_input_information_container">
              <div className="admin_create_appointment_label">
                Notes
              </div>
              <div
                role="combobox"
                aria-haspopup="listbox"
                aria-owns="react-autowhatever-1"
                aria-controls="react-autowhatever-1"
                aria-expanded="false"
                className="react-autosuggest__container"
              >
                <input
                  type="text"
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="react-autowhatever-1"
                  className="react-autosuggest__input"
                  placeholder={
                    "Enter additional notes for use by staff only (optional)"
                  }
                  value={adminAppointmentNotes}
                  maxLength={200}
                  onChange={(e) =>
                    dispatch(ACTION_ADMIN_APPOINTMENT_NOTES(e.target.value))
                  }
                />
              </div>
            </div>
            {serviceList.length > 0
            ? serviceList.map((service, index) => (
                <div
                  className="admin_create_appointment_input_information_container"
                  key={index}
                >
                  <div className="admin_create_appointment_label admin_create_appointment_double_label">
                    Service
                  </div>
                  <div
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-owns="react-autowhatever-1"
                    aria-controls="react-autowhatever-1"
                    aria-expanded="false"
                    className="react-autosuggest__container"
                    style={{
                      outline: serviceError ? "3px solid red" : "none",
                      zIndex: serviceError ? 99999 : "auto",
                    }}
                  >
                    <input
                      type="text"
                      autoComplete="off"
                      aria-autocomplete="list"
                      aria-controls="react-autowhatever-1"
                      className="react-autosuggest__input admin_create_appointent_dropdown_placeholder_time"
                      value={service}
                      maxLength={100}
                      disabled
                    />
                  </div>
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="admin_create_appointment_treatment_delete_button"
                    onClick={() => {
                      let newArr = [...serviceList];
                      newArr.splice(index, 1);
                      changeServiceList(newArr);
                    }}
                  />
                </div>
              ))
            : null}
            {serviceList.length < 1 ? (
              <div className="admin_create_appointment_input_information_container">
                <div className="admin_create_appointment_label admin_create_appointment_double_label">
                  Service
                </div>
                <Dropdown
                  options={
                    getAllServicesData.all_services.map(item => item.name)
                    .filter((x) => !serviceList.includes(x))
                  }
                  onChange={(choice) => {
                    resetAllErrorStates();
                    changeServiceList([...serviceList, choice.value])
                  }}
                  className="react-autosuggest__container"
                  controlClassName={
                    serviceError
                      ? "react-autosuggest__input personal_event_error"
                      : "react-autosuggest__input"
                  }
                  placeholder="Store service"
                  placeholderClassName="admin_add_service_dropdown_placeholder_no_time"
                />
              </div>
            ) : null}
            {storeList.length > 0
              ? storeList.map((store, index) => (
                  <div
                    className="admin_create_appointment_input_information_container"
                    key={index}
                  >
                    <div className="admin_create_appointment_label admin_create_appointment_double_label">
                      Store
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
              : null}
            {storeList.length < 1 ? (
              <div className="admin_create_appointment_input_information_container">
                <div className="admin_create_appointment_label admin_create_appointment_double_label">
                  Store
                </div>
                <Dropdown
                  options={
                    getAllStoresData.all_stores.map(item => item.name)
                    .filter((x) => !storeList.includes(x))
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
            ) : null}
            <Collapse isOpen={true}>
              <div className="admin_square_payment_form_container book_apppointment_button_container">
                <div className="sq-payment-form width_45p">
                  <div className="sq-creditcard book_apppointment_button" onClick={(e) => handleSubmitBooking(e, true)}>
                    In-Store Meeting
                  </div>
                </div>
                <div className="sq-payment-form width_45p">
                  <div className="sq-creditcard book_apppointment_button" onClick={(e) => handleSubmitBooking(e, false)}>
                    Video Meeting
                  </div>
                </div>
              </div>
            </Collapse>
          </div>
        ))
      }
    </Transition>
  );
};

export default AdminCreateAppointment;
