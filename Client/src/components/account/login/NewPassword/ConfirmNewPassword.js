import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, FormFeedback, Label, Input } from "reactstrap";
import ACTION_CONFIRM_NEW_PASSWORD from "../../../../actions/Login/ConfirmNewPassword/ACTION_CONFIRM_NEW_PASSWORD";
import ACTION_CONFIRM_NEW_PASSWORD_RESET from "../../../../actions/Login/ConfirmNewPassword/ACTION_CONFIRM_NEW_PASSWORD_RESET";
import ACTION_CONFIRM_NEW_PASSWORD_NOT_INVALID from "../../../../actions/Login/ConfirmNewPassword/Invalid/ACTION_CONFIRM_NEW_PASSWORD_NOT_INVALID";
import ACTION_CONFIRM_NEW_PASSWORD_VALID from "../../../../actions/Login/ConfirmNewPassword/Valid/ACTION_CONFIRM_NEW_PASSWORD_VALID";
import ACTION_CONFIRM_NEW_PASSWORD_INVALID from "../../../../actions/Login/ConfirmNewPassword/Invalid/ACTION_CONFIRM_NEW_PASSWORD_INVALID";
import ACTION_CONFIRM_NEW_PASSWORD_NOT_VALID from "../../../../actions/Login/ConfirmNewPassword/Valid/ACTION_CONFIRM_NEW_PASSWORD_NOT_VALID";
import "../AdminLoginPage.css";

const ConfirmNewPassword = () => {
  const dispatch = useDispatch();

  // Confirm New Password States
  const newPassword = useSelector(
    (state) => state.newPassword.new_password
  );
  const newPasswordValid = useSelector(
    (state) => state.newPasswordValid.new_password_valid
  );
  const confirmNewPassword = useSelector(
    (state) => state.confirmNewPassword.confirm_new_password
  );
  const confirmNewPasswordInvalid = useSelector(
    (state) =>
      state.confirmNewPasswordInvalid.confirm_new_password_invalid
  );
  const confirmNewPasswordValid = useSelector(
    (state) =>
      state.confirmNewPasswordValid.confirm_new_password_valid
  );

  useEffect(() => {
    if (confirmNewPassword === newPassword) {
      dispatch(ACTION_CONFIRM_NEW_PASSWORD_NOT_INVALID());
      dispatch(ACTION_CONFIRM_NEW_PASSWORD_VALID());
    } else {
      dispatch(ACTION_CONFIRM_NEW_PASSWORD_INVALID());
      dispatch(ACTION_CONFIRM_NEW_PASSWORD_NOT_VALID());
    }
  }, [dispatch, confirmNewPassword, newPassword]);

  const handleConfirmNewPassword = (e) => {
    dispatch(ACTION_CONFIRM_NEW_PASSWORD(e.currentTarget.value.trim()));
  };

  const confirmNewPasswordTyping = (e) => {
    dispatch(ACTION_CONFIRM_NEW_PASSWORD_RESET());

    if (newPassword) {
      if (newPasswordValid) {
        if (e.currentTarget.value === newPassword) {
          dispatch(
            ACTION_CONFIRM_NEW_PASSWORD(e.currentTarget.value.trim())
          );
          dispatch(ACTION_CONFIRM_NEW_PASSWORD_NOT_INVALID());
          dispatch(ACTION_CONFIRM_NEW_PASSWORD_VALID());
        }
      }
    }
  };

  return (
    <FormGroup className="sign_up_individual_form_field">
      <Label for="LoginPassword">
        <div className="required_label">Confirm New Password</div>
      </Label>
      <Input
        type="password"
        name="createAccountConfirmPassword"
        defaultValue={confirmNewPassword}
        maxLength={128}
        placeholder="Re-enter new password here"
        className="input_field_sign_up"
        onChange={confirmNewPasswordTyping}
        onBlur={handleConfirmNewPassword}
        invalid={
          confirmNewPassword === ""
            ? false
            : confirmNewPasswordInvalid
            ? true
            : false
        }
        valid={
          confirmNewPassword === ""
            ? false
            : confirmNewPasswordValid
            ? true
            : false
        }
      />
      {confirmNewPassword === newPassword ? null : (
        <FormFeedback className="invalid_message_container" invalid="true">
          Passwords must match.
        </FormFeedback>
      )}
    </FormGroup>
  );
};

export default ConfirmNewPassword;
