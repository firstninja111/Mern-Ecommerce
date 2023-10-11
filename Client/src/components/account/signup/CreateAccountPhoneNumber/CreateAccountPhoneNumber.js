import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormGroup, FormFeedback, Label, Input } from "reactstrap";
import { useQuery } from "@apollo/react-hooks";
import getClientsQuery from "../../../../graphql/queries/getClientsQuery";
import ACTION_CREATE_ACCOUNT_PHONE_NUMBER_VALID from "../../../../actions/CreateAccount/CreateAccountPhoneNumber/Validation/Valid/ACTION_CREATE_ACCOUNT_PHONE_NUMBER_VALID";
import ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_INVALID from "../../../../actions/CreateAccount/CreateAccountPhoneNumber/Validation/Invalid/ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_INVALID";
import ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_VALID from "../../../../actions/CreateAccount/CreateAccountPhoneNumber/Validation/Valid/ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_VALID";
import ACTION_CREATE_ACCOUNT_PHONE_NUMBER_INVALID from "../../../../actions/CreateAccount/CreateAccountPhoneNumber/Validation/Invalid/ACTION_CREATE_ACCOUNT_PHONE_NUMBER_INVALID";
import ACTION_CREATE_ACCOUNT_PHONE_NUMBER from "../../../../actions/CreateAccount/CreateAccountPhoneNumber/ACTION_CREATE_ACCOUNT_PHONE_NUMBER";
import ACTION_CREATE_ACCOUNT_PHONE_NUMBER_RESET from "../../../../actions/CreateAccount/CreateAccountPhoneNumber/ACTION_CREATE_ACCOUNT_PHONE_NUMBER_RESET";
import "../SignUp.css";

const PhoneNumber = (props) => {
  const dispatch = useDispatch();
  // Phone Number States
  const createAccountPhoneNumber = useSelector(
    (state) => state.createAccountPhoneNumber.create_account_phone_number
  );
  const createAccountPhoneNumberValid = useSelector(
    (state) =>
      state.createAccountPhoneNumberValid.create_account_phone_number_valid
  );
  const createAccountPhoneNumberInvalid = useSelector(
    (state) =>
      state.createAccountPhoneNumberInvalid.create_account_phone_number_invalid
  );
  const facebookCompleteRegistration = useSelector(
    (state) =>
      state.facebookCompleteRegistration.facebook_complete_registration_active
  );
  const createAccountFirstName = useSelector(
    (state) => state.createAccountFirstName.create_account_first_name
  );
  const createAccountLastName = useSelector(
    (state) => state.createAccountLastName.create_account_last_name
  );
  const createAccountEmailValid = useSelector(
    (state) => state.createAccountEmailValid.create_account_email_valid
  );

  const [
    phoneNumberAlreadyRegistered,
    changePhoneNumberAlreadyRegistered,
  ] = useState(false);

  // Regular Expression for Phone Number Validation - allows only phone numbers in the format (xxx) xxx - xxx, with x values being digits
  // const phoneNumberReg = /^(\(\d\d\d\))+\s+(\d\d\d)+\s+(-)+\s+(\d\d\d\d)$/g;
  const phoneNumberReg = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
  // Regular Expression for Autocompleted Phone Numbers - allows phone numbers in the format 1xxxxxxxxxx, with x values being digits and the leading 1 country code being optional.
  const phoneNumberAutocompleteReg = /^(1*\d{10})$/g;

  const { data } = useQuery(getClientsQuery, {
    fetchPolicy: "no-cache",
  });

  const validatePhoneNumber = useCallback(
    (number) => {
      const validPhoneNumber = phoneNumberReg.test(number);
      // const validPhoneAutocomplete = phoneNumberAutocompleteReg.test(number);

      if (createAccountPhoneNumber) {
        if (data) {
          for (let i = 0; i < data.clients.length; i++) {
            if (
              data.clients[i].phoneNumber === createAccountPhoneNumber &&
              (data.clients[i].password !== null ||
                data.clients[i].tokenCount > 0)
            ) {
              changePhoneNumberAlreadyRegistered(true);
              dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_VALID());
              dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_INVALID());
            }
          }
        }
      }

      if (!phoneNumberAlreadyRegistered) {
        if (
            validPhoneNumber && 
            createAccountPhoneNumber.length >= 11 && 
            createAccountPhoneNumber.length < 13/* || validPhoneAutocomplete */
          ) {
          dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_VALID());
          dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_INVALID());
        } else {
          dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_VALID());
          dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_INVALID());
        }
      } else {
        dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_VALID());
        dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_INVALID());
      }

      // ignore validation
      // dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_VALID());
      // dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_INVALID());
    },
    [
      data,
      dispatch,
      phoneNumberAlreadyRegistered,
      phoneNumberAutocompleteReg,
      phoneNumberReg,
      createAccountPhoneNumber,
    ]
  );

  useEffect(() => {
    if (createAccountPhoneNumber.length === 16) {
      validatePhoneNumber(createAccountPhoneNumber);
    }
  }, [
    validatePhoneNumber,
    createAccountPhoneNumber,
    dispatch,
    phoneNumberAlreadyRegistered,
    phoneNumberAutocompleteReg,
    phoneNumberReg,
  ]);

  const handlePhoneNumber = (e) => {
    validatePhoneNumber(e.currentTarget.value);
    dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER(e.currentTarget.value));
  };

  const phoneNumberTyping = (e) => {
    let currentTyping = e.currentTarget.value;

    dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_RESET());

    if (createAccountPhoneNumber.length !== 15) {
      if (createAccountPhoneNumberValid) {
        dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_VALID());
      }
    }

    if (phoneNumberAlreadyRegistered) {
      changePhoneNumberAlreadyRegistered(false);
    }
    if (createAccountPhoneNumberInvalid) {
      dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER_NOT_INVALID());
    }

    dispatch(ACTION_CREATE_ACCOUNT_PHONE_NUMBER(e.currentTarget.value));
    e.currentTarget.value = currentTyping;
  };

  return (
    <FormGroup className="sign_up_individual_form_field">
      <Label for="createAccountPhoneNumber">
        <div className="required_label">
          Phone Number
          <p className="required_label red_asterisk">
            {facebookCompleteRegistration ? null : "* "}
          </p>
        </div>
      </Label>
      <Input
        type="tel"
        name="createAccountPhoneNumber"
        maxLength={16}
        defaultValue={createAccountPhoneNumber}
        placeholder="Phone number"
        onBlur={handlePhoneNumber}
        onChange={phoneNumberTyping}
        className="input_field_sign_up"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (
              createAccountFirstName &&
              createAccountLastName &&
              createAccountEmailValid &&
              createAccountPhoneNumberValid
            ) {
              props.changeCreateAccountStepTwoTriggered(true);
            }
          }
        }}
        invalid={
          createAccountPhoneNumber === ""
            ? false
            : createAccountPhoneNumberInvalid
            ? true
            : false
        }
        valid={
          createAccountPhoneNumber === ""
            ? false
            : createAccountPhoneNumberValid
            ? true
            : false
        }
      />
      {phoneNumberAlreadyRegistered ? (
        <FormFeedback className="invalid_message_container" invalid="true">
          This phone number has already been registered.
        </FormFeedback>
      ) : (
        <FormFeedback className="invalid_message_container" invalid="true">
          Please enter a valid phone number.
        </FormFeedback>
      )}
    </FormGroup>
  );
};

export default PhoneNumber;
