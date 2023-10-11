const graphql = require("graphql");
const ClientType = require("../types/ClientType");
const Client = require("../../models/client");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { GraphQLBoolean } = graphql;

const updateClientIsOnlineMutation = {
  type: ClientType,
  args: {
    isOnline: { type: GraphQLBoolean },
  },
  async resolve(parent, args, context) {
    if (!context.isAuth) {
      throw new UserInputError("User is not authenticated.");
    } else {
      let token;

      if (context.cookies["temporary-access-token"]) {
        token = context.cookies["temporary-access-token"];
      } else if (context.cookies["access-token"]) {
        token = context.cookies["access-token"];
      }

      let filter = {
        _id: jwt.decode(token).id.toString(),
      };

      const update = {
        isOnlie: args.isOnline,
      };

      const client = await Client.findOneAndUpdate(filter, update, {
        new: true,
      });

      const res = client.save();

      return {
        ...res,
        id: client._id,
        permanentPasswordSet: client.permanentPasswordSet,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phoneNumber: client.phoneNumber,
        password: client.password,
        isOnline: client.isOnline,
      };
    }
  },
};

module.exports = updateClientIsOnlineMutation;
