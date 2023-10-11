import { gql } from "apollo-boost";

const updateClientIsOnlineMutation = gql`
  mutation($isOnline: Boolean) {
    updateClientIsOnline(isOnline: $isOnline) {
      _id
      permanentPasswordSet
      firstName
      lastName
      email
      phoneNumber
      password
      isOnline
    }
  }
`;

export default updateClientIsOnlineMutation;
