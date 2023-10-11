import { gql } from "apollo-boost";

const updateClientPasswordMutation = gql`
  mutation($password: String) {
    updateClientPassword(password: $password) {
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

export default updateClientPasswordMutation;
