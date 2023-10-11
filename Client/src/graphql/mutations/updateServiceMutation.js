import { gql } from "apollo-boost";

const updateServiceMutation = gql`
  mutation(
    $_id: ID
    $name: String
    $description: String
    $image: String
  ) {
    updateService(
      _id: $_id
      name: $name
      description: $description
      image: $image
    ) {
      _id
      name
      description
      image
    }
  }
`;

export default updateServiceMutation;
