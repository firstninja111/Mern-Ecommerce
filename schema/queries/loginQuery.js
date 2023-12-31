const graphql = require("graphql");
const AuthType = require("../types/AuthType");
const Client = require("../../models/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createTokens = require("../../createTokens");
const { UserInputError } = require("apollo-server");

// Hide usernames and passwords
require("dotenv").config();

const { GraphQLString } = graphql;

const loginQuery = {
  type: AuthType,
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const client = await Client.findOne({ email: args.email });

    if (!client) {
      throw new UserInputError(
        "There is no registered client associated with that email."
      );
    } else {
      if (!client.permanentPasswordSet) {

        // Entered password is identical to temporary password
        if (args.password === client.password) {
          context.res.clearCookie("dummy-token", {
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : "localhost",
          });
          context.res.clearCookie("access-token", {
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : "localhost",
          });
          context.res.clearCookie("refresh-token", {
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : "localhost",
          });
          context.res.clearCookie("temporary-facebook-dummy-token", {
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : "localhost",
          });

          const generateDummyToken = (client) => {
            const token = jwt.sign(
              {
                id: client._id,
                auth: true,
              },
              process.env.JWT_SECRET_KEY_DUMMY,
              { expiresIn: "15m" }
            );
            return token;
          };

          const generateAccessToken = (client) => {
            const token = jwt.sign(
              {
                id: client._id,
                email: client.email,
                phoneNumber: client.phoneNumber,
                firstName: client.firstName,
                lastName: client.lastName,
                tokenCount: client.tokenCount,
              },
              process.env.JWT_SECRET_KEY_ACCESS,
              { expiresIn: "15m" }
            );
            return token;
          };

          const accessToken = generateAccessToken(client);
          const dummyToken = generateDummyToken(client);

          context.res.cookie("temporary-access-token", accessToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : "localhost",
          });

          context.res.cookie("temporary-dummy-token", dummyToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production" ? true : false,
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : "localhost",
          });
        } else {
          throw new UserInputError("Incorrect password.");
        }
      } else {
        const passwordsAreIdentical = await bcrypt
          .compare(args.password, client.password)
          .catch((err) => {
            throw err;
          });

        if (!passwordsAreIdentical) {
          throw new UserInputError("Incorrect password.");
        } else {

          const generateDummyToken = (client) => {
            const token = jwt.sign(
              {
                id: client._id,
                auth: true,
              },
              process.env.JWT_SECRET_KEY_DUMMY,
              { expiresIn: "7d" }
            );
            return token;
          };

          const dummyToken = generateDummyToken(client);
          context.res.cookie("dummy-token", dummyToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production" ? true : false,
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : null,
          });

          const { accessToken, refreshToken } = createTokens(client);

          context.res.cookie("access-token", accessToken, {
            maxAge: 1000 * 60 * 15,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : null,
          });

          context.res.cookie("refresh-token", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : null,
          });

          return {
            _id: client._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
          };
        }
      }
    }
  },
};

module.exports = loginQuery;
