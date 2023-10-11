import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { IoMdNotificationsOff } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
import { useMutation } from "@apollo/react-hooks"; 
import updateAppointmentMutation from "../../../graphql/mutations/updateAppointmentMutation";
import AdminAddWaitingUser from "./AdminAddWaitingUser";
import { css } from "@emotion/css";
import ACTION_ON_CHECKEDIN_UPDATE_RESET from "../../../actions/Admin/OnCheckedInPage/ACTION_ON_CHECKEDIN_PAGE_RESET";
import ACTION_ON_MEETING_PAGE from "../../../actions/Admin/OnCheckedInPage/ACTION_ON_MEETING_PAGE";
import ACTION_ON_MEETING_PAGE_RESET from "../../../actions/Admin/OnCheckedInPage/ACTION_ON_MEETING_PAGE_RESET";

import "./AdminCheckedInNotifications.css";

const AdminUpcomingNotifications = (props) => {
  const {
    getEmployeeData,
    getEmployeeLoading,
    getEmployeeError,
    employeeDataRefetch,
    getAllAppointmentsData,
    getAllAppointmentsRefetch,
    getClientsData,
    randomColorArray,
    getAllStoresData,
    getAllServicesData,
  } = props;
  const dispatch = useDispatch();

  const adminAuthenticated = useSelector(
    (state) => state.adminAuthenticated.admin_authenticated
  );
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );
  const logoutClicked = useSelector(
    (state) => state.logoutClicked.log_out_clicked
  );
  const on_checkedin_update = useSelector(
    (state) => state.on_checkedin_update
  )
  const checkedInState = useSelector(
    (state) => state.on_meeting_page
  )

  const timer = useRef(null);

  const [selectedAppointement, changeSelectedAppointment] = useState(null);
  const [addWaitingUserClicked, changeAddWaitingUserClicked] = useState(false);
  const [mode, changeMode] = useState("create");
  const [clickedNotification, changeClickedNotification] = useState("");
  const [updateAppointment, {loadingCheckIn, dataCheckIn}] = useMutation(
    updateAppointmentMutation
  );

  const redirectToAdminLogInPage = () => {
    if (!adminAuthenticated) {
      return <Redirect to="/admin" />;
    }
  };

  // Once the agent clicks the row, it will go to in-progress status automatically.
  const handleAppointClicked = async(e, appointment) => {
    // Concierge Can not view detail in checked-in list.
    if(!getEmployeeData || !getEmployeeData.employee || !getEmployeeData.employee.employeeRole || getEmployeeData.employee.employeeRole.includes("Concierge")) { 
      return;
    }    

    await updateAppointment({
      variables: {
        _id: appointment._id,
        status: "in-progress",
      }
    }).then(()=>{
      changeSelectedAppointment(appointment)
      changeMode("edit");
      changeAddWaitingUserClicked(true)
      dispatch(ACTION_ON_MEETING_PAGE());
    })
  }

  // Update Employee data.
  useEffect(() => {
    if (getEmployeeError) {
      employeeDataRefetch();
    }
  }, [getEmployeeError, employeeDataRefetch]);

  // Refetch appointments once get received ON_CHECKEDIN_UPDATE action.
  useEffect(() => {
    if(on_checkedin_update.on_checkedin_update) {
      getAllAppointmentsRefetch()      
      dispatch(ACTION_ON_CHECKEDIN_UPDATE_RESET());
    }
  }, [on_checkedin_update])

  // Format date and time for European.
  const formatDateTime = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const formatMonth = (month > 9 ? "" : "0") + month;
    const date = dateObj.getDate();
    const formatDate = (date > 9 ? "" : "0") + date;

    const hour = dateObj.getHours();
    const formatHour = (hour > 9 ? "" : "0") + hour;
    const minute = dateObj.getMinutes();
    const formatMinute = (minute > 9 ? "" : "0") + minute;

    return year + "-" + formatMonth + "-" + formatDate + ", " + formatHour + ":" + formatMinute;
  }

  const renderNoNotifications = () => {
    return (
      <div className="my_upcoming_appointments_empty_container">
        <IoMdNotificationsOff className="my_upcoming_appointments_empty_calendar_icon" />
        <h2>No appointment</h2>
        <p>You have no checked-in appointment to show.</p>
      </div>
    );
  };

  const override = css`
    display: block;
    position: absolute;
    left: 25%;
    right: 25%;
  `;

  return (
    <div className= {`admin_notifications_container ${checkedInState.on_meeting_page ? "wide" : ""}`}>
      {redirectToAdminLogInPage()}{" "}
      {
        !checkedInState.on_meeting_page &&
          <div
            className="admin_notifications_header"
            style={{
              zIndex: logoutClicked || loadingSpinnerActive ? 0 : 5,
            }}
          >
            <Link to="/admin/menu">
              <FontAwesomeIcon
                className="admin_notifications_back_arrow"
                icon={faChevronLeft}
              />
            </Link>
            {!addWaitingUserClicked && !clickedNotification && <h1>Checked in</h1>}
            {addWaitingUserClicked && <h1>Appointment Detail</h1>}
            {clickedNotification && <h1>Meeting Information</h1>}
          </div>
      }
      
      <div className="admin_clients_content_container">
        <div className="admin_individual_client_container admin_list_header">
          <div className="admin_individual_client_full_name">
            {
              getEmployeeData && getEmployeeData.employee && getEmployeeData.employee.employeeRole && getEmployeeData.employee.employeeRole.includes("Admin") &&
              <p>Store</p>
            }
            <p>Name</p>
            <p>First Name</p>
            <p>Service</p>
            <p>Check-in Time</p>
            <p>Priority</p>
            <p>Location</p>
          </div>
        </div>
        {
          !getEmployeeData ? (
            <ClipLoader
              size={100}
              css={override}
              color={"rgb(44, 44, 52)"}
              loading={getEmployeeLoading}
            />
          ) : getAllAppointmentsData ? (
            getAllAppointmentsData.all_appointments.filter((e) => {
              if((!getEmployeeData || !getEmployeeData.employee || !getEmployeeData.employee.employeeRole || getEmployeeData.employee.employeeRole.includes("Admin")) && e.status == "checked-in") { 
                return true;
              }
              if(e.store._id === getEmployeeData.employee.store._id && e.status == "checked-in") {
                return true;
              }
              return false;
            }).length > 0 ? 
              getAllAppointmentsData.all_appointments.filter((e) => {
                if((!getEmployeeData || !getEmployeeData.employee || !getEmployeeData.employee.employeeRole || getEmployeeData.employee.employeeRole.includes("Admin")) && e.status == "checked-in") { 
                  return true;
                }
                if(e.store._id === getEmployeeData.employee.store._id && e.status == "checked-in") {
                  return true;
                }
                return false;
              })
              .sort((a, b) => (a.priority - b.priority) || (a.checkedInDateTime.localeCompare(b.checkedInDateTime)))
              .map((appointment, i) => {
                return (
                  <div 
                    className="admin_individual_client_container"
                    key={i}
                    onClick={(e) => handleAppointClicked(e, appointment)}
                  >
                    <div className="admin_individual_client_full_name">
                      {
                        getEmployeeData && getEmployeeData.employee && getEmployeeData.employee.employeeRole && getEmployeeData.employee.employeeRole.includes("Admin") &&
                        <p>{appointment.store.name}</p>
                      }
                      <p>{appointment.client.lastName}</p>
                      <p>{appointment.client.firstName}</p>
                      <p>{appointment.service}</p>
                      <p>{formatDateTime(new Date(Number(appointment.checkedInDateTime)))}</p>
                      <p className="priority">{appointment.priority}</p>
                      <p>{appointment.type}</p>
                    </div>
                    <span className="admin_individual_client_spacer"></span>
                  </div>
                )
              }) : (
                renderNoNotifications()
              )
          ) : (
            renderNoNotifications()
          )
        }
      </div>
      {addWaitingUserClicked ? (
        <AdminAddWaitingUser
          getEmployeeData={getEmployeeData}
          getClientsData={getClientsData}
          getAllStoresData={getAllStoresData}
          getAllServicesData={getAllServicesData}
          addWaitingUserClicked={addWaitingUserClicked}
          changeAddWaitingUserClicked={
            changeAddWaitingUserClicked
          }
          changeSelectedAppointment={
            changeSelectedAppointment
          }
          getAllAppointmentsRefetch={getAllAppointmentsRefetch}
          randomColorArray={randomColorArray}
          selectedAppointement={selectedAppointement}
          mode={mode}
        />
      ) : null}
    </div>
  );
};

export default AdminUpcomingNotifications;
