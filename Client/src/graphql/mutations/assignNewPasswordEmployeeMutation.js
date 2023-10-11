import { gql } from "apollo-boost";

const assignNewPasswordEmployeeMutation = gql`
  mutation($_id: ID) {
    assignNewPasswordEmployee(_id: $_id) {
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

export default assignNewPasswordEmployeeMutation;
