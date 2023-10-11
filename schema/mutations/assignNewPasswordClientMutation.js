const graphql = require("graphql");
const ClientType = require("../types/ClientType");
const Client = require("../../models/client");
const { UserInputError } = require("apollo-server");
const generator = require("generate-password");
const mjmlUtils = require("mjml-utils");
const nodemailer = require("nodemailer");

const { GraphQLID } = graphql;

const assignNewPasswordClientMutation = {
  type: ClientType,
  args: {
    _id: { type: GraphQLID },
  },
  async resolve(parent, args, context) {
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

    const update = {
      permanentPasswordSet: false,
      password: password,
    };

    const client = await Client.findOneAndUpdate({_id: args._id }, update, {
      new: true,
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
  },
};

module.exports = assignNewPasswordClientMutation;
