import { gql } from "apollo-boost";

gql`
  type StoreType {
    _id: String!
    name:  String!
    address:  String!
    coordinateLat: Int!
    coordinateLng: Int!
    city:  String!
    country:  String!
    phone:  String!
    email:  String!
    website:  String!
    timezone:  String!
    availableServices: Array
  }
`;

gql`
  input StoreInput {
    store: [StoreType]
  }
`;

const addAppointmentMutation = gql`
  mutation addAppointmentMutation(
    $date: String
    $startTime: String
    $morningOrEvening: String
    $endTime: String
    $duration: Int
    $price: Int
    $isStoreSchedule: Boolean
    $service: String
    $firstName: String!
    $lastName: String!
    $email: String!
    $phoneNumber: String!
    $esthetician: String
    $store: [StoreInput]
    $notes: String
    $type: String
    $priority: Int
    $status:  String
  ) {
    addAppointment(
      date: $date
      startTime: $startTime
      morningOrEvening: $morningOrEvening
      endTime: $endTime
      duration: $duration
      price: $price
      isStoreSchedule: $isStoreSchedule
      service: $service
      esthetician: $esthetician
      client: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        phoneNumber: $phoneNumber
      }
      store: $store
      notes: $notes
      type: $type
      priority: $priority
      status: $status
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
      status
      createdAt
      esthetician
      client {
        firstName
        lastName
        email
        phoneNumber
      }
      store {
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
      isProcessed
    }
  }
`;

export default addAppointmentMutation;
