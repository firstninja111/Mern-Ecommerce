import { gql } from "apollo-boost";

const getAllStoreAvailabilitiesQuery = gql`
  {
    all_storeAvailabilities {
      weekday
      hour
      location
      availability
    }
  }
`;

export default getAllStoreAvailabilitiesQuery;
