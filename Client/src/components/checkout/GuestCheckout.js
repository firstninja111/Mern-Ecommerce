import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, Redirect } from "react-router-dom";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { useDispatch, useSelector } from "react-redux";
import { Spring } from "react-spring/renderprops";
import { css } from "@emotion/css";
import BounceLoader from "react-spinners/BounceLoader";
import Modal from "react-modal";
import Email from "./Form/Email";
import PhoneNumber from "./Form/PhoneNumber";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import addAppointmentMutation from "../../graphql/mutations/addAppointmentMutation";
import updateAppointmentMutation from "../../graphql/mutations/updateAppointmentMutation";
import getAppointmentQuery from "../../graphql/queries/getAppointmentQuery";
import getClientQuery from "../../graphql/queries/getClientQuery";
import processAppointmentMutation from "../../graphql/mutations/processAppointmentMutation"
import ACTION_FIRST_NAME from "../../actions/GuestCheckoutForm/FirstName/ACTION_FIRST_NAME";
import ACTION_LAST_NAME from "../../actions/GuestCheckoutForm/LastName/ACTION_LAST_NAME";
import ACTION_FIRST_NAME_RESET from "../../actions/GuestCheckoutForm/FirstName/ACTION_FIRST_NAME_RESET";
import ACTION_LAST_NAME_RESET from "../../actions/GuestCheckoutForm/LastName/ACTION_LAST_NAME_RESET";
import ACTION_APPOINTMENT_NOTES from "../../actions/GuestCheckoutForm/AppointmentNotes/ACTION_APPOINTMENT_NOTES";
import ACTION_BOOKING_SUMMARY_ACTIVE from "../../actions/ContinueToBookingSummaryButtonActive/ACTION_BOOKING_SUMMARY_ACTIVE";
import ACTION_APPOINTMENT_NOTES_INVALID from "../../actions/GuestCheckoutForm/AppointmentNotes/ACTION_APPOINTMENT_NOTES_INVALID";
import ACTION_APPOINTMENT_NOTES_VALID from "../../actions/GuestCheckoutForm/AppointmentNotes/ACTION_APPOINTMENT_NOTES_VALID";
import ACTION_BOOKING_SUMMARY_NOT_ACTIVE from "../../actions/ContinueToBookingSummaryButtonActive/ACTION_BOOKING_SUMMARY_NOT_ACTIVE";
import ACTION_TIME_PREFERENCE_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_TIME_PREFERENCE_PAGE_OPENED";
import ACTION_CONFIRMATION_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_CONFIRMATION_PAGE_OPENED";
import ACTION_LOADING_SPINNER_ACTIVE from "../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import ACTION_LOADING_SPINNER_RESET from "../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import ACTION_IS_ECOMMERCE_MEETNOW_NOT_ACTIVE from "../../actions/Ecommerce/ACTION_IS_ECOMMERCE_MEETNOW_NOT_ACTIVE";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Form, FormGroup, FormText, Label, Input } from "reactstrap";
import "./GuestCheckout.css";
import "./ConfirmationPage.css";
import "../account/clientprofile/ConsentForm/ConsentForm.css";

// Minified Bootstrap CSS file (for Forms)
import "../../bootstrap_forms.min.css";
import ACTION_CART_IS_NOT_ACTIVE from "../../actions/CartIsActive/ACTION_CART_IS_NOT_ACTIVE";
import ACTION_CART_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_CART_PAGE_OPENED";
import ACTION_IS_STOREPAGE_NOT_ACTIVE from "../../actions/Stores/ACTION_IS_STOREPAGE_NOT_ACTIVE";
import ACTION_PHONE_NUMBER_RESET from "../../actions/GuestCheckoutForm/PhoneNumber/ACTION_PHONE_NUMBER_RESET";
import ACTION_IS_ECOMMERCEPAGE_ACTIVE from "../../actions/Ecommerce/ACTION_IS_ECOMMERCEPAGE_ACTIVE";
import ACTION_EMAIL_RESET from "../../actions/GuestCheckoutForm/Email/ACTION_EMAIL_RESET";
import ACTION_BODY_SCROLL_ALLOW from "../../actions/Body_Scroll/ACTION_BODY_SCROLL_ALLOW";
import ACTION_PHONE_NOT_INVALID from "../../actions/PhoneNumberValidation/Invalid/ACTION_PHONE_NOT_INVALID";
import ACTION_PHONE_NOT_VALID from "../../actions/PhoneNumberValidation/Valid/ACTION_PHONE_NOT_VALID";

