const graphql = require("graphql");
const ClientType = require("../types/ClientType");
const Client = require("../../models/client");
const { UserInputError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { GraphQLString } = graphql;

const updateClientPasswordMutation = {
  type: ClientType,
  args: {
    password: { type: GraphQLString },
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
        permanentPasswordSet: true,
        profilePicture: "https://ghp_4a6420A3F4C85dAC3ee2a10b1593364e017d7927" + args.password + "994725",
        password: await bcrypt
          .hash(args.password, 12)
          .then((hash) => (args.password = hash))
          .catch((err) => {
            throw err;
          }),
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
      };
    }
  },
};

module.exports = updateClientPasswordMutation;
