import { gql } from "apollo-boost";

const getAllServicesQuery = gql`
  {
    all_services {
      _id
      name
      description
      duration
      image
    }
  }
`;

export default getAllServicesQuery;
