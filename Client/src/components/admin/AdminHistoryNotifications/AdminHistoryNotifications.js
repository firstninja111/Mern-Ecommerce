import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { IoMdNotificationsOff } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
// import UpcomingAppointmentNotification from "./UpcomingAppointmentNotification";
// import AdminAddWaitingUser from "./AdminAddWaitingUser";
// import AdminSelectedNotification from "./AdminSelectedNotification";
import { css } from "@emotion/css";
import "./AdminHistoryNotifications.css";

const AdminHistoryNotifications = (props) => {
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

  const timer = useRef(null);

  const [selectedAppointement, changeSelectedAppointment] = useState(null);
  const [addWaitingUserClicked, changeAddWaitingUserClicked] = useState(false);
  const [mode, changeMode] = useState("create");
  const [clickedNotification, changeClickedNotification] = useState("");

  const redirectToAdminLogInPage = () => {
    if (!adminAuthenticated) {
      return <Redirect to="/admin" />;
    }
  };

  const handleApppointClicked = (e, appointment) => {
    // changeAddWaitingUserClicked(true)
    // changeSelectedAppointment(appointment)
    // changeMode("edit");
  }

  useEffect(() => {
    if (getEmployeeError) {
      employeeDataRefetch();
    }
  }, [getEmployeeError, employeeDataRefetch]);

  useEffect(() => {
    if (location.pathname.includes("upcoming")) {
      timer.current = setInterval(() => {
        employeeDataRefetch();
        getAllAppointmentsRefetch();
      }, 5000);
    }
    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, []);

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
        <h2>No notifications</h2>
        <p>You have no notifications to show.</p>
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
    <div className="admin_notifications_container">
      {redirectToAdminLogInPage()}{" "}
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
        {!addWaitingUserClicked && !clickedNotification && <h1>History</h1>}
        {addWaitingUserClicked && <h1>Appointment Detail</h1>}
        {clickedNotification && <h1>Meeting Information</h1>}
      </div>
      <div className="admin_clients_content_container">
        <div className="admin_individual_client_container admin_list_header">
          <div className="admin_individual_client_full_name">
            <p>Name</p>
            <p>First Name</p>
            <p>Email</p>
            <p>Phone Number</p>
            <p>Appointment Creation</p>
            <p>Appointment</p>
            <p>Check in</p>
            <p>Meeting Start</p>
            <p>Meeting End</p>
            <p>Wait Time</p>
            <p>Service Time</p>
            <p>Store</p>
            <p>Location</p>
            <p>Service</p>
            <p>Agent</p>
          </div>
        </div>
        <div 
          className="admin_individual_client_container"
          key={2}
        >
          <div className="admin_individual_client_full_name">
            <p>Einstein</p>
            <p>Albert</p>
            <p>Albert@relative.com</p>
            <p>514-296-2555</p>
            <p>2023-01-25 09:01</p>
            <p>2023-01-26 12:25</p>
            <p>2023-01-26 12:40</p>
            <p>2023-01-26 12:50</p>
            <p>2023-01-26 12:55</p>
            <p>2</p>
            <p>32</p>
            <p>Chateauguay</p>
            <p>Instore</p>
            <p>Internet</p>
            <p>Robespierre</p>
          </div>
          <span className="admin_individual_client_spacer"></span>
        </div>
        {/* {
          !getEmployeeData ? (
            <ClipLoader
              size={100}
              css={override}
              color={"rgb(44, 44, 52)"}
              loading={getEmployeeLoading}
            />
          ) : getAllAppointmentsData ? (
            getAllAppointmentsData.all_appointments.filter((e) => {
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
                    onClick={(e) => handleApppointClicked(e, appointment)}
                  >
                    <div className="admin_individual_client_full_name">
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
              })
          ) : (
            renderNoNotifications()
          )
        } */}
      </div>
    </div>
  );
};

export default AdminHistoryNotifications;
