import { gql } from "apollo-boost";

const processAppointmentMutation = gql`
  mutation($_id: ID) {
    processAppointment(_id: $_id) {
      _id
    }
  }
`;

export default processAppointmentMutation;
