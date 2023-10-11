import React, { useEffect, useCallback } from "react";
import { Transition } from "react-spring/renderprops";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import ACTION_CANCEL_APPOINTMENT_CLICKED from "../../../actions/CancelAppointmentClicked/ACTION_CANCEL_APPOINTMENT_CLICKED";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/css";
import { useMutation } from "@apollo/react-hooks";
import deleteAppointmentMutation from "../../../graphql/mutations/deleteAppointmentMutation";
import processAppointmentMutation from "../../../graphql/mutations/processAppointmentMutation"
import confirmAppointmentMutation from "../../../graphql/mutations/confirmAppointmentMutation"
import ACTION_LOADING_SPINNER_RESET from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import ACTION_LOADING_SPINNER_ACTIVE from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import ACTION_CANCEL_APPOINTMENT_CLICKED_RESET from "../../../actions/CancelAppointmentClicked/ACTION_CANCEL_APPOINTMENT_CLICKED_RESET";

const AdminSelectedNotification = (props) => {
  const {
    getEmployeeData,
    getEmployeeLoading,
    getEmployeeError,
    employeeDataRefetch,
    getAllAppointmentsData,
    getAllAppointmentsRefetch,
    clickedNotification,
    changeClickedNotification
  } = props;


  const [deleteAppointment, { loading, data }] = useMutation(
    deleteAppointmentMutation
  );

  const [
    processAppointment,
    { loading: processAppointmentLoading, data: processAppointmentData },
  ] = useMutation(processAppointmentMutation);

  const [
    confirmAppointment,
    { loading: confirmAppointmentLoading, data: confirmAppointmentData },
  ] = useMutation(confirmAppointmentMutation);

  const dispatch = useDispatch();

  const cancelAppointmentClicked = useSelector(
    (state) => state.cancelAppointmentClicked.cancelAppointmentClicked
  );
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );

  const override = css`
    display: block;
    position: absolute;
    left: 25%;
    right: 25%;
  `;

  const handleCancelAppointment = (id) => {
    deleteAppointment({
      variables: { _id: id },
    });
    getAllAppointmentsRefetch();
    setTimeout(() => {
      resetStatesAfterLoading()
    }, 2000)
  };

  const handleJoinMeeting = () => {
    confirmAppointment({
      variables: {
        _id: clickedNotification.meetingId,
      }
    })

  }

  const handleEndMeeting = () => {
    processAppointment({
      variables: {
        _id: clickedNotification.meetingId,
      }
    })
    changeClickedNotification("");
    employeeDataRefetch();
    getAllAppointmentsRefetch();
  }

  const resetStatesAfterLoading = useCallback(() => {
    getAllAppointmentsRefetch();
    dispatch(ACTION_LOADING_SPINNER_RESET());
    dispatch(ACTION_CANCEL_APPOINTMENT_CLICKED_RESET());
    changeClickedNotification("");
  }, [dispatch, getAllAppointmentsRefetch]);

  useEffect(() => {
    if (getEmployeeError) {
      employeeDataRefetch();
    }
  }, [getEmployeeError, employeeDataRefetch]);
  
  useEffect(() => {
    if (data) {
      const loadingFunction = setTimeout(() => resetStatesAfterLoading(), 2000);
      return () => {
        clearTimeout(loadingFunction);
      };
    }
  }, [data, resetStatesAfterLoading]);

  useEffect(() => {
    if (loading) {
      dispatch(ACTION_LOADING_SPINNER_ACTIVE());
    }
  }, [loading, data, dispatch]);

  return (
    <Transition
      items={clickedNotification}
      from={{ transform: "translateX(-100%)" }}
      enter={{ transform: "translateX(0%)" }}
      leave={{ transform: "translateX(-100%)" }}
      config={{ duration: 200 }}
    >
      {(clickedNotification) =>
        clickedNotification.meetingId ===
          (getAllAppointmentsData
            ? getAllAppointmentsData.all_appointments.find(
                (x) => x._id === clickedNotification.meetingId
              )
              ? getAllAppointmentsData.all_appointments.find(
                  (x) => x._id === clickedNotification.meetingId
                )._id
              : null
            : null) &&
        ((styleprops) => {
          return (
            <div
              className="admin_side_schedule_calendar_individual_selected_appointment_container"
              style={styleprops}
            >
              <Modal
                isOpen={
                  cancelAppointmentClicked &&
                  clickedNotification.meetingId ===
                    (getAllAppointmentsData.all_appointments.filter(
                      (x) => x._id === clickedNotification.meetingId
                    )[0]
                      ? getAllAppointmentsData.all_appointments.filter(
                          (x) => x._id === clickedNotification.meetingId
                        )[0]._id
                      : null)
                }
                className="cancel_appointment_modal"
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
                <div
                  className="cancel_appointment_modal_content_container"
                  style={{ display: loadingSpinnerActive ? "none" : "flex" }}
                >
                  <div className="log_out_modal_contents admin_cancel_appointment">
                    <FontAwesomeIcon
                      className="modal_x"
                      icon={faTimes}
                      onClick={() =>
                        dispatch(ACTION_CANCEL_APPOINTMENT_CLICKED_RESET())
                      }
                    />
                    <h2>
                      Are you sure you want to cancel{" "}
                      {getAllAppointmentsData.all_appointments.filter(
                        (x) => x._id === clickedNotification.meetingId
                      )[0]
                        ? getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.firstName[0].toUpperCase() +
                          getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.firstName.slice(1)
                            .toLowerCase() +
                          " " +
                          getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.lastName[0].toUpperCase() +
                          getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.lastName.slice(1)
                            .toLowerCase() +
                          "'s "
                        : null}
                      appointment?
                    </h2>
                    <span className="logout_buttons_container">
                      <div
                        className="logout_button yes_cancel_appointment_button"
                        onClick={() =>
                          handleCancelAppointment(clickedNotification.meetingId)
                        }
                      >
                        <p>YES, CANCEL</p>
                      </div>
                      <div
                        className="cancel_logout_button no_dont_cancel_appointment_button"
                        onClick={() =>
                          dispatch(ACTION_CANCEL_APPOINTMENT_CLICKED_RESET())
                        }
                      >
                        <p>NO, GO BACK</p>
                      </div>
                    </span>
                  </div>
                </div>
              </Modal>
              <div className="my_individual_selected_appointment_contents_container">
                <div
                  className="my_individual_selected_appointment_back_container"
                  onClick={() => changeClickedNotification("")}
                >
                  <FontAwesomeIcon
                    icon={faLongArrowAltLeft}
                    className="my_individual_selected_appointment_back_arrow_icon"
                  />
                  <p>Back to the Upcoming Appointments </p>
                </div>
                <div className="selected_appointment_date_and_time_header">
                  <p>Client Information</p>
                </div>
                <div className="selected_appointment_date_and_time_content_container">
                  <div className="selected_appointment_date_and_time_content">
                    <p>
                      {getAllAppointmentsData.all_appointments.filter(
                        (x) => x._id === clickedNotification.meetingId
                      )[0]
                        ? getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.firstName[0].toUpperCase() +
                          getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.firstName.slice(1)
                            .toLowerCase() +
                          " " +
                          getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.lastName[0].toUpperCase() +
                          getAllAppointmentsData.all_appointments
                            .filter(
                              (x) => x._id === clickedNotification.meetingId
                            )[0]
                            .client.lastName.slice(1)
                            .toLowerCase()
                        : null}
                    </p>
                    <p>
                      {" "}
                      {getAllAppointmentsData.all_appointments.filter(
                        (x) => x._id === clickedNotification.meetingId
                      )[0]
                        ? getAllAppointmentsData.all_appointments.filter(
                            (x) => x._id === clickedNotification.meetingId
                          )[0].client.phoneNumber
                        : null}
                    </p>
                    <p>
                      {" "}
                      {getAllAppointmentsData.all_appointments.filter(
                        (x) => x._id === clickedNotification.meetingId
                      )[0]
                        ? getAllAppointmentsData.all_appointments.filter(
                            (x) => x._id === clickedNotification.meetingId
                          )[0].client.email
                        : null}
                    </p>
                  </div>
                </div>
                 
                <div className="selected_appointment_date_and_time_header">
                  <p>Appointment Date &amp; Time</p>
                </div>
                <div className="selected_appointment_date_and_time_content_container">
                  {clickedNotification.date 
                  ? 
                    <div className="selected_appointment_date_and_time_content">
                      <p>
                        {moment(
                          getAllAppointmentsData.all_appointments.filter(
                            (x) => x._id === clickedNotification.meetingId
                          )[0].date,
                          "LL"
                        )
                          .format("LLLL")
                          .split(" ")
                          .slice(
                            0,
                            moment(
                              getAllAppointmentsData.all_appointments.filter(
                                (x) => x._id === clickedNotification.meetingId
                              )[0].date,
                              "LL"
                            )
                              .format("LLLL")
                              .split(" ").length - 2
                          )
                          .join(" ")}
                      </p>
                      <p>
                        {getAllAppointmentsData.all_appointments.filter(
                          (x) => x._id === clickedNotification.meetingId
                        )[0].startTime +
                          " " +
                          (Number(
                            getAllAppointmentsData.all_appointments
                              .filter(
                                (x) => x._id === clickedNotification.meetingId
                              )[0]
                              .startTime.split(":")[0]
                          ) >= 12 ||
                          Number(
                            getAllAppointmentsData.all_appointments
                              .filter(
                                (x) => x._id === clickedNotification.meetingId
                              )[0]
                              .startTime.split(":")[0]
                          ) < 9
                            ? "PM"
                            : "AM")}{" "}
                        -{" "}
                        {getAllAppointmentsData.all_appointments.filter(
                          (x) => x._id === clickedNotification.meetingId
                        )[0].endTime +
                          " " +
                          (Number(
                            getAllAppointmentsData.all_appointments
                              .filter(
                                (x) => x._id === clickedNotification.meetingId
                              )[0]
                              .endTime.split(":")[0]
                          ) >= 12 ||
                          Number(
                            getAllAppointmentsData.all_appointments
                              .filter(
                                (x) => x._id === clickedNotification.meetingId
                              )[0]
                              .endTime.split(":")[0]
                          ) < 9
                            ? "PM"
                            : "AM")}{" "}
                      </p>
                    </div>
                  : <div className="selected_appointment_date_and_time_content">
                      <p>Client is waiting now.</p>
                    </div>
                }
                </div>
                <div 
                  className="selected_appointments_bottom_buttons_container"
                  onClick={handleJoinMeeting}
                  style={{
                    height: "12px"
                  }}
                >
                  <a 
                    className="cancel_appointment_button meeting_link_button width_45p"
                    href={`https://meet.jit.si/${getAllAppointmentsData.all_appointments.filter( (x) => x._id === clickedNotification.meetingId)[0]._id}`} target="_blank"
                  >
                    Join
                  </a>
                  <div
                    className="cancel_appointment_button meeting_link_button width_45p"
                    onClick={handleEndMeeting}
                  >
                    End
                  </div>
                </div>
                <div className="selected_appointment_total_header admin_side_total_header">
                  <p>Store</p>
                  <p>
                    {
                      getAllAppointmentsData.all_appointments.filter(
                        (x) => x._id === clickedNotification.meetingId
                      )[0].store.name
                    }
                  </p>
                </div>
                <div className="selected_appointment_date_and_time_header">
                  <p>Notes</p>
                </div>
                <div className="selected_appointment_date_and_time_content_container">
                  <div className="selected_appointment_date_and_time_content">
                    <p>
                      {" "}
                      {getAllAppointmentsData.all_appointments.filter(
                        (x) => x._id === clickedNotification.meetingId
                      )[0].notes
                        ? getAllAppointmentsData.all_appointments.filter(
                            (x) => x._id === clickedNotification.meetingId
                          )[0].notes
                        : "No notes provided"}
                    </p>
                  </div>
                </div>
                <div 
                  className="selected_appointments_bottom_buttons_container"
                  style={{
                    height: "auto !important",
                  }}
                >
                  {/* {moment(
                    getAllAppointmentsData.all_appointments.filter(
                      (x) => x._id === clickedNotification.meetingId
                    )[0].date,
                    "MMMM D, YYYY"
                  ).isAfter(moment()) ? ( */}
                    <div
                      className="cancel_appointment_button width_45p"
                      onClick={() => {
                        dispatch(ACTION_CANCEL_APPOINTMENT_CLICKED())  
                      }}
                    >
                      Cancel Appointment
                    </div>
                  {/* ) : null} */}
                  <div
                    className="cancel_appointment_button width_45p"
                    onClick={() => changeClickedNotification("")}
                    style={{
                      background: "white",
                      color: "black",
                      border: "1px solid black"
                    }}
                  >
                    Back
                  </div>
                </div>
              </div>
            </div>
          );
        })
      }
    </Transition>
  );
};

export default AdminSelectedNotification;
