import React from "react";
import { BiCalendarPlus } from "react-icons/bi";
import { IoMdTime } from "react-icons/io";
import { format } from "timeago.js";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import confirmAppointmentMutation from "../../../graphql/mutations/confirmAppointmentMutation"

const AdminUpcomingNotifications = (props) => {
  const { 
    notification,
    employee,
    changeClickedNotification,
    getAllAppointmentsData,
  } = props;

  const associatedClientName = (notification.associatedClientFirstName + " " + notification.associatedClientLastName)?.toLowerCase();
  const createdByName = (notification.createdByFirstName + " " + notification.createdByLastName)?.toLowerCase();
  const signedInEmployeeName = (employee.firstName + " " + employee.lastName)?.toLowerCase();
  const originalAssociatedStaffName = 
    (notification.originalAssociatedStaffFirstName +
    " " +
    notification.originalAssociatedStaffLastName)?.toLowerCase();

  const [
    confirmAppointment,
    { loading: confirmAppointmentLoading, data: confirmAppointmentData },
  ] = useMutation(confirmAppointmentMutation);
  
  const joinToTheMeeting = (e) => {
    confirmAppointment({
      variables: {
        _id: notification.meetingId,
      }
    })
  }

  return (
    <div
      className="admin_individual_notification_container"
      style={{
        background:
          notification.new === true
            ? "rgba(211, 211, 211, 0.3)"
            : "transparent",
        cursor: "pointer"
      }}
      onClick={() => changeClickedNotification(notification)}
    >
      <div
        className="admin_notification_main_icon_container"
        style={{
          color: "rgb(51, 153, 204)",
          background: "rgba(51, 153, 204, 0.3)",
        }}
      >
        <BiCalendarPlus />
      </div>
      { notification.date == ""
        ? notification.service
          ? (<div className="admin_individual_notification_message_info">
              <p>
                <strong>
                  { associatedClientName }
                </strong>{" "}
                is waiting for
                <strong> {notification.service} </strong>Services in the store.
              </p>
              <div className="admin_notification_time_ago">
                <IoMdTime />{" "}
                {notification.createdAt
                  ? format(
                      new Date(parseInt(notification._id.substring(0, 8), 16) * 1000)
                    )
                  : null}
              </div>
              {notification.isStoreSchedule 
                ? <div className="notification_meeting_link_button">
                    <a
                      onClick={joinToTheMeeting}
                    >
                      Meet
                    </a>
                  </div>
                :
                  <div className="notification_meeting_link_button">
                    <a
                      onClick={joinToTheMeeting}
                      href={`https://meet.jit.si/${notification.meetingId}`} target="_blank"
                    >
                      Join
                    </a>
                  </div>
              }
            </div>
            )
          : (<div className="admin_individual_notification_message_info">
              <p>
                <strong>
                  { associatedClientName }
                </strong>{" "}
                is waiting on-line to purchase 
                <strong> iPhone 11.</strong>
              </p>
              <div className="admin_notification_time_ago">
                <IoMdTime />{" "}
                {notification.createdAt
                  ? format(
                      new Date(parseInt(notification._id.substring(0, 8), 16) * 1000)
                    )
                  : null}
              </div>
              <div className="notification_meeting_link_button">
                <a
                  onClick={joinToTheMeeting}
                  href={`https://meet.jit.si/${notification.meetingId}`} target="_blank"
                >
                  Join
                </a>
              </div>
            </div>
            )
        : <div className="admin_individual_notification_message_info">
          <p>
            <strong>
              {associatedClientName }
            </strong>{" "}
            has an appointment
            { notification.service ? (
               <span> for <strong>{notification.service}</strong> Services </span>
            ) : (
              " "
            )}
            at{" "}
            <strong>{notification.date} {notification.time}</strong>.
          </p>
          <div className="admin_notification_time_ago">
            <IoMdTime />{" "}
            {notification.createdAt
              ? format(
                  new Date(parseInt(notification._id.substring(0, 8), 16) * 1000)
                )
              : null}
          </div>
          {notification.isStoreSchedule 
          ? <div className="notification_meeting_link_button">
              <a
                onClick={joinToTheMeeting}
              >
                Meet
              </a>
            </div>
          :
            <div className="notification_meeting_link_button">
              <a
                onClick={joinToTheMeeting}
                href={`https://meet.jit.si/${notification.meetingId}`} target="_blank"
              >
                Join
              </a>
            </div>
          }
        </div>
      }
    </div>
  );
};

export default AdminUpcomingNotifications;
