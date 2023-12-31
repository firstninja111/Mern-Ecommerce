import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faChevronRight,
  faHistory,
  faCalendarAlt,
  faTrashAlt,
  faTimes,
  faEdit,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import LZString from "lz-string";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import BounceLoader from "react-spinners/BounceLoader";
import { Transition } from "react-spring/renderprops";
import { css } from "@emotion/css";
import deleteEmployeeMutation from "../../../graphql/mutations/deleteEmployeeMutation";
import assignNewPasswordEmployeeMutation from "../../../graphql/mutations/assignNewPasswordEmployeeMutation";
import { useMutation } from "@apollo/react-hooks";
import { useCallback } from "react";
import ACTION_LOADING_SPINNER_RESET from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_RESET";
import ACTION_LOADING_SPINNER_ACTIVE from "../../../actions/LoadingSpinner/ACTION_LOADING_SPINNER_ACTIVE";
import ACTION_ADMIN_CLIENT_UPCOMING_APPOINTMENTS_SELECTED from "../../../actions/Admin/AdminLogin/AdminClientSectionSelected/ACTION_ADMIN_CLIENT_UPCOMING_APPOINTMENTS_SELECTED";
import ACTION_ADMIN_CLIENT_PAST_APPOINTMENTS_SELECTED from "../../../actions/Admin/AdminLogin/AdminClientSectionSelected/ACTION_ADMIN_CLIENT_PAST_APPOINTMENTS_SELECTED";
import ACTION_ADD_PROFILE_PHOTO_CLICKED from "../../../actions/Admin/AddProfilePhotoClicked/ACTION_ADD_PROFILE_PHOTO_CLICKED";

