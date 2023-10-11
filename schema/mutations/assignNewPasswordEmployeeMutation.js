const graphql = require("graphql");
const EmployeeType = require("../types/EmployeeType");
const Employee = require("../../models/employee");
const { UserInputError } = require("apollo-server");
const generator = require("generate-password");
const mjmlUtils = require("mjml-utils");
const nodemailer = require("nodemailer");

const { GraphQLID } = graphql;

const assignNewPasswordEmployeeMutation = {
  type: EmployeeType,
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

    const employee = await Employee.findOneAndUpdate(
      { _id: args._id }, 
      {
        permanentPasswordSet: false,
        password: password,
      }, 
      {  new: true }
    );

    // mjmlUtils
    //   .inject(`./emails/TemporaryPassword.html`, {
    //     firstName:
    //       employee.firstName[0].toUpperCase() +
    //       employee.firstName.slice(1).toLowerCase(),
    //     temporaryPassword: employee.password,
    //     adminLoginLink:
    //       process.env.NODE_ENV === "production"
    //         ? `${process.env.PRODUCTION_CLIENT_URL}/admin`
    //         : "http://localhost:3000/admin",
    //   })
    //   .then(async (finalTemplate) => {
    //     await transporter.sendMail({
    //       from: process.env.GLOW_LABS_EMAIL,
    //       to: employee.email,
    //       subject: "CHOIREDEX Temporary Password",
    //       html: finalTemplate,
    //     });
    //   });

    const res = employee.save();

    return {
      ...res,
      id: employee._id,
      permanentPasswordSet: employee.permanentPasswordSet,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      password: employee.password,
    };
  },
};

module.exports = assignNewPasswordEmployeeMutation;
