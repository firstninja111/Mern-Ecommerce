import { gql } from "apollo-boost";

const updateAppointmentMutation = gql`
  mutation updateAppointmentMutation(
    $_id: ID 
    $status: String 
  ) {
    updateAppointment(
      _id: $_id
      status: $status
    ) {
      _id
    }
  }
`;

export default updateAppointmentMutation;