const AdminStaffIndividualProfile = (props) => {

  const dispatch = useDispatch();
  const loadingSpinnerActive = useSelector(
    (state) => state.loadingSpinnerActive.loading_spinner
  );

  const [deleteStaffMemberClicked, changeDeleteStaffMemberClicked] = useState(false);
  const [assignNewPasswordClicked, changeAssignNewPasswordClicked] = useState(false);

  const override = css`
    display: block;
    position: absolute;
    left: 25%;
    right: 25%;
  `;

  const [deleteEmployee, { loading, data }] = useMutation(deleteEmployeeMutation);
  const [assignNewPasswordEmployee, { loading: assignLoading, data: assignData}] = useMutation(assignNewPasswordEmployeeMutation)


  const handleDeleteEmployee = (id) => {
    deleteEmployee({
      variables: { _id: id },
    });
    props.getEmployeesRefetch();
    
    if (deleteStaffMemberClicked) {
      changeDeleteStaffMemberClicked(false);
    }
  };

  const handleAssignNewPassword = (id) => {
    assignNewPasswordEmployee({
      variables: { _id: id },
    });
    props.getEmployeesRefetch();

    if (assignNewPasswordClicked) {
      changeAssignNewPasswordClicked(false);
    }
  }

  const resetStatesAfterLoading = useCallback(() => {
    props.getEmployeesRefetch();
    dispatch(ACTION_LOADING_SPINNER_RESET());
    props.changeEmployeeToggled("");
  }, [props, dispatch]);

  useEffect(() => {
    if (data) {
      const loadingFunction = setTimeout(() => resetStatesAfterLoading(), 2000);
      return () => {
        clearTimeout(loadingFunction);
      };
    }
  }, [data, resetStatesAfterLoading]);

  useEffect(() => {
    if (assignData) {
      const loadingFunction = setTimeout(() => resetStatesAfterLoading(), 1000);
      return () => {
        clearTimeout(loadingFunction);
      };
    }
  }, [assignData, resetStatesAfterLoading]);

  useEffect(() => {
    if (loading) {
      dispatch(ACTION_LOADING_SPINNER_ACTIVE());
    }
  }, [loading, data, dispatch]);

  useEffect(() => {
    if (assignLoading) {
      dispatch(ACTION_LOADING_SPINNER_ACTIVE());
    }
  }, [assignLoading, assignData, dispatch]);

  const handleEditStaffClicked = () => {
    props.changeEditItem(props.item)
    props.changeAdminSelected("edit");
  }

  return (
    <>
      <Modal
        isOpen={deleteStaffMemberClicked}
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
        <Transition
          items={deleteStaffMemberClicked && !loadingSpinnerActive}
          from={{ transform: "translate3d(0, -65%, 0)" }}
          enter={{ transform: "translate3d(0, 0, 0)" }}
          leave={{ display: "none" }}
        >
          {(deleteStaffMemberClicked) =>
            deleteStaffMemberClicked &&
            ((styleprops) => (
              <div
                className="cancel_appointment_modal_content_container"
                style={styleprops}
              >
                <div className="log_out_modal_contents admin_cancel_appointment">
                  <FontAwesomeIcon
                    className="modal_x"
                    icon={faTimes}
                    onClick={() => changeDeleteStaffMemberClicked(false)}
                  />
                  <h2>
                    Are you sure you want to remove{" "}
                    {props.item.firstName[0].toUpperCase() +
                      props.item.firstName.slice(1).toLowerCase() +
                      " " +
                      props.item.lastName[0].toUpperCase() +
                      props.item.lastName.slice(1).toLowerCase()}{" "}
                    as a staff member?
                  </h2>
                  <span className="logout_buttons_container">
                    <div
                      className="logout_button yes_cancel_appointment_button"
                      onClick={() =>
                        handleDeleteEmployee(props.employeeToggled)
                      }
                    >
                      <p>YES, REMOVE</p>
                    </div>
                    <div
                      className="cancel_logout_button no_dont_cancel_appointment_button"
                      onClick={() => changeDeleteStaffMemberClicked(false)}
                    >
                      <p>NO, GO BACK</p>
                    </div>
                  </span>
                </div>
              </div>
            ))
          }
        </Transition>
      </Modal>
      <Modal
        isOpen={assignNewPasswordClicked}
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
        <Transition
          items={assignNewPasswordClicked && !loadingSpinnerActive}
          from={{ transform: "translate3d(0, -65%, 0)" }}
          enter={{ transform: "translate3d(0, 0, 0)" }}
          leave={{ display: "none" }}
        >
          {(assignNewPasswordClicked) =>
            assignNewPasswordClicked &&
            ((styleprops) => (
              <div
                className="cancel_appointment_modal_content_container"
                style={styleprops}
              >
                <div className="log_out_modal_contents admin_cancel_appointment">
                  <FontAwesomeIcon
                    className="modal_x"
                    icon={faTimes}
                    onClick={() => changeAssignNewPasswordClicked(false)}
                  />
                  <h2>
                    Are you sure you want to assign a new password to a staff {" "}
                    {props.item.firstName[0].toUpperCase() +
                      props.item.firstName.slice(1).toLowerCase() +
                      " " +
                      props.item.lastName[0].toUpperCase() +
                      props.item.lastName.slice(1).toLowerCase()}?
                  </h2>
                  <span className="logout_buttons_container">
                    <div
                      className="logout_button yes_cancel_appointment_button"
                      onClick={() => handleAssignNewPassword(props.employeeToggled)}
                    >
                      <p>YES, ASSIGN</p>
                    </div>
                    <div
                      className="cancel_logout_button no_dont_cancel_appointment_button"
                      onClick={() => changeAssignNewPasswordClicked(false)}
                    >
                      <p>NO, GO BACK</p>
                    </div>
                  </span>
                </div>
              </div>
            ))
          }
        </Transition>
      </Modal>
      <div className="admin_client_profile_top_section">
        <div className="admin_client_profile_client_avatar_container">
        </div>
        <div className="admin_individual_selected_client_full_name_container">
          <h2>
            {props.item.firstName[0].toUpperCase() +
              props.item.firstName.slice(1).toLowerCase() +
              " " +
              props.item.lastName[0].toUpperCase() +
              props.item.lastName.slice(1).toLowerCase()}
          </h2>
        </div>
        <div className="admin_individual_selected_client_contact_info_container">
          <p>{props.item.email}</p>
          {props.renderBarInContactInfo()}
          <p>{props.item.phoneNumber}</p>
          {!(props.item.permanentPasswordSet) && <p>Temporary password: {props.item.password}</p>}
          <p>
            Role:{" "}
            {props.item.employeeRole.length > 0
              ? props.item.employeeRole.join(", ")
              : "None"}
          </p>
        </div>
      </div>
      <div className="admin_client_profile_bottom_buttons_container">
        <div
          className="profile_button_container"
          onClick={() =>
            dispatch(ACTION_ADMIN_CLIENT_UPCOMING_APPOINTMENTS_SELECTED())
          }
        >
          <FontAwesomeIcon
            className="profile_button_icon"
            icon={faCalendarAlt}
          />
          <h2>Upcoming Appointments</h2>
          <FontAwesomeIcon
            className="profile_button_expand"
            icon={faChevronRight}
          />
        </div>
        <div
          className="profile_button_container"
          onClick={() =>
            dispatch(ACTION_ADMIN_CLIENT_PAST_APPOINTMENTS_SELECTED())
          }
        >
          <FontAwesomeIcon className="profile_button_icon" icon={faHistory} />
          <h2>Past Appointments</h2>
          <FontAwesomeIcon
            className="profile_button_expand"
            icon={faChevronRight}
          />
        </div>
        {props.getEmployeeData ? 
          props.getEmployeeData.employee
            ? (
                props.getEmployeeData.employee.employeeRole.includes("Admin")
              ) || (
                props.getEmployeeData.employee.employeeRole.includes("Manager") && 
                !props.item.employeeRole.includes("Admin")
              ) || (
                props.getEmployeeData.employee.employeeRole.includes("Staff") && 
                props.getEmployeeData.employee._id == props.employeeToggled
              )
            ? 
              <div className="admin_client_profile_bottom_buttons_container" style={{margin: 0, padding: 0}}>
                <div
                  className="profile_button_container"
                  onClick={() => handleEditStaffClicked()}
                >
                  <FontAwesomeIcon
                    className="profile_button_icon"
                    icon={faEdit}
                  />
                  <h2>
                    Edit Staff
                  </h2>
                </div>
              </div>
            : null
          : null
        : null}
        {props.getEmployeeData ? 
          props.getEmployeeData.employee
          ? props.getEmployeeData.employee.employeeRole.includes("Admin")
            ? 
              <div
                className="profile_button_container"
                onClick={() => changeAssignNewPasswordClicked(true)}
              >
                <FontAwesomeIcon
                  className="profile_button_icon"
                  icon={faKey}
                />
                <h2 >
                  Assign New Temporary Password
                </h2>
              </div>
              : null
           : null
          : null}
        {props.getEmployeeData ? 
          props.getEmployeeData.employee
            ? (
                props.getEmployeeData.employee.employeeRole.includes("Admin") && 
                props.getEmployeeData.employee._id !== props.employeeToggled
              ) || (
                props.getEmployeeData.employee.employeeRole.includes("Manager") && 
                props.getEmployeeData.employee._id !== props.employeeToggled &&
                props.getEmployeeData.employee.store !== props.item.store && 
                !props.item.employeeRole.includes("Admin")
              )
            ? 
              <div
                className="profile_button_container"
                onClick={() => changeDeleteStaffMemberClicked(true)}
              >
                <FontAwesomeIcon
                  className="profile_button_icon"
                  icon={faTrashAlt}
                  style={{ color: "rgb(177, 48, 0)" }}
                />
                <h2 style={{ color: "rgb(177, 48, 0)" }}>
                  Delete Staff Member
                </h2>
              </div>
              : null
            : null
          : null}
      </div>
    </>
  );
};

export default AdminStaffIndividualProfile;