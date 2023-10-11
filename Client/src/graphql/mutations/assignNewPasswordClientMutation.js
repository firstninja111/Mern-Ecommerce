import { gql } from "apollo-boost";

const assignNewPasswordClientMutation = gql`
  mutation($_id: ID) {
    assignNewPasswordClient(_id: $_id) {
      _id
      permanentPasswordSet
      firstName
      lastName
      email
      phoneNumber
      password
    }
  }
`;

export default assignNewPasswordClientMutation;
