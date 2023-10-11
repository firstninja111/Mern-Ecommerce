import React, { useState, useEffect, useCallback } from "react";
import { Transition } from "react-spring/renderprops";
import { faLongArrowAltLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import addAppointmentMutation from "../../../graphql/mutations/addAppointmentMutation";
import { useMutation } from "@apollo/react-hooks";
import updateAppointmentMutation from "../../../graphql/mutations/updateAppointmentMutation";
import updateClientInformationMutation from "../../../graphql/mutations/updateClientInformationMutation";
import Modal from "react-modal";
import { css } from "@emotion/css";
import BounceLoader from "react-spinners/BounceLoader";
import Dropdown from "react-dropdown";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";

import ACTION_ADMIN_CLIENT_EMAIL from "../../../actions/Admin/AdminCreateAppointment/AdminClientEmail/ACTION_ADMIN_CLIENT_EMIAL";
import ACTION_ADMIN_CLIENT_PHONE_NUMBER from "../../../actions/Admin/AdminCreateAppointment/AdminClientPhoneNumber/ACTION_ADMIN_CLIENT_PHONE_NUMBER";
import ACTION_ADMIN_CLIENT_LAST_NAME from "../../../actions/Admin/AdminCreateAppointment/AdminClientLastName/ACTION_ADMIN_CLIENT_LAST_NAME";
import ACTION_ADMIN_CLIENT_FIRST_NAME from "../../../actions/Admin/AdminCreateAppointment/AdminClientFirstName/ACTION_ADMIN_CLIENT_FIRST_NAME";
import ACTION_ADMIN_APPOINTMENT_NOTES from "../../../actions/Admin/AdminCreateAppointment/AdminAppointmentNotes/ACTION_ADMIN_APPOINTMENT_NOTES";
import ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER from "../../../actions/Admin/AdminCreateAppointment/AdminAppointmentStaffMember/ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER";
import ACTION_ADMIN_CLIENT_FIRST_NAME_RESET from "../../../actions/Admin/AdminCreateAppointment/AdminClientFirstName/ACTION_ADMIN_CLIENT_FIRST_NAME_RESET";
import ACTION_ADMIN_CLIENT_LAST_NAME_RESET from "../../../actions/Admin/AdminCreateAppointment/AdminClientLastName/ACTION_ADMIN_CLIENT_LAST_NAME_RESET";
import ACTION_ADMIN_CLIENT_PHONE_NUMBER_RESET from "../../../actions/Admin/AdminCreateAppointment/AdminClientPhoneNumber/ACTION_ADMIN_CLIENT_PHONE_NUMBER_RESET";
import ACTION_ADMIN_CLIENT_EMAIL_RESET from "../../../actions/Admin/AdminCreateAppointment/AdminClientEmail/ACTION_ADMIN_CLIENT_EMAIL_RESET";
import ACTION_ADMIN_APPOINTMENT_NOTES_RESET from "../../../actions/Admin/AdminCreateAppointment/AdminAppointmentNotes/ACTION_ADMIN_APPOINTMENT_NOTES_RESET";
import ACTION_LOADING_SPINNER_ACTIVE from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import ACTION_LOADING_SPINNER_RESET from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import ACTION_ON_CHECKEDIN_UPDATE from "../../../actions/Admin/OnCheckedInPage/ACTION_ON_CHECKEDIN_PAGE";

import "../AdminSchedule/AdminCreateAppointment/AdminCreateAppointment.css";
// Minified Bootstrap CSS file (for Collapse feature)
import "../../../bootstrap.min.css";

const AdminAddWaitingUser = (props) => {
  const dispatch = useDispatch();

  const {
    addWaitingUserClicked,
    getClientsData,
    getAllStoresData,
    getAllServicesData,
    randomColorArray,
    changeAddWaitingUserClicked,
    getAllAppointmentsRefetch,
    getEmployeeData,
    selectedAppointement,
    changeSelectedAppointment,
    mode
  } = props;
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
  const logoutClicked = useSelector(
    (state) => state.logoutClicked.log_out_clicked
  );
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );

  const [duration, changeDuration] = useState(30);
  const [serviceList, changeServiceList] = useState([]);
  const [storeList, changeStoreList] = useState([]);
  const [locationList, changeLocationList] = useState([]);

  // Errors
  const [firstNameError, changeFirstNameError] = useState(false);
  const [lastNameError, changeLastNameError] = useState(false);
  const [emailError, changeEmailError] = useState(false);
  const [phoneNumberError, changePhoneNumberError] = useState(false);
  const [serviceError, changeServiceError] = useState(false);
  const [storeError, changeStoreError] = useState(false);
  const [locationError, changeLocationError] = useState(false);

  const [functionalDown, changeFunctionalDown] = useState(false);
  const [cancelAppointConfirm, changeCancelAppointConfirm] = useState(false)
  const [checkInConfirm, changeCheckInConfirm] = useState(false);
  const [clientUpdated, changeClientUpdated] = useState(false);
  const [createCheckInConfirm, changeCreateCheckInConfirm] = useState(false)

  // To show appointment date time in datetime picker, we have to format the datetime.
  const formatAppointDateTime = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const formatMonth = (month > 9 ? "" : "0") + month;
    const date = dateObj.getDate();
    const formatDate = (date > 9 ? "" : "0") + date;

    return year + "-" + formatMonth + "-" + formatDate + " ";
  }

  // If it is create/check-in processing, we should show current time in datetime picker.
  const formatNowDateTime = () => {
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const formatMonth = (month > 9 ? "" : "0") + month;
    const date = dateObj.getDate();
    const formatDate = (date > 9 ? "" : "0") + date;

    const hour = dateObj.getHours();
    const minute = dateObj.getMinutes();

    return year + "-" + formatMonth + "-" + formatDate + " " + hour + ":" + minute;
  }
  const appointmentDateTime = (mode === "create" ? formatNowDateTime() : formatAppointDateTime(new Date(Date.parse(selectedAppointement.date))) + selectedAppointement.startTime)

  const [dateTimeValue, setDateTimeValue] = useState(appointmentDateTime);
  const [updateClientInformation, { loadingDelte, dataDelete }] = useMutation(
    updateClientInformationMutation
  );
  const [updateAppointment, {loadingCheckIn, dataCheckIn}] = useMutation(
    updateAppointmentMutation
  );
  const history = useHistory();

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

    if (serviceError) {
      changeServiceError(false);
    }

    if (storeError) {
      changeStoreError(false);
    }
    if (locationError) {
      changeLocationError(false);
    }
  };

  const variablesModel = {
    firstName: adminClientFirstName,
    lastName: adminClientLastName,
    email: adminClientEmail,
    phoneNumber: adminClientPhoneNumber,
    notes: adminAppointmentNotes,
    duration: duration,
    price: 0,
    store: [],
  };

  const handleBackToAppointments = useCallback(() => {
    changeAddWaitingUserClicked(false);

    dispatch(ACTION_ADMIN_CLIENT_FIRST_NAME_RESET());
    dispatch(ACTION_ADMIN_CLIENT_LAST_NAME_RESET());
    dispatch(ACTION_ADMIN_CLIENT_PHONE_NUMBER_RESET());
    dispatch(ACTION_ADMIN_CLIENT_EMAIL_RESET());
    dispatch(ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER());
    dispatch(ACTION_ADMIN_APPOINTMENT_NOTES_RESET());

    changeSelectedAppointment(null)
    resetAllErrorStates();

    
  }, [dispatch, changeAddWaitingUserClicked]);

  // Create and Check-in new appointment in upcoming page.
  const handleSubmitBooking = async() => {
    // Get Store Detail from store name
    const storeDetail = getAllStoresData.all_stores.filter((item) => {return item.name == storeList[0]});
    if(!storeDetail.length){
      alert("Store name is not matched.")
      return;
    }

    // Crete appointment variableModel for creating.
    const appointment = {
      ...variablesModel,
      date: "",
      startTime: "",
      morningOrEvening: "",
      endTime: "",
      esthetician: "",
      isStoreSchedule: true,
      status: "checked-in",
      store: {
        _id: storeDetail[0]._id,
        name: storeDetail[0].name,
        address: storeDetail[0].address,
        coordinateLat: storeDetail[0].coordinateLat,
        coordinateLng: storeDetail[0].coordinateLng,
        city: storeDetail[0].city,
        country: storeDetail[0].country,
        phone: storeDetail[0].phone,
        email: storeDetail[0].email,
        website: storeDetail[0].website,
        timezone: storeDetail[0].timezone,
        availableServices: storeDetail[0].availableServices,
      },
      type: locationList[0].toLowerCase(),
      service: serviceList[0],
      priority: locationList[0] === "On-line" ? 1 : 2, // When it is on-line we put priority 1
    }

    //Create appointment and go to checkedin page.
    await addAppointment({
      variables: {
        ...appointment
      },
    }).then(()=>{
      setTimeout(()=>{
        dispatch(ACTION_LOADING_SPINNER_RESET());
        dispatch(ACTION_ON_CHECKEDIN_UPDATE());
        history.push("/admin/appointments/checkedin")
      }, 1000)
    });
  };

  const handleCancelAppointment = (e) => {  // Cancel the appointment scheduled.
    changeCancelAppointConfirm(true)
  }

  const handleCheckIn = (e) => {  // Check-in the appointment already scheduled outside of store.
    changeCheckInConfirm(true)
  }

  const handleNewAppointment = (e) => {  // Create and Checkout new appointment directly by concierge for customers who doesn't have appointment.
    let isError = false;
    if (!adminClientFirstName) {
      changeFirstNameError(true);
      isError = true;
    }
    if (!adminClientLastName) {
      changeLastNameError(true);
      isError = true;
    }
    if (!adminClientEmail) {
      changeEmailError(true);
      isError = true;
    }
    if (!adminClientPhoneNumber) {
      changePhoneNumberError(true);
      isError = true;
    }
    if (!serviceList.length) {
      changeServiceError(true);
      isError = true;
    }
    if(!storeList.length) {
      changeStoreError(true);
      isError = true;
    }
    if(!locationList.length) {
      changeLocationError(true);
      isError = true;
    }

    if(isError == true)
      return

    changeCreateCheckInConfirm(true)
  }

  const handleUpdateClient = async (e) => { // Update client information with new form data.
    await updateClientInformation({
      variables: {
        _id: selectedAppointement.client._id,
        _appointId: selectedAppointement._id ,
        firstName: adminClientFirstName,
        lastName: adminClientLastName,
        email: adminClientEmail,
        phoneNumber: adminClientPhoneNumber,
      },
    }).then(()=>{
      setTimeout(()=>{
        changeClientUpdated(true)
      }, 1000)
    });
  }

  useEffect(() => { //Initialize form data for selected appointment or new appointment creation.
    dispatch(ACTION_ADMIN_CLIENT_FIRST_NAME(mode == "create" ? "" : selectedAppointement.client.firstName))
    dispatch(ACTION_ADMIN_CLIENT_LAST_NAME(mode == "create" ? "" : selectedAppointement.client.lastName))
    dispatch(ACTION_ADMIN_CLIENT_EMAIL(mode == "create" ? "" : selectedAppointement.client.email))
    dispatch(ACTION_ADMIN_CLIENT_PHONE_NUMBER(mode == "create" ? "" : selectedAppointement.client.phoneNumber))
    dispatch(ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER(
      getEmployeeData.employee.firstName[0].toUpperCase() +
      getEmployeeData.employee.firstName.slice(1).toLowerCase() +
      " " +
      getEmployeeData.employee.lastName[0].toUpperCase() +
      getEmployeeData.employee.lastName.slice(1).toLowerCase())
    )
    dispatch(ACTION_ADMIN_APPOINTMENT_NOTES(mode == "create" ? "" : selectedAppointement.notes))
    changeDuration(selectedAppointement ? selectedAppointement.duration : 30)
    changeServiceList(selectedAppointement ? [selectedAppointement.service] : [])
    changeStoreList(selectedAppointement ? [selectedAppointement.store.name] : [])
    changeLocationList(selectedAppointement ? [selectedAppointement.type[0].toUpperCase() + selectedAppointement.type.slice(1)] : [])
  }, [mode])

  useEffect(() => { //Initialize state variables when user go back to appoiment list.
    if (addAppointmentData && !loadingSpinnerActive) {
      getAllAppointmentsRefetch();
      dispatch(ACTION_LOADING_SPINNER_RESET());
      handleBackToAppointments();
    }
  }, [handleBackToAppointments, addAppointmentData, loadingSpinnerActive]);

  useEffect(() => {
    if (addAppointmentLoading) {
      dispatch(ACTION_LOADING_SPINNER_ACTIVE());
    }
  }, [addAppointmentLoading, dispatch]);

  return (
    <Transition
      items={addWaitingUserClicked}
      from={{ transform: "translateX(-100%)" }}
      enter={{ transform: "translateX(0%)" }}
      leave={{ transform: "translateX(-100%)" }}
      config={{ duration: 200 }}
    >
      {(addWaitingUserClicked) =>
        addWaitingUserClicked &&
        ((styleprops) => (
          <div
            className="admin_create_appointment_container admin_add_waiting_user_container"
            style={{
              ...styleprops,
              zIndex: logoutClicked || loadingSpinnerActive ? 0 : 5,
            }}
          >
            {/* Just spiner modal */}
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
            {/* ======== Appointment Cancel Confirm Modal =========== */}
            <Modal
              className="cancel_appointment_modal"
              isOpen={cancelAppointConfirm}
              style={{
                content: {
                  position: "fixed",
                  zIndex: 10000,
                  opacity: 0.99,
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
              <Transition
                items={cancelAppointConfirm}
                from={{ transform: "translate3d(0, -65%, 0)" }}
                enter={{ transform: "translate3d(0, 0, 0)" }}
                leave={{ display: "none" }}
              >
                {(cancelAppointConfirm) =>
                  cancelAppointConfirm &&
                  ((styleprops) => (
                    <div
                      className="cancel_appointment_modal_content_container"
                      style={styleprops}
                    >
                      <div className="log_out_modal_contents">
                        <FontAwesomeIcon
                          className="modal_x"
                          icon={faTimes}
                          onClick={() => {changeCancelAppointConfirm(false)}}
                        />
                        <h2>Confirm to cancel</h2>
                        <p style={{margin: 20, lineHeight: "24px"}}>
                          Are you sure you want to <strong>cancel</strong> this appointment? 
                          The appointment will be removed from the Upcoming Appointments list and will no longer be available for Check-in. 
                          The system will treat the appointment as if it never occurred.
                        </p>
                        <span className="logout_buttons_container">
                          <div
                            className="cancel_logout_button"
                            onClick={() => {changeCancelAppointConfirm(false)}}
                          >
                            <p>Cancel</p>
                          </div>
                          <div
                            className="logout_button"
                            onClick={async() => {
                              await updateAppointment({
                                variables: {
                                  _id: selectedAppointement._id,
                                  status: "cancelled",
                                }
                              }).then(()=>{
                                setTimeout(()=>{
                                  getAllAppointmentsRefetch();
                                  handleBackToAppointments();
                                }, 1000)
                              });
                            }}
                          >
                            <p>Continue</p>
                          </div>
                        </span>
                      </div>
                    </div>
                  ))
                }
              </Transition>
            </Modal>

            {/* ======== Appointment Check-In Confirm Modal =========== */}
            <Modal
              className="cancel_appointment_modal"
              isOpen={checkInConfirm}
              style={{
                content: {
                  position: "fixed",
                  zIndex: 10000,
                  opacity: 0.99,
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
              <Transition
                items={checkInConfirm}
                from={{ transform: "translate3d(0, -65%, 0)" }}
                enter={{ transform: "translate3d(0, 0, 0)" }}
                leave={{ display: "none" }}
              >
                {(checkInConfirm) =>
                  checkInConfirm &&
                  ((styleprops) => (
                    <div
                      className="cancel_appointment_modal_content_container"
                      style={styleprops}
                    >
                      <div className="log_out_modal_contents">
                        <FontAwesomeIcon
                          className="modal_x"
                          icon={faTimes}
                          onClick={() => {changeCheckInConfirm(false)}}
                        />
                        <h2>Confirm to check-in</h2>
                        <p style={{margin: 20, lineHeight: "24px"}}>
                          Are you sure you want to <strong>Check-in</strong> this appointment? 
                          The appointment will be removed from the Upcoming Appointments list and will no longer be available to Check-in. 
                        </p>
                        <span className="logout_buttons_container">
                          <div
                            className="cancel_logout_button"
                            onClick={() => {changeCheckInConfirm(false)}}
                          >
                            <p>Cancel</p>
                          </div>
                          <div
                            className="logout_button"
                            onClick={async() => {
                              await updateAppointment({
                                variables: {
                                  _id: selectedAppointement._id,
                                  status: "checked-in",
                                }
                              }).then(()=>{
                                setTimeout(()=>{
                                  dispatch(ACTION_ON_CHECKEDIN_UPDATE());
                                  history.push("/admin/appointments/checkedin")
                                }, 1000)
                              });
                            }}
                          >
                            <p>Continue</p>
                          </div>
                        </span>
                      </div>
                    </div>
                  ))
                }
              </Transition>
            </Modal>
            
            {/* ======== Appointment Create/CheckIn (Direct process) Confirm Modal =========== */}
            <Modal
              className="cancel_appointment_modal"
              isOpen={createCheckInConfirm}
              style={{
                content: {
                  position: "fixed",
                  zIndex: 10000,
                  opacity: 0.99,
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
              <Transition
                items={createCheckInConfirm}
                from={{ transform: "translate3d(0, -65%, 0)" }}
                enter={{ transform: "translate3d(0, 0, 0)" }}
                leave={{ display: "none" }}
              >
                {(createCheckInConfirm) =>
                  createCheckInConfirm &&
                  ((styleprops) => (
                    <div
                      className="cancel_appointment_modal_content_container"
                      style={styleprops}
                    >
                      <div className="log_out_modal_contents">
                        <FontAwesomeIcon
                          className="modal_x"
                          icon={faTimes}
                          onClick={() => {changeCreateCheckInConfirm(false)}}
                        />
                        <h2>Confirm to create and check-in</h2>
                        <p style={{margin: 20, lineHeight: "24px"}}>
                          Are you sure you want to <strong>create and check-in</strong> a new appointment? 
                          The appointment will appear on check-in list directly. 
                        </p>
                        <span className="logout_buttons_container">
                          <div
                            className="cancel_logout_button"
                            onClick={() => {changeCreateCheckInConfirm(false)}}
                          >
                            <p>Cancel</p>
                          </div>
                          <div
                            className="logout_button"
                            onClick={handleSubmitBooking}
                          >
                            <p>Continue</p>
                          </div>
                        </span>
                      </div>
                    </div>
                  ))
                }
              </Transition>
            </Modal>
            
            {/* ======== Clinet Updated Notification Modal =========== */}
            <Modal
              className="cancel_appointment_modal"
              isOpen={clientUpdated}
              style={{
                content: {
                  position: "fixed",
                  zIndex: 10000,
                  opacity: 0.99,
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
              <Transition
                items={clientUpdated}
                from={{ transform: "translate3d(0, -65%, 0)" }}
                enter={{ transform: "translate3d(0, 0, 0)" }}
                leave={{ display: "none" }}
              >
                {(clientUpdated) =>
                  clientUpdated &&
                  ((styleprops) => (
                    <div
                      className="cancel_appointment_modal_content_container"
                      style={styleprops}
                    >
                      <div className="log_out_modal_contents">
                        <FontAwesomeIcon
                          className="modal_x"
                          icon={faTimes}
                          onClick={() => {
                            getAllAppointmentsRefetch();
                            changeClientUpdated(false)
                          }}
                        />
                        <h2>Client is Updated</h2>
                        <p style={{margin: 20, lineHeight: "24px"}}>
                          The client information of appointment is successfully updated. 
                          You can check the details in appointment list page.
                        </p>
                        <span className="logout_buttons_container">
                          <div
                            className="cancel_logout_button"
                            onClick={() => {
                              getAllAppointmentsRefetch();
                              handleBackToAppointments();
                              changeClientUpdated(false)
                            }}
                          >
                            <p>Back To Appointment</p>
                          </div>
                        </span>
                      </div>
                    </div>
                  ))
                }
              </Transition>
            </Modal>

            <div className="admin_individual_selected_client_back_container">
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                className="admin_individual_selected_client_back_arrow_icon"
                onClick={handleBackToAppointments}
              />
              <p onClick={handleBackToAppointments}>Previous</p>
            </div>
            <div className="admin_create_appointment_section_header">
              <h3>Client Information</h3>
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
                  value={adminClientFirstName}
                  onChange={(e) => {
                    resetAllErrorStates();
                    dispatch(ACTION_ADMIN_CLIENT_FIRST_NAME(e.target.value))
                  }}
                  placeholder="First name"
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
                  value={adminClientLastName}
                  onChange={(e) => {
                    resetAllErrorStates();
                    dispatch(ACTION_ADMIN_CLIENT_LAST_NAME(e.target.value))
                  }}
                  placeholder="Last name"
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
                  type="email"
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
            {
              mode === "edit" && 
                <div style={{display:"flex", justifyContent:"flex-end", marginTop:40}}>
                  <Button variant = "contained"  startIcon={<PeopleOutlineIcon />}  onClick={handleUpdateClient}>
                    Update Client
                  </Button>
                </div>
            }

            <div className="admin_create_appointment_section_header">
              <h3>Appointment Details</h3>
            </div>
            <div className="admin_create_appointment_input_information_container">
              <div className="admin_create_appointment_label">
                Datetime {mode === "create" ? "(Now)" : ""}
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    className="appointmentDateTimePicker"
                    renderInput={(props) => <TextField {...props} />}
                    label=""
                    value={dateTimeValue}
                    onChange={(newValue) => {
                      setDateTimeValue(newValue);
                    }}
                    sx={{width : 1}}
                    disabled={mode === "edit"}
                  />
                </LocalizationProvider>
              </div>
            </div>
            
            <div className="admin_create_appointment_input_information_container">
              <div className="admin_create_appointment_label">
                Staff
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
                    "Enter Staff Name"
                  }
                  value = {mode === "create" ? adminAppointmentStaffMember : (selectedAppointement.type != "on-line" ? adminAppointmentStaffMember : "N/A")}
                  maxLength={200}
                  onChange={(e) => 
                    dispatch(ACTION_ADMIN_APPOINTMENT_STAFF_MEMBER(e.target.value))
                  }
                />
              </div>
            </div>
            <div className="admin_create_appointment_input_information_container">
              <div className="admin_create_appointment_label">
                Duration (minute)
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
                  type="number"
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-controls="react-autowhatever-1"
                  className="react-autosuggest__input"
                  placeholder={
                    "Enter duration minutes"
                  }
                  value={duration}
                  maxLength={200}
                  onChange={(e) =>
                    changeDuration(e.target.value)
                  }
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
                    <div className="admin_create_appointment_label">
                      Service
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
                        className="react-autosuggest__input admin_create_appointent_dropdown_placeholder_time"
                        value={service}
                        maxLength={100}
                        disabled
                      />
                    </div>
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{color: "#a51b05d1"}}
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
                <div className="admin_create_appointment_label">
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
                    <div className="admin_create_appointment_label">
                      Store
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
                        className="react-autosuggest__input admin_create_appointent_dropdown_placeholder_time"
                        value={store}
                        maxLength={100}
                        disabled
                      />
                    </div>
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{color: "#a51b05d1"}}
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
                <div className="admin_create_appointment_label">
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
                  placeholderClassName="admin_add_store_dropdown_placeholder_no_time"
                />
              </div>
            ) : null}
            {locationList.length > 0
              ? locationList.map((location, index) => (
                  <div
                    className="admin_create_appointment_input_information_container"
                    key={index}
                  >
                    <div className="admin_create_appointment_label">
                      Location
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
                        className="react-autosuggest__input admin_create_appointent_dropdown_placeholder_time"
                        value={location}
                        maxLength={100}
                        disabled
                      />
                    </div>
                    <FontAwesomeIcon
                      icon={faTimes}
                      style={{color: "#a51b05d1"}}
                      className="admin_create_appointment_treatment_delete_button"
                      onClick={() => {
                        let newArr = [...locationList];
                        newArr.splice(index, 1);
                        changeLocationList(newArr);
                      }}
                    />
                  </div>
                ))
              : null}
            {locationList.length < 1 ? (
              <div className="admin_create_appointment_input_information_container">
                <div className="admin_create_appointment_label">
                  Location
                </div>
                <Dropdown
                  options={
                    ["On-line", "Instore"]
                  }
                  onChange={(choice) => {
                    resetAllErrorStates();
                    changeLocationList([...locationList, choice.value])
                  }}
                  className="react-autosuggest__container"
                  controlClassName={
                    locationError
                      ? "react-autosuggest__input personal_event_error"
                      : "react-autosuggest__input"
                  }
                  placeholderClassName="admin_add_location_dropdown_placeholder_no_time"
                />
              </div>
            ) : null}
            
            {mode == "edit" && 
              <div style={{display:"flex", gap:20, justifyContent:"flex-end", marginTop:40}}>
                  <Button variant = "contained" startIcon={<DeleteIcon />}  color="error"  onClick={handleCancelAppointment}>
                    Cancel Appointment
                  </Button>
                  {
                    selectedAppointement.type === "instore" &&
                      <Button variant = "contained"  startIcon={<SendIcon />}  onClick={handleCheckIn}>
                        Check-in
                      </Button>
                  }
              </div>
            }
            {mode == "create" && 
              <div style={{display:"flex", gap:20, justifyContent:"flex-end", marginTop:40}}>
                  <Button variant = "contained"  startIcon={<SendIcon />}  onClick={handleNewAppointment}>
                    Check-in
                  </Button>
              </div>
            }
          </div>
        ))
      }
    </Transition>
  );
};

export default AdminAddWaitingUser;
