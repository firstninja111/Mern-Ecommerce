import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { IoMdNotificationsOff } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";
import UpcomingAppointmentNotification from "./UpcomingAppointmentNotification";
import AdminAddWaitingUser from "./AdminAddWaitingUser";
import AdminSelectedNotification from "./AdminSelectedNotification";
import { css } from "@emotion/css";
import ACTION_ON_UPCOMING_PAGE from "../../../actions/Admin/OnUpcomingPage/ACTION_ON_UPCOMING_PAGE";
import "./AdminUpcomingNotifications.css";

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
  const adminNotifications = useSelector(
    (state) => state.adminNotifications.notifications
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

  const handleAppointClicked = (e, appointment) => {
    // Agent Can not view detail in upcoming list.
    if(!getEmployeeData || !getEmployeeData.employee || !getEmployeeData.employee.employeeRole || getEmployeeData.employee.employeeRole.includes("Staff")) { 
      return;
    }   

    changeAddWaitingUserClicked(true)
    changeSelectedAppointment(appointment)
    changeMode("edit");
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

  useEffect(() => {
    dispatch(ACTION_ON_UPCOMING_PAGE());
  }, [dispatch]);

  const renderNoNotifications = () => {
    return (
      <div className="my_upcoming_appointments_empty_container">
        <IoMdNotificationsOff className="my_upcoming_appointments_empty_calendar_icon" />
        <h2>No appointment</h2>
        <p>You have no upcoming appointment to show.</p>
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
        {!addWaitingUserClicked && !clickedNotification && <h1>UPCOMING APPOINTMENTS</h1>}
        {addWaitingUserClicked && <h1>Appointment Detail</h1>}
        {clickedNotification && <h1>Meeting Information</h1>}
      </div>
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
            <p>Appointment Time</p>
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
              if((!getEmployeeData || !getEmployeeData.employee || !getEmployeeData.employee.employeeRole || getEmployeeData.employee.employeeRole.includes("Admin"))  && e.status == "scheduled") { 
                return true;
              }
              if(e.store._id === getEmployeeData.employee.store._id && e.status == "scheduled") {
                return true;
              }
              return false;
            }).length > 0 ?
              getAllAppointmentsData.all_appointments.filter((e) => {
                if((!getEmployeeData || !getEmployeeData.employee || !getEmployeeData.employee.employeeRole || getEmployeeData.employee.employeeRole.includes("Admin"))  && e.status == "scheduled") { 
                  return true;
                }
                if(e.store._id === getEmployeeData.employee.store._id && e.status == "scheduled") {
                  return true;
                }
                return false;
              })
              .sort((a, b) => {
                var timeNow = Date.now();
                var timeA = a.date ? new Date("" + a.date + " " + a.startTime).getTime() : a.createdAt;
                var timeB = b.date ? new Date("" + b.date + " " + b.startTime).getTime() : b.createdAt;
                return (a.priority - b.priority) || (Math.abs(timeNow-timeA) - Math.abs(timeNow-timeB))
              })
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
                      <p>{`${appointment.date} ${appointment.startTime}`}</p>
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
      {/* <div
        className="admin_notifications_content_container"
        style={{ 
          display: getEmployeeLoading ? "flex" : "block",
          height: "100%",
          overflow: "auto",
        }}
      >
        {!getEmployeeData ? (
          <ClipLoader
            size={100}
            css={override}
            color={"rgb(44, 44, 52)"}
            loading={getEmployeeLoading}
          />
        ) : adminNotifications && getAllAppointmentsData ? (
          adminNotifications.length > 0 ? (
            getAllAppointmentsData.all_appointments ? (
              adminNotifications
                .filter((e) => {
                  let appointment = getAllAppointmentsData.all_appointments.filter(
                    (item) => {
                      return item._id === e.meetingId;
                    }
                  );
                  if (appointment.length) {
                    var timeNow = Date.now();
                    var startTime = appointment[0].date 
                      ? new Date("" + appointment[0].date + " " + appointment[0].startTime + " " + appointment[0].morningOrEvening).getTime()
                      : timeNow;
                    var createdTime = appointment[0].createdAt;
                    if(appointment[0].date) {
                      return !appointment[0].isProcessed  && (startTime - timeNow + 3600000) >= 0; // remove past appointment (over 1 hour) 
                    } else {
                      return !appointment[0].isProcessed  && (createdTime - timeNow + 5 * 3600000) >= 0; // remove past
                    }
                  } else {
                    return false
                  }
                })
                .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                .sort((a, b) => ("" + b.isStoreSchedule).localeCompare("" + a.isStoreSchedule))
                .sort((a, b) => {
                  var timeNow = Date.now();
                  var timeA = a.date ? new Date("" + a.date + " " + a.time).getTime() : timeNow + 3600000;
                  var timeB = b.date ? new Date("" + b.date + " " + b.time).getTime() : timeNow + 3600000;
                  return Math.abs(timeNow-timeA) - Math.abs(timeNow-timeB); // 36000000: 1 hour
                })
                .map((notification, i) => {
                  if (notification.type === "bookAppointment") {
                    return (
                      <UpcomingAppointmentNotification
                        key={i}
                        notification={notification}
                        employee={getEmployeeData.employee}
                        changeClickedNotification={changeClickedNotification}
                        getAllAppointmentsData={getAllAppointmentsData}
                      />
                    );
                  } else {
                    return null;
                  }
                })
            ) : null
          ) : (
            renderNoNotifications()
          )
        ) : (
          renderNoNotifications()
        )}
      </div> */}
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
      {clickedNotification ? 
        <AdminSelectedNotification
          employeeDataRefetch={employeeDataRefetch}
          getEmployeeData={getEmployeeData ? getEmployeeData : null}
          getEmployeeLoading={getEmployeeLoading}
          getEmployeeError={getEmployeeError}
          getAllAppointmentsData={getAllAppointmentsData}
          getAllAppointmentsRefetch={getAllAppointmentsRefetch}
          clickedNotification={clickedNotification}
          changeClickedNotification={changeClickedNotification}
        />
      : null}
      {getEmployeeData ? (
          getEmployeeData.employee && !getEmployeeData.employee.employeeRole.includes("Staff") ? (
            <div
              className="add_staff_member_button_container"
              style={{
                zIndex: clickedNotification
                  ? logoutClicked ||
                    loadingSpinnerActive ||
                    addWaitingUserClicked ||
                    clickedNotification
                    ? -1
                    : 0
                  : addWaitingUserClicked
                  ? -1
                  : logoutClicked ||
                    loadingSpinnerActive ||
                    addWaitingUserClicked
                  ? 0
                  : 5,
              }}
            >
              <div
                className="add_staff_member_button"
                onClick={() => {
                  changeAddWaitingUserClicked(true);
                  changeMode("create");
                }}
              >
                Create and check-in new appointment
              </div>
            </div>
          ) : null
        ) : null}
    </div>
  );
};

export default AdminUpcomingNotifications;
