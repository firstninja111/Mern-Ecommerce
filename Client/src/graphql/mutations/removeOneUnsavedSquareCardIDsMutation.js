import { gql } from "apollo-boost";

const removeOneUnsavedSquareCardIDsMutation = gql`
  mutation(
    $unsavedSquareCardID: String
    $firstName: String
    $lastName: String
    $email: String
  ) {
    removeOneUnsavedSquareCardIDs(
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

export default removeOneUnsavedSquareCardIDsMutation;
