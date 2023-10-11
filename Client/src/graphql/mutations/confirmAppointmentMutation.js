import { gql } from "apollo-boost";

const confirmAppointmentMutation = gql`
  mutation($_id: ID) {
    confirmAppointment(_id: $_id) {
      _id
    }
  }
`;

export default confirmAppointmentMutation;
