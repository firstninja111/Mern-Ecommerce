import React, { useEffect, useCallback, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Spring } from "react-spring/renderprops";
import { css } from "@emotion/css";
import BounceLoader from "react-spinners/BounceLoader";
import Modal from "react-modal";
import getClientQuery from "../../graphql/queries/getClientQuery";
import addAppointmentMutation from "../../graphql/mutations/addAppointmentMutation";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCalendar,
  faClock,
  faTimes,
  faAddressBook,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import ACTION_LOADING_SPINNER_ACTIVE from "../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import ACTION_LOADING_SPINNER_RESET from "../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import ACTION_FINAL_BOOK_BUTTON_ACTIVE from "../../actions/FinalBookButton/ACTION_FINAL_BOOK_BUTTON_ACTIVE";
import ACTION_SELECT_TIME_NOT_ACTIVE from "../../actions/SelectTimeActive/ACTION_SELECT_TIME_NOT_ACTIVE";
import ACTION_SELECTED_TIME_RESET from "../../actions/SelectedTime/ACTION_SELECTED_TIME_RESET";
import ACTION_ALL_COLLAPSE_RESET from "../../actions/SelectedTime/CollapseIsOpen/ACTION_ALL_COLLAPSE_RESET";
import ACTION_ADD_ONS_CART_RESET from "../../actions/InCart/AddOns/ACTION_ADD_ONS_CART_RESET";
import ACTION_TREATMENTS_CART_RESET from "../../actions/InCart/Treatments/ACTION_TREATMENTS_CART_RESET";
import ACTION_TOTAL_PRICE_RESET from "../../actions/TotalPrice/ACTION_TOTAL_PRICE_RESET";
import ACTION_TOTAL_DURATION_RESET from "../../actions/TotalDuration/ACTION_TOTAL_DURATION_RESET";
import ACTION_SELECTED_DAY_RESET from "../../actions/SelectedDay/ACTION_SELECTED_DAY_RESET";
import ACTION_REFORMATTED_DAY_RESET from "../../actions/SelectedDay/ReformattedDay/ACTION_REFORMATTED_DAY_RESET";
import ACTION_REFORMATTED_DAY_CLONE_RESET from "../../actions/SelectedDay/ReformattedDayClone/ACTION_REFORMATTED_DAY_CLONE_RESET";
import ACTION_PHONE_NOT_VALID from "../../actions/PhoneNumberValidation/Valid/ACTION_PHONE_NOT_VALID";
import ACTION_PHONE_NOT_INVALID from "../../actions/PhoneNumberValidation/Invalid/ACTION_PHONE_NOT_INVALID";
import ACTION_APPOINTMENT_NOTES_RESET from "../../actions/GuestCheckoutForm/AppointmentNotes/ACTION_APPOINTMENT_NOTES_RESET";
import ACTION_EMAIL_RESET from "../../actions/GuestCheckoutForm/Email/ACTION_EMAIL_RESET";
import ACTION_FIRST_NAME_RESET from "../../actions/GuestCheckoutForm/FirstName/ACTION_FIRST_NAME_RESET";
import ACTION_LAST_NAME_RESET from "../../actions/GuestCheckoutForm/LastName/ACTION_LAST_NAME_RESET";
import ACTION_PHONE_NUMBER_RESET from "../../actions/GuestCheckoutForm/PhoneNumber/ACTION_PHONE_NUMBER_RESET";
import ACTION_FINAL_BOOK_BUTTON_RESET from "../../actions/FinalBookButton/ACTION_FINAL_BOOK_BUTTON_RESET";
import ACTION_EMAIL_NOT_INVALID from "../../actions/EmailValidation/Invalid/ACTION_EMAIL_NOT_INVALID";
import ACTION_EMAIL_NOT_VALID from "../../actions/EmailValidation/Valid/ACTION_EMAIL_NOT_VALID";
import ACTION_RESET_COUNTER from "../../actions/Counter/ACTION_RESET_COUNTER";
import ACTION_CONTINUE_BUTTON_RESET from "../../actions/ContinueToCheckoutButtonActive/ACTION_CONTINUE_BUTTON_RESET";
import ACTION_BOOKING_SUMMARY_NOT_ACTIVE from "../../actions/ContinueToBookingSummaryButtonActive/ACTION_BOOKING_SUMMARY_NOT_ACTIVE";
import ACTION_CART_IS_NOT_ACTIVE from "../../actions/CartIsActive/ACTION_CART_IS_NOT_ACTIVE";
import ACTION_AVAILABILITY_RESET from "../../actions/AvailabilityClicked/ACTION_AVAILABILITY_RESET";
import ACTION_APPOINTMENT_END_TIME_RESET from "../../actions/AppointmentEndTime/ACTION_APPOINTMENT_END_TIME_RESET";
import ACTION_BODY_SCROLL_RESET from "../../actions/Body_Scroll/ACTION_BODY_SCROLL_RESET";
import ACTION_BODY_SCROLL_ALLOW from "../../actions/Body_Scroll/ACTION_BODY_SCROLL_ALLOW";
import ACTION_PAYMENT_INFO_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_PAYMENT_INFO_PAGE_OPENED";
import ACTION_TOTAL_PRICE from "../../actions/TotalPrice/ACTION_TOTAL_PRICE";
import ACTION_SELECTED_ESTHETICIAN_RESET from "../../actions/SelectedEsthetician/ACTION_SELECTED_ESTHETICIAN_RESET";
import ACTION_FINAL_BOOKING_MODAL_ACTIVE from "../../actions/InCart/FinalBookingModal/ACTION_FINAL_BOOKING_MODAL_ACTIVE";
import ACTION_FINAL_BOOKING_MODAL_RESET from "../../actions/InCart/FinalBookingModal/ACTION_FINAL_BOOKING_MODAL_RESET";
import ACTION_CART_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_CART_PAGE_OPENED";
import ACTION_SELECTED_SALT_CAVE_DURATION_RESET from "../../actions/Treatments/SaltCave/SaltCaveDuration/ACTION_SELECTED_SALT_CAVE_DURATION_RESET";
import ACTION_DAY_OF_THE_WEEK_RESET from "../../actions/SelectedDay/DayOfTheWeek/ACTION_DAY_OF_THE_WEEK_RESET";
import ACTION_IS_STOREPAGE_NOT_ACTIVE from "../../actions/Stores/ACTION_IS_STOREPAGE_NOT_ACTIVE";
import "./ConfirmationPage.css";
import "../account/clientprofile/ConsentForm/ConsentForm.css";
import ACTION_TIME_PREFERENCE_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_TIME_PREFERENCE_PAGE_OPENED";
import ACTION_GUEST_CHECKOUT_FORM_PAGE_OPENED from "../../actions/InCart/CartPageOpened/ACTION_GUEST_CHECKOUT_FORM_PAGE_OPENED";
import ACTION_IS_ECOMMERCEPAGE_ACTIVE from "../../actions/Ecommerce/ACTION_IS_ECOMMERCEPAGE_ACTIVE";

