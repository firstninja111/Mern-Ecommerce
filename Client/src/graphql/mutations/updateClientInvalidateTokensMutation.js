import { gql } from "apollo-boost";

const updateClientInvalidateTokensMutation = gql`
  mutation {
    updateClientInvalidateTokens {
      _id
      firstName
      lastName
      email
      phoneNumber
      password
      createdAt
      tokenCount
    }
  }
`;

export default updateClientInvalidateTokensMutation;
