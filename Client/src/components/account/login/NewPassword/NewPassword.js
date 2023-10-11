import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, FormFeedback, Label, Input } from "reactstrap";
import ACTION_NEW_PASSWORD_NOT_INVALID from "../../../../actions/Login/NewPassword/Invalid/ACTION_NEW_PASSWORD_NOT_INVALID";
import ACTION_NEW_PASSWORD from "../../../../actions/Login/NewPassword/ACTION_NEW_PASSWORD";
import ACTION_NEW_PASSWORD_INVALID from "../../../../actions/Login/NewPassword/Invalid/ACTION_NEW_PASSWORD_INVALID";
import ACTION_NEW_PASSWORD_VALID from "../../../../actions/Login/NewPassword/Valid/ACTION_NEW_PASSWORD_VALID";
import ACTION_NEW_PASSWORD_NOT_VALID from "../../../../actions/Login/NewPassword/Valid/ACTION_NEW_PASSWORD_NOT_VALID";
import ACTION_NEW_PASSWORD_RESET from "../../../../actions/Login/NewPassword/ACTION_NEW_PASSWORD_RESET";
import "../AdminLoginPage.css";

const NewPassword = () => {
  const dispatch = useDispatch();

  // New Password States
  const newPassword = useSelector(
    (state) => state.newPassword.new_password
  );
  const newPasswordInvalid = useSelector(
    (state) => state.newPasswordInvalid.new_password_invalid
  );
  const newPasswordValid = useSelector(
    (state) => state.newPasswordValid.new_password_valid
  );

  const passwordTyping = () => {
    dispatch(ACTION_NEW_PASSWORD_RESET());
    dispatch(ACTION_NEW_PASSWORD_NOT_INVALID());
  };

  // Regular Expression for Password Validation - must be at least 8 characters long, must contain at least 1 lowercase character, 1 uppercase character, and 1 number
  const passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  const validatePassword = (e) => {
    const validPassword = passwordReg.test(e.currentTarget.value);
    dispatch(ACTION_NEW_PASSWORD(e.currentTarget.value.trim()));

    if (validPassword) {
      dispatch(ACTION_NEW_PASSWORD_NOT_INVALID());
      dispatch(ACTION_NEW_PASSWORD_VALID());
    } else {
      dispatch(ACTION_NEW_PASSWORD_INVALID());
      dispatch(ACTION_NEW_PASSWORD_NOT_VALID());
    }
  };

  return (
    <FormGroup>
      <Label for="LoginPassword">
        <div className="required_label">New Password</div>
      </Label>
      <Input
        type="password"
        name="createNewPassword"
        defaultValue={newPassword}
        maxLength={128}
        placeholder="Enter new password here"
        className="input_field_sign_up"
        onChange={passwordTyping}
        onBlur={validatePassword}
        invalid={
          newPassword === ""
            ? false
            : newPasswordInvalid
            ? true
            : false
        }
        valid={
          newPassword === "" ? false : newPasswordValid ? true : false
        }
      />
      {newPassword.length < 8 ? (
        <FormFeedback className="invalid_message_container" invalid="true">
          Password must be at least 8 characters long.
        </FormFeedback>
      ) : (
        <FormFeedback className="invalid_message_container" invalid="true">
          Password must contain at least 1 lowercase character, 1 uppercase
          character, and 1 number.
        </FormFeedback>
      )}
    </FormGroup>
  );
};

export default NewPassword;
