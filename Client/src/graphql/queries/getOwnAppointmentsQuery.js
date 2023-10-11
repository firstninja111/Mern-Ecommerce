import { gql } from "apollo-boost";

const getOwnAppointmentsQuery = gql`
  query($_id: ID, $email: String) {
    own_appointments(_id: $_id, email: $email) {
      _id
      date
      startTime
      morningOrEvening
      endTime
      duration
      price
      isStoreSchedule
      service
      esthetician
      status
      client {
        _id
        firstName
        lastName
        email
        phoneNumber
      }
      store {
        _id
        name
        address
        coordinateLat
        coordinateLng
        city
        country
        phone
        email
        website
        timezone
        availableServices
      }
      notes
      confirmed
    }
  }
`;

export default getOwnAppointmentsQuery;