const ConfirmationPage = (props) => {
  let location = useLocation();
  const dispatch = useDispatch();
  const counter = useSelector((state) => state.counterReducer.counter);
  const reformattedDay = useSelector(
    (state) => state.reformattedDay.reformattedDay
  );
  const dayOfTheWeek = useSelector((state) => state.dayOfTheWeek.dayOfTheWeek);
  const selectedTime = useSelector((state) => state.selectedTime.selectedTime);
  const appointmentEndTime = useSelector(
    (state) => state.appointmentEndTime.end_time
  );
  const addOnsArr = useSelector((state) => state.addOnsArr.add_ons_arr);
  const treatmentsArr = useSelector(
    (state) => state.treatmentsArr.treatments_arr
  );
  const totalPrice = useSelector((state) => state.totalPrice.totalPrice);
  // const totalDuration = useSelector(
  //   (state) => state.totalDuration.totalDuration
  // );
  const [totalDuration, setTotalDuration] = useState(15);
  const splashScreenComplete = useSelector(
    (state) => state.splashScreenComplete.splashScreenComplete
  );
  const consentFormAnythingChanged = useSelector(
    (state) => state.consentFormAnythingChanged.consent_form_anything_changed
  );
  const saltCaveInCart = useSelector((state) => state.saltCaveInCart.in_cart);
  const firstName = useSelector((state) => state.firstName.first_name);
  const lastName = useSelector((state) => state.lastName.last_name);
  const email = useSelector((state) => state.email.email);
  const phoneNumber = useSelector((state) => state.phoneNumber.phone_number);
  const appointmentNotes = useSelector(
    (state) => state.appointmentNotes.appointment_notes
  );
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );
  const finalBookButtonActive = useSelector(
    (state) => state.finalBookButton.final_book_button_active
  );
  const userAuthenticated = useSelector(
    (state) => state.userAuthenticated.user_authenticated
  );
  const selectedEsthetician = useSelector(
    (state) => state.selectedEsthetician.selectedEsthetician
  );
  const finalBookingModal = useSelector(
    (state) => state.finalBookingModal.final_booking_modal
  );
  const guestConsentFormAccessToken = useSelector(
    (state) => state.guestConsentFormAccessToken.access_token
  );

  const [getClient, { data }] = useLazyQuery(getClientQuery, {
    fetchPolicy: "no-cache",
  });

  const [addAppointment, { loading: appLoading, data: appointmentData }] = useMutation(
    addAppointmentMutation
  );

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
    if(appointmentData && !appLoading){
      if(appointmentData.addAppointment){
        const url = "https://meet.jit.si/" + appointmentData.addAppointment._id
        // tracardi
        var tracardiRequest = { 
          "client_email": variablesModel.email, 
          "client_firstname": variablesModel.firstName, 
          "client_lastname": variablesModel.lastName, 
          "staff_name": variablesModel.esthetician, 
          "vdc_date": variablesModel.date, 
          "vdc_time": variablesModel.startTime, 
          "vdc_url": url, 
        };

        window.tracker.track("add-videocall", {...tracardiRequest});
        window.tracker.track("add-appointment", {"appt-email": variablesModel.email});
      }
    }
  }, [appointmentData])

  const override = css`
    display: block;
    position: absolute;
    left: 25%;
    right: 25%;
  `;

  useEffect(() => {
    const addOnsPriceArr = addOnsArr.map((x) => x.price);
    const treatmentsPriceArr = treatmentsArr.map((x) => x.price);
    const allPricesArr = addOnsPriceArr.concat(treatmentsPriceArr);

    // const sum = allPricesArr.reduce((a, b) => a + b, 0);
    // for test;
    const sum = 30;

    if (sum !== totalPrice) {
      dispatch(ACTION_TOTAL_PRICE(sum));
    }
  }, [addOnsArr, dispatch, totalPrice, treatmentsArr]);

  const add15min = (time) => {
    let temp = time.split(":");
    temp[1] = Number(temp[1]) + 15;
    if(temp[1] >= 60) {
      temp[1] -= 60;
      temp[0] = Number(temp[0] + 1);
    }
    let result = temp.join(":");
    return result;
  }

  const variablesModel = {
    date: reformattedDay,
    startTime: selectedTime,
    morningOrEvening:
      Number(selectedTime.slice(0, 1)) > 1
        ? "PM"
        : Number(selectedTime.slice(0, 2)) < 12
        ? "AM"
        : "PM",
    endTime: add15min(selectedTime), // appointmentEndTime,
    duration: totalDuration,
    price: 0,
    esthetician: null, //selectedEsthetician,
    service: props.selectedServiceName,
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
      ? data
        ? data.client.firstName
        : firstName
      : firstName,
    lastName: userAuthenticated
      ? data
        ? data.client.lastName
        : lastName
      : lastName,
    email: userAuthenticated ? (data ? data.client.email : email) : email,
    phoneNumber: userAuthenticated
      ? data
        ? data.client.phoneNumber
        : phoneNumber
      : phoneNumber,
    notes: appointmentNotes,
    type: "instore",
    priority: 1,
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();

    if (!finalBookButtonActive) {
      dispatch(ACTION_FINAL_BOOK_BUTTON_ACTIVE());
    }

    // Instore Location Create Appointment
    addAppointment({
      variables: { ...variablesModel },
    });
    dispatch(ACTION_FINAL_BOOKING_MODAL_ACTIVE());
    dispatch(ACTION_IS_ECOMMERCEPAGE_ACTIVE());
  };

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

  useEffect(() => {
    if (location.pathname.includes("confirmation")) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const formatTotalDurationHour = useCallback(() => {
    let firstDigit = (totalDuration / 60).toString().split("");
    firstDigit = firstDigit[0];

    if (firstDigit === "0") {
      return null;
    } else {
      return firstDigit;
    }
  }, [totalDuration]);

  const formatTotalDurationMinutes = useCallback(() => {
    let minutes = "";
    let hours = (totalDuration / 60).toString().split("");
    hours = Number(hours[0]) * 60;
    minutes = (totalDuration - hours).toString();

    if (minutes === "0") {
      return null;
    } else {
      return minutes;
    }
  }, [totalDuration]);

  useEffect(() => {
    if (appLoading) {
      if (!loadingSpinnerActive) {
        dispatch(ACTION_LOADING_SPINNER_ACTIVE());
        dispatch(ACTION_BODY_SCROLL_RESET());
      }
    } else {
      const bookingComplete = setTimeout(() => {
        dispatch(ACTION_LOADING_SPINNER_RESET());
      }, 2000);
      return () => {
        clearTimeout(bookingComplete);
      };
    }
  }, [appLoading, dispatch, loadingSpinnerActive, finalBookingModal]);

  const handleModalBackToHome = () => {
    dispatch(ACTION_BODY_SCROLL_ALLOW());
    dispatch(ACTION_TOTAL_PRICE_RESET());
    dispatch(ACTION_TOTAL_DURATION_RESET());
    dispatch(ACTION_SELECT_TIME_NOT_ACTIVE());
    dispatch(ACTION_SELECTED_TIME_RESET());
    dispatch(ACTION_SELECTED_DAY_RESET());
    dispatch(ACTION_SELECTED_ESTHETICIAN_RESET());
    dispatch(ACTION_SELECTED_SALT_CAVE_DURATION_RESET());
    dispatch(ACTION_FINAL_BOOKING_MODAL_RESET());
    dispatch(ACTION_ALL_COLLAPSE_RESET());
    dispatch(ACTION_TREATMENTS_CART_RESET());
    dispatch(ACTION_ADD_ONS_CART_RESET());
    dispatch(ACTION_REFORMATTED_DAY_RESET());
    dispatch(ACTION_REFORMATTED_DAY_CLONE_RESET());
    dispatch(ACTION_DAY_OF_THE_WEEK_RESET());
    dispatch(ACTION_PHONE_NOT_VALID());
    dispatch(ACTION_PHONE_NOT_INVALID());
    dispatch(ACTION_APPOINTMENT_NOTES_RESET());
    dispatch(ACTION_EMAIL_RESET());
    dispatch(ACTION_FIRST_NAME_RESET());
    dispatch(ACTION_LAST_NAME_RESET());
    dispatch(ACTION_PHONE_NUMBER_RESET());
    dispatch(ACTION_FINAL_BOOK_BUTTON_RESET());
    dispatch(ACTION_EMAIL_NOT_INVALID());
    dispatch(ACTION_EMAIL_NOT_VALID());
    dispatch(ACTION_RESET_COUNTER());
    dispatch(ACTION_CONTINUE_BUTTON_RESET());
    dispatch(ACTION_BOOKING_SUMMARY_NOT_ACTIVE());
    dispatch(ACTION_CART_IS_NOT_ACTIVE());
    dispatch(ACTION_AVAILABILITY_RESET());
    dispatch(ACTION_APPOINTMENT_END_TIME_RESET());
    dispatch(ACTION_CART_PAGE_OPENED());
    dispatch(ACTION_IS_STOREPAGE_NOT_ACTIVE());

    props.changeSelectedStore(undefined);
    props.changeSelectedServiceName("");
  };

  return (
    <div className="confirmation_page_container">
      {redirectToHome()}
      <div className="confirmation_page_container_header">
        <Link
          to={() => {
            if (!props.currentScreenSize) {
              if (props.initialScreenSize >= 1200) {
                return "/";
              } else {
                if (userAuthenticated) {
                  // return "/paymentinfo";
                  return "/availability/timepreference";
                } else {
                  return "/checkout";
                }
              }
            } else {
              if (props.currentScreenSize >= 1200) {
                return "/";
              } else {
                if (userAuthenticated) {
                  // return "/paymentinfo";
                  return "/availability/timepreference";
                } else {
                  return "/checkout";
                }
              }
            }
          }}
          onClick={() => {
            if (userAuthenticated) {
              dispatch(ACTION_TIME_PREFERENCE_PAGE_OPENED())
            } else {
              dispatch(ACTION_GUEST_CHECKOUT_FORM_PAGE_OPENED());
            }
          }}
        >
          <FontAwesomeIcon
            className="confirmation_page_back_arrow"
            icon={faChevronLeft}
          />
        </Link>
        <h1>REVIEW DETAILS</h1>
      </div>
      <div className="confirmation_page_header">
        <h2>BOOKING SUMMARY</h2>
      </div>
      <p className="confirmation_page_statement">
        Almost there! Please make sure that the following booking information is
        correct.
      </p>
      <div className="summary_client_contact_info_container">
        <FontAwesomeIcon
          className="summary_calendar_icon"
          icon={faAddressBook}
        />
        {userAuthenticated && data ? (
          <div className="summary_client_contact_info_text_container">
            <p>{data.client.firstName + " " + data.client.lastName}</p>
            <p>{data.client.phoneNumber}</p>
            <p>{data.client.email}</p>
          </div>
        ) : (
          <div className="summary_client_contact_info_text_container">
            <p>{firstName + " " + lastName}</p>
            <p>{phoneNumber}</p>
            <p>{email}</p>
          </div>
        )}
      </div>
      <div className="summary_selected_date_container">
        <FontAwesomeIcon className="summary_calendar_icon" icon={faCalendar} />
        <p>
          {dayOfTheWeek}, {reformattedDay}
        </p>
      </div>
      <div className="summary_selected_time_container">
        <FontAwesomeIcon className="summary_clock_icon" icon={faClock} />
        <p>
          {selectedTime}{" "}
          {Number(selectedTime.slice(0, 1)) > 1
            ? "PM"
            : Number(selectedTime.slice(0, 2)) < 12
            ? "AM"
            : "PM"}{" "}
          - {add15min(selectedTime)}{" "}
          {Number(add15min(selectedTime).slice(0, 1)) > 1
            ? "PM"
            : Number(add15min(selectedTime).slice(0, 2)) < 12
            ? "AM"
            : "PM"}{" "}
          ({formatTotalDurationHour()}
          {totalDuration / 60 >= 1 ? " " : null}
          {totalDuration / 60 >= 1
            ? totalDuration / 60 < 2
              ? "hour"
              : "hours"
            : null}
          {totalDuration / 60 >= 1
            ? Number.isInteger(totalDuration / 60)
              ? null
              : " "
            : null}
          {formatTotalDurationMinutes()}
          {Number.isInteger(totalDuration / 60) ? null : " "}
          {Number.isInteger(totalDuration / 60) ? null : "minutes"})
        </p>
      </div>
      <div className="summary_facial_container">
        <h2 className="summary_facial_container_title">
          {" " + props.selectedStore.name }
        </h2>
      </div>
      <div className="confirmation_page_statement">
        <div>
          <span>Address:</span>
          <span>{props.selectedStore.address}</span>
          <p>{props.selectedStore.city}, {props.selectedStore.country}</p>
        </div>
        <div>
          <span>Tel:</span>
          <span>{props.selectedStore.phone}</span>
        </div>
      </div>
      <Link
        to={
          props.currentScreenSize
            ? props.initialScreenSize >= 1200
              ? "/"
              : "/checkout/confirmation"
            : props.currentScreenSize >= 1200
            ? "/"
            : "/checkout/confirmation"
        }
      >
        <div className="book_appointment_button" onClick={handleSubmitBooking}>
          <p>Book Appointment</p>
        </div>
      </Link>
      <Modal
        isOpen={finalBookButtonActive}
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
                onClick={handleModalBackToHome}
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
                ? data
                  ? data.client.firstName
                  : firstName
                : firstName}
              , your appointment with the store {props.selectedStore.name} has been confirmed.
            </p>
            <div className="modal_date_time_container">
              <div className="modal_bold_details_container">
                <p className="modal_appointment_time">
                  {selectedTime}{" "}
                  {Number(selectedTime.slice(0, 1)) > 1
                    ? "PM"
                    : Number(selectedTime.slice(0, 2)) < 12
                    ? "AM"
                    : "PM"}
                </p>
                <p className="modal_appointment_spacer">|</p>
                <p className="modal_appointment_provider">CHOIREDEX</p>
              </div>
              <div className="modal_bottom_info_container">
                <p className="modal_full_date_info">
                  {dayOfTheWeek.toUpperCase()}, {reformattedDay.toUpperCase()}
                </p>
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

export default ConfirmationPage;
