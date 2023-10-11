const graphql = require("graphql");
const ClientType = require("../types/ClientType");
const Client = require("../../models/client");
const generator = require("generate-password");
const mjmlUtils = require("mjml-utils");
const nodemailer = require("nodemailer");

const { GraphQLString, GraphQLNonNull } = graphql;

const addClientMutation = {
  type: ClientType,
  args: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: GraphQLString },
  },
  resolve(parent, args) {
    const password = generator.generate({
      length: 10,
      numbers: true,
      lowercase: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });

    // let transporter = nodemailer.createTransport({
    //   host: "smtp.mail.yahoo.com",
    //   service: "yahoo",
    //   secure: false,
    //   auth: {
    //     user: process.env.GLOW_LABS_EMAIL,
    //     pass: process.env.GLOW_LABS_EMAIL_APP_PASSWORD,
    //   },
    //   debug: false,
    //   logger: true,
    // });

    let client = new Client({
      _id: new mongoose.Types.ObjectId(),
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      email: args.email,
      phoneNumber: args.phoneNumber,
      password: password,
      isOnline: false,
    });

    // mjmlUtils
    //   .inject(`./emails/TemporaryPassword.html`, {
    //     firstName:
    //       client.firstName[0].toUpperCase() +
    //       client.firstName.slice(1).toLowerCase(),
    //     temporaryPassword: client.password,
    //     adminLoginLink:
    //       process.env.NODE_ENV === "production"
    //         ? `${process.env.PRODUCTION_CLIENT_URL}/`
    //         : "http://localhost:3000/",
    //   })
    //   .then(async (finalTemplate) => {
    //     await transporter.sendMail({
    //       from: process.env.GLOW_LABS_EMAIL,
    //       to: client.email,
    //       subject: "CHOIREDEX Temporary Password",
    //       html: finalTemplate,
    //     });
    //   });

    return client.save();
  },
};

module.exports = addClientMutation;
