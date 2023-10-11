import { gql } from "apollo-boost";

const getAllAppointmentsQuery = gql`
  {
    all_appointments {
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
      isProcessed
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
      type
      priority
      confirmed
      createdAt
      checkedInDateTime
    }
  }
`;

export default getAllAppointmentsQuery;