const GuestCheckout = (props) => {
  const dispatch = useDispatch();
  let location = useLocation();

  const firstName = useSelector((state) => state.firstName.first_name);
  const lastName = useSelector((state) => state.lastName.last_name);
  const email = useSelector((state) => state.email.email);
  const phoneNumber = useSelector((state) => state.phoneNumber.phone_number); 
  const continueToBookingSummaryActive = useSelector(
    (state) => state.continueToBookingSummaryActive.bookingSummaryActive
  );
  const splashScreenComplete = useSelector(
    (state) => state.splashScreenComplete.splashScreenComplete
  );
  const userAuthenticated = useSelector(
    (state) => state.userAuthenticated.user_authenticated
  );
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );

  const ecommerceMeetNowActive = useSelector(
    (state) => state.ecommerceMeetNowActive.ecommerceMeetNowActive
  );
  const ecommercePageActive = useSelector(
    (state) => state.ecommercePageActive.ecommercePageActive
  )
  const selectedEsthetician = useSelector(
    (state) => state.selectedEsthetician.selectedEsthetician
  );

  // Email States
  const emailIsValid = useSelector((state) => state.emailIsValid.email_valid);

  // Phone Number States
  const phoneIsValid = useSelector((state) => state.phoneIsValid.phone_valid);

  // Appointment Notes States
  const appointmentNotes = useSelector(
    (state) => state.appointmentNotes.appointment_notes
  );
  const appointmentNotesValid = useSelector(
    (state) => state.appointmentNotesValid.appointmentNotesValid
  );

  const [bookedAppointment, changeBookedAppointment] = useState(false);
  const [fetchedAppointmentData, changeFetchedAppointmentData] = useState(null);

  const timer = useRef(null);

  const [
    addAppointment,
    { loading: appLoading, data: appointmentData },
  ] = useMutation(addAppointmentMutation);

  const [
    updateAppointment, 
    {loadingCheckIn, dataCheckIn}
  ] = useMutation(updateAppointmentMutation);

  const [
    processAppointment,
    { loading: processAppointmentLoading, data: processAppointmentData },
  ] = useMutation(processAppointmentMutation);

  const [getClient, { data: clientData }] = useLazyQuery(getClientQuery, {
    fetchPolicy: "no-cache",
  });

  const [getAppointment, {data: getAppointmentData}] = useLazyQuery(getAppointmentQuery, {
    fetchPolicy: "no-cache",
  })

  const override = css`
    display: block;
    position: absolute;
    left: 25%;
    right: 25%;
  `;

  useEffect(() => {
    if(bookedAppointment && !appLoading && getAppointmentData){
      changeFetchedAppointmentData(getAppointmentData ? getAppointmentData.appointment: null);
    }
  }, [getAppointmentData])

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = null;
  }, [ecommercePageActive]);
  
  useEffect(() => {
    if (props.getEmployeesError) {
      props.getEmployeesRefetch();
    }
  }, [props.getEmployeesError, props.getEmployeesRefetch]);

  useEffect(() => {
    if (appointmentData && !appLoading) {
      if(appointmentData.addAppointment){
        // select employee
        let filteredEmployeesArr = []
        if (props.getEmployeesData && props.selectedStore) {
          if (props.getEmployeesData.employees) {
            if(props.selectedStore){
              // select store manager
              filteredEmployeesArr = props.getEmployeesData.employees.filter(
                (x) => {
                  return x.store._id ==props.selectedStore._id;
                }
              );
            }
          }
        }
        timer.current = setInterval(() => {
          getAppointment({
            variables: {
              ...appointmentData.addAppointment,
              firstName: appointmentData.addAppointment.client.firstName,
              lastName: appointmentData.addAppointment.client.lastName,
              email: appointmentData.addAppointment.client.email,
              phoneNumber: appointmentData.addAppointment.client.phoneNumber
            },
          })
        }, 10000);
        changeFetchedAppointmentData(appointmentData.addAppointment);
        dispatch(ACTION_LOADING_SPINNER_RESET());
        const url = "https://meet.jit.si/" + appointmentData.addAppointment._id
        var tracardiRequest = {
          "client_email": appointmentData.addAppointment.client.email, 
          "client_firstname": appointmentData.addAppointment.client.firstName, 
          "client_lastname": appointmentData.addAppointment.client.lastName, 
          "staff_name": selectedEsthetician, 
          "vdc_date": appointmentData.addAppointment.date, 
          "vdc_time": appointmentData.addAppointment.startTime, 
          "vdc_url": url, 
        };

        // tracardi
        filteredEmployeesArr.forEach((employee) => {
          setTimeout(() => {
            tracardiRequest.staff_name = employee.firstName + " " + employee.lastName;
            window.tracker.track("add-videocall", {...tracardiRequest});
            window.tracker.track("add-appointment", {"appt-email": appointmentData.addAppointment.client.email});
          }, 500)
        })
      }
    }
  }, [appointmentData]);

  useEffect(() => {
    if (userAuthenticated) {
      getClient({
        variables: {
          _id: Cookies.get("dummy-token")
            ? jwt.decode(Cookies.get("dummy-token")).id
            : null,
        },
      });
    }
  }, [getClient, userAuthenticated]);

  useEffect(() => {
    if (appLoading) {
      if (!loadingSpinnerActive) {
        dispatch(ACTION_LOADING_SPINNER_ACTIVE());
      }
    }
  }, [appLoading, dispatch, loadingSpinnerActive]);

  const redirectToHome = () => {
    if (!splashScreenComplete) {
      return <Redirect to="/" />;
    } else if (!props.currentScreenSize) {
      if (props.initialScreenSize >= 1200) {
        return <Redirect to="/" />;
      }
    } else if (props.currentScreenSize >= 1200) {
      return <Redirect to="/" />;
    }
  };

  const redirectToConfirmationPage = () => {
    if (userAuthenticated && !ecommerceMeetNowActive) {
      return <Redirect to="/checkout/confirmation" />;
    }
  };

  const handleFirstName = (e) => {
    dispatch(ACTION_FIRST_NAME(e.currentTarget.value.trim()));
  };

  const handleLastName = (e) => {
    dispatch(ACTION_LAST_NAME(e.currentTarget.value.trim()));
  };

  const firstNameTyping = () => {
    dispatch(ACTION_FIRST_NAME_RESET());
  };

  const lastNameTyping = () => {
    dispatch(ACTION_LAST_NAME_RESET());
  };

  const appointmentNotesTyping = (e) => {
    dispatch(ACTION_APPOINTMENT_NOTES(e.currentTarget.value.trim()));
  };

  const handleConfirmDetailsButtonClick = () => {
    if (!ecommerceMeetNowActive) {
      dispatch(ACTION_BOOKING_SUMMARY_ACTIVE());
      dispatch(ACTION_CONFIRMATION_PAGE_OPENED());
    } else {
      clearInterval(timer.current);
      timer.current = null;
      // add appointment
      const variablesModel = {
        date: "",
        startTime: "",
        morningOrEvening: "",
        endTime: "",
        duration: 30,
        price: 0,
        esthetician: null, //selectedEsthetician,
        store: {
          _id: props.selectedStore._id,
          name: props.selectedStore.name,
          address: props.selectedStore.address,
          coordinateLat: props.selectedStore.coordinateLat,
          coordinateLng: props.selectedStore.coordinateLng,
          city: props.selectedStore.city,
          country: props.selectedStore.country,
          phone: props.selectedStore.phone,
          email: props.selectedStore.email,
          website: props.selectedStore.website,
          timezone: props.selectedStore.timezone,
          availableServices: props.selectedStore.availableServices,
        },
        firstName: userAuthenticated
          ? clientData
            ? clientData.client.firstName
            : firstName
          : firstName,
        lastName: userAuthenticated
          ? clientData
            ? clientData.client.lastName
            : lastName
          : lastName,
        email: userAuthenticated ? (clientData ? clientData.client.email : email) : email,
        phoneNumber: userAuthenticated
          ? clientData
            ? clientData.client.phoneNumber
            : phoneNumber
          : phoneNumber,
        notes: appointmentNotes,
        type: ecommerceMeetNowActive ? "on-line" : "instore",
        priority: 1,
      };
      // Online Location Create Appointment
      addAppointment({
        variables: { ...variablesModel },
      });
      changeBookedAppointment(true);
    }
  };

  const renderRemainingCharacters = () => {
    let remainingCharacters = [];

    if (appointmentNotes) {
      remainingCharacters.unshift("(", Math.abs(500 - appointmentNotes.length));

      if (500 - appointmentNotes.length === 1) {
        remainingCharacters.push(" character remaining).");

        if (!appointmentNotesValid) {
          dispatch(ACTION_APPOINTMENT_NOTES_VALID());
        }
      } else {
        if (500 - appointmentNotes.length < 0) {
          remainingCharacters.push(" too many).");
          dispatch(ACTION_BOOKING_SUMMARY_NOT_ACTIVE());
          if (appointmentNotesValid) {
            dispatch(ACTION_APPOINTMENT_NOTES_INVALID());
          }
        } else {
          remainingCharacters.push(" characters remaining).");

          if (!appointmentNotesValid) {
            dispatch(ACTION_APPOINTMENT_NOTES_VALID());
          }
        }
      }
    }
    return remainingCharacters.join("");
  };

  useEffect(() => {
    if (location.pathname.includes("checkout")) {
      window.scrollTo(0, 0);
    } 
  }, [location.pathname]);

  const handleJoinMeeting = () => {
    updateAppointment({
      variables: {
        _id: fetchedAppointmentData._id,
        status: "checked-in",
      }
    })
    clearInterval(timer.current);
    timer.current = null;
    changeBookedAppointment(false);
    changeFetchedAppointmentData(null);
    dispatch(ACTION_BODY_SCROLL_ALLOW);
    dispatch(ACTION_FIRST_NAME_RESET());
    dispatch(ACTION_LAST_NAME_RESET());
    dispatch(ACTION_PHONE_NOT_INVALID());
    dispatch(ACTION_PHONE_NOT_VALID());
    dispatch(ACTION_PHONE_NUMBER_RESET());
    dispatch(ACTION_EMAIL_RESET());
    dispatch(ACTION_CART_IS_NOT_ACTIVE());
    dispatch(ACTION_CART_PAGE_OPENED());
    dispatch(ACTION_IS_STOREPAGE_NOT_ACTIVE());
    dispatch(ACTION_IS_ECOMMERCEPAGE_ACTIVE());
    dispatch(ACTION_IS_ECOMMERCE_MEETNOW_NOT_ACTIVE());
    dispatch(ACTION_APPOINTMENT_NOTES(""));
    window.scrollTo(0, 0);
  };

  const handleDeclineMeeting = () => {
    clearInterval(timer.current);
    timer.current = null;
    changeBookedAppointment(false);
    changeFetchedAppointmentData(null);
    dispatch(ACTION_BODY_SCROLL_ALLOW);
    dispatch(ACTION_FIRST_NAME_RESET());
    dispatch(ACTION_LAST_NAME_RESET());
    dispatch(ACTION_PHONE_NOT_INVALID());
    dispatch(ACTION_PHONE_NOT_VALID());
    dispatch(ACTION_PHONE_NUMBER_RESET());
    dispatch(ACTION_EMAIL_RESET());
    dispatch(ACTION_CART_IS_NOT_ACTIVE());
    dispatch(ACTION_CART_PAGE_OPENED());
    dispatch(ACTION_IS_STOREPAGE_NOT_ACTIVE());
    dispatch(ACTION_IS_ECOMMERCEPAGE_ACTIVE());
    dispatch(ACTION_IS_ECOMMERCE_MEETNOW_NOT_ACTIVE());
    dispatch(ACTION_APPOINTMENT_NOTES(""));
    window.scrollTo(0, 0);
  };

  return (
    <div className="checkout_container">
      {redirectToHome()}
      {redirectToConfirmationPage()}
      <div className="checkout_container_header">
        <Link
          to={
            !props.currentScreenSize
              ? props.initialScreenSize >= 1200
                ? "/"
                : "/availability/timepreference"
              : props.currentScreenSize >= 1200
              ? "/"
              : "/availability/timepreference"
          }
          onClick={() => dispatch(ACTION_TIME_PREFERENCE_PAGE_OPENED())}
        >
          <FontAwesomeIcon
            className="checkout_back_arrow"
            style={{
              display: ecommerceMeetNowActive ? "none" : "block",
            }}
            icon={faChevronLeft}
          />
        </Link>
        <h1>Register</h1>
        <Link
          to={
            !props.currentScreenSize
              ? props.initialScreenSize >= 1200
                ? "/"
                : "/checkout/confirmation"
              : props.currentScreenSize >= 1200
              ? "/"
              : "/checkout/confirmation"
          }
          onClick={() => dispatch(ACTION_CONFIRMATION_PAGE_OPENED())}
        >
          <FontAwesomeIcon
            className="checkout_forward_arrow"
            style={{
              display: continueToBookingSummaryActive ? "block" : "none",
            }}
            icon={faChevronRight}
          />
        </Link>
      </div>
      <div className="checkout_header">
        <h2>CHECKOUT AS GUEST</h2>
      </div>
      <div className="guest_checkout_form_container">
        <Form>
          <FormGroup>
            <Label for="firstName">
              {" "}
              <div className="top_form_container">
                <div className="required_label">
                  First Name<p className="required_label red_asterisk">* </p>
                </div>
                <div className="required_fields_container">
                  <p className="red_asterisk">* </p>{" "}
                  <p className="required_fields_statement"> Required Fields</p>
                </div>
              </div>
            </Label>
            <Input
              type="text"
              name="firstName"
              defaultValue={firstName}
              maxLength={50}
              placeholder="First name"
              className="input_field"
              onBlur={handleFirstName}
              onChange={firstNameTyping}
              valid={firstName === "" ? false : true}
            />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">
              <div className="required_label">
                Last Name<p className="required_label red_asterisk">* </p>
              </div>
            </Label>
            <Input
              type="text"
              name="lastName"
              defaultValue={lastName}
              maxLength={50}
              placeholder="Last name"
              onChange={lastNameTyping}
              onBlur={handleLastName}
              className="input_field"
              valid={lastName === "" ? false : true}
            />
          </FormGroup>
          <Email />
          <PhoneNumber />
          <FormGroup>
            <Label for="appointmentNotes">Appointment Notes</Label>
            <Input
              type="textarea"
              className="form_appointment_notes form_notes_container"
              maxLength={1000}
              placeholder="Enter any skin care issues/concerns here."
              defaultValue={appointmentNotes}
              style={{
                fontFamily: "Montserrat",
              }}
              name="appointmentNotes"
              onChange={appointmentNotesTyping}
            />
            <FormText
              className="form_appointment_notes_caption"
              style={{ color: "rgb(151, 151, 151)" }}
            >
              <p
                style={{
                  color:
                    500 - appointmentNotes.length < 0
                      ? "rgb(255, 22, 34)"
                      : "rgb(151, 151, 151)",
                  transition: "color 0.5s ease",
                }}
                className="notes_character_limit"
              >
                Maximum 500 characters {renderRemainingCharacters()}
              </p>
              <p>
                To protect your privacy, do not include any privileged material
                such as personal health information.{" "}
              </p>
            </FormText>
          </FormGroup>
        </Form>
        <div className="guest_checkout_bottom_buttons_container">
          <Link
            to={
              !props.currentScreenSize
                ? props.initialScreenSize >= 1200
                  ? "/"
                  : "/checkout/confirmation"
                : props.currentScreenSize >= 1200
                ? "/"
                : "/checkout/confirmation"
            }
            style={{
              display: "block",
              pointerEvents:
                firstName &&
                lastName &&
                emailIsValid &&
                phoneIsValid &&
                appointmentNotesValid
                  ? "auto"
                  : "none",
            }}
            onClick={handleConfirmDetailsButtonClick}
          >
            <div
              className="confirm_details_button"
              style={{
                background:
                  firstName &&
                  lastName &&
                  emailIsValid &&
                  phoneIsValid &&
                  appointmentNotesValid
                    ? "rgb(44, 44, 52)"
                    : "#f0f0f0",
                color:
                  firstName &&
                  lastName &&
                  emailIsValid &&
                  phoneIsValid &&
                  appointmentNotesValid
                    ? "rgb(255, 255, 255)"
                    : "rgb(201, 201, 201)",
                transition: "background 0.5s ease, color 0.5s ease",
              }}
            >
              {ecommerceMeetNowActive ? <p>Meet Now</p> : <p>Continue</p>}
            </div>
          </Link>
          {!ecommerceMeetNowActive && (
            <Link
              to={
                !props.currentScreenSize
                  ? props.initialScreenSize >= 1200
                    ? "/"
                    : "/availability/timepreference"
                  : props.currentScreenSize >= 1200
                  ? "/"
                  : "/availability/timepreference"
              }
              onClick={() => dispatch(ACTION_TIME_PREFERENCE_PAGE_OPENED())}
            >
              <div className="change_time_button">
                <p>Change Time</p>
              </div>
            </Link>
          )}
        </div>
      </div>
      <Modal
        isOpen={bookedAppointment}
        style={{
          content: {
            position: "fixed",
            zIndex: "10000",
            height: "100%",
            backdropFilter: "blur(10px) brightness(35%)",
            WebkitBackdropFilter: "blur(10px) brightness(35%)",
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
        <div className="final_booking_modal">
          <div className="final_booking_modal_contents">
            <Link to="/">
              <FontAwesomeIcon
                className="modal_x"
                icon={faTimes}
                onClick={handleDeclineMeeting}
              />
            </Link>
            <div className="modal_calendar_icon_container">
              <svg
                className="modal_calendar_icon"
                width="100%"
                height="6rem"
                viewBox="0 0 13.229 13.229"
              >
                <path d="M1.637 12.36a.469.469 0 01-.263-.288c-.036-.131-.035-9.665 0-9.796a.484.484 0 01.287-.294c.058-.017.358-.027.814-.027h.721v-.264c0-.319.027-.423.142-.54.117-.12.214-.145.568-.145.284 0 .308.004.424.066.1.054.135.09.188.193.06.117.064.146.064.408v.282h4.156v-.264c0-.319.028-.423.142-.54.117-.12.214-.145.569-.145.284 0 .307.004.423.066.1.054.136.09.188.193.06.117.064.146.064.408v.282h.722c.455 0 .755.01.813.027a.484.484 0 01.287.294c.036.134.036 9.665 0 9.799a.484.484 0 01-.287.294c-.066.019-1.49.026-5.01.025-4.18 0-4.933-.006-5.012-.034zm9.873-4.117V4.565h-9.7v7.356h9.7zm0-4.983v-.83h-1.386v.282c0 .262-.005.29-.064.408a.366.366 0 01-.188.193c-.117.063-.138.066-.44.066-.304 0-.325-.004-.442-.066a.366.366 0 01-.187-.193c-.06-.117-.065-.146-.065-.408V2.43H4.582v.282c0 .262-.005.29-.064.408a.366.366 0 01-.188.193c-.117.063-.138.066-.44.066-.304 0-.325-.004-.442-.066a.366.366 0 01-.187-.193c-.06-.117-.065-.146-.065-.408V2.43H1.811v1.66h9.699zM4.12 2.192v-.711h-.462v1.423h.462zm5.542 0v-.711H9.2v1.423h.462z" />
              </svg>
              <Spring
                from={{ x: 100 }}
                to={{ x: 0 }}
                config={{ delay: 500, duration: 2000 }}
              >
                {(styles) => (
                  <svg
                    width="100%"
                    height="0.5rem"
                    className="modal_checkmark"
                    viewBox="0 0 13.229 13.229"
                  >
                    <path
                      d="M2.851 7.56l2.45 2.482 5.36-6.958"
                      fill="none"
                      stroke="rgb(55, 55, 55)"
                      strokeDasharray="100"
                      strokeDashoffset={`${styles.x}`}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    />
                  </svg>
                )}
              </Spring>
            </div>
            <p className="modal_confirmation_statement">
              {userAuthenticated
                ? clientData
                  ? clientData.client.firstName
                  : firstName
                : firstName}
              , your appointment with the store {props.selectedStore.name} has
              been confirmed.
            </p>
            <p className="modal_confirmation_statement modal_confirmation_statement_second">
              {!fetchedAppointmentData?.isProcessed && <span>Please wait while a staff accept the meeting.</span>}
              {fetchedAppointmentData?.isProcessed && <span>Meeting ended!</span>}
            </p>
            <a
              href={`https://meet.jit.si/${
                fetchedAppointmentData ? fetchedAppointmentData._id : ""
              }`}
              target="_blank"
            >
              <button
                className="cancel_appointment_button join_meeting_button"
                // disabled={
                //   !(fetchedAppointmentData
                //     ? fetchedAppointmentData.confirmed && !fetchedAppointmentData.isProcessed
                //     : false)
                // }
                onClick={handleJoinMeeting}
              >
                Join to the Meeting
              </button>
            </a>
            <div className="modal_date_time_container">
              <div className="modal_bold_details_container">
                <p className="modal_appointment_provider">CHOIREDEX</p>
              </div>
              <div className="modal_bottom_info_container">
                <div className="modal_address_container">
                  <p>{props.selectedStore.address}</p>
                  <p>|</p>
                  <p>{props.selectedStore.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GuestCheckout;
