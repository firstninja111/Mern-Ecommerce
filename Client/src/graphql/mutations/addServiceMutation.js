import { gql } from "apollo-boost";

const addServiceMutation = gql`
  mutation(
    $name: String!
    $description: String!
    $duration: Int
    $image: String
  ) {
    addService(
      name: $name
      description: $description
      duration: $duration
      image: $image
    ) {
      name
      description
      duration
      image
    }
  }
`;

export default addServiceMutation;
