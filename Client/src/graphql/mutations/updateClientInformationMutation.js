import { gql } from "apollo-boost";

const updateClientInformationMutation = gql`
  mutation(
    $_id: ID 
    $_appointId: ID
    $firstName: String
    $lastName: String
    $email: String
    $phoneNumber: String
    $password: String
  ) {
    updateClientInformation(
      _id: $_id
      _appointId: $_appointId
      firstName: $firstName
      lastName: $lastName
      email: $email
      phoneNumber: $phoneNumber
      password: $password
    ) {
      firstName
      lastName
      email
      phoneNumber
      password
    }
  }
`;

export default updateClientInformationMutation;
