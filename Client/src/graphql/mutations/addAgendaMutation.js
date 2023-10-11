import { gql } from "apollo-boost";

gql`
  type StoreAvailabilityType {
    weekday:  String!
    hour:  String!
    location:  String!
    availability:  String!
  }
`;

gql`
  input StoreAvailabilityInput {
    agenda: [StoreAvailabilityType]
  }
`;

const addAgendaMutation = gql`
  mutation addAgendaMutation(
    $agenda: [StoreAvailabilityInput]
  ) {
    addAgenda(
      agenda: $agenda
    ) {
      agenda {
        weekday
        hour
        location
        availability
      }
    }
  }
`;

export default addAgendaMutation;
