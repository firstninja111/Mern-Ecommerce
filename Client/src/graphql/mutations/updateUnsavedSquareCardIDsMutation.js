import { gql } from "apollo-boost";

const updateUnsavedSquareCardIDsMutation = gql`
  mutation(
    $unsavedSquareCardID: String
    $firstName: String
    $lastName: String
    $email: String
  ) {
    updateUnsavedSquareCardIDs(
      unsavedSquareCardID: $unsavedSquareCardID
      firstName: $firstName
      lastName: $lastName
      email: $email
    ) {
      unsavedSquareCardIDs
      firstName
      lastName
      email
    }
  }
`;

export default updateUnsavedSquareCardIDsMutation;
