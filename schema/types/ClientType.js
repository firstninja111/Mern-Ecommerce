const graphql = require("graphql");
const ConsentFormType = require("./ConsentFormType");
const MyRoutineType = require("./MyRoutineType");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
} = graphql;

const ClientType = new GraphQLObjectType({
  name: "ClientType",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phoneNumber: { type: GraphQLString },
    profilePicture: { type: GraphQLString },
    password: { type: GraphQLString },
    permanentPasswordSet: { type: GraphQLBoolean },
    accessToken: { type: GraphQLString },
    refreshToken: { type: GraphQLString },
    tokenCount: { type: GraphQLInt },
    consentForm: { type: ConsentFormType },
    myRoutine: { type: MyRoutineType },
    createdAt: { type: GraphQLString },
    isOnline: { type: GraphQLBoolean}
  }),
});

module.exports = ClientType;
