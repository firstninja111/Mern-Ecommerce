import { gql } from "apollo-boost";

const getAppointmentQuery = gql`
  query getAppointmentQuery(
    $_id: ID
    $date: String
    $startTime: String
    $morningOrEvening: String
    $endTime: String
    $duration: Int
    $price: Int
    $firstName: String
    $lastName: String
    $email: String
    $phoneNumber: String
    $esthetician: String
    $createdAt: String
  ) {
    appointment(
      _id: $_id
      date: $date
      startTime: $startTime
      morningOrEvening: $morningOrEvening
      endTime: $endTime
      duration: $duration
      price: $price
      esthetician: $esthetician
      createdAt: $createdAt
      firstName: $firstName
      lastName: $lastName
      email: $email
      phoneNumber: $phoneNumber
    ) {
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
      client {
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
      createdAt
    }
  }
`;

export default getAppointmentQuery;
