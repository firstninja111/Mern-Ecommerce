const graphql = require("graphql");
const mongoose = require("mongoose");
const AppointmentType = require("../types/AppointmentType");
const ClientInput = require("../types/inputs/ClientInput");
const StoreInput = require("../types/inputs/StoreInput");
const Client = require("../../models/client");
const Appointment = require("../../models/appointment");
const moment = require("moment");
const {
  ICalendar,
  YahooCalendar,
  GoogleCalendar,
  OutlookCalendar,
} = require("datebook");
const generator = require("generate-password");
const mjmlUtils = require("mjml-utils");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Notification = require("../../models/notification");
const createNotificationFunction = require("./notifications/createNotificationFunction");
const Employee = require("../../models/employee");

// Used to normalize phone numbers for use by Twilio
const phone = require("phone");

// Hide usernames and passwords
require("dotenv").config();

const { GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean } = graphql;

const UPDATED_EMPLOYEE = "getUpdatedEmployee";

const addAppointmentMutation = {
  type: AppointmentType,
  args: {
    date: { type: GraphQLString },
    startTime: { type: GraphQLString },
    morningOrEvening: { type: GraphQLString },
    endTime: { type: GraphQLString },
    duration: { type: GraphQLInt },
    price: { type: GraphQLInt },
    isStoreSchedule: { type: GraphQLBoolean },
    service: { type: GraphQLString },
    client: { type: new GraphQLList(ClientInput) },
    store: { type: new GraphQLList(StoreInput) },
    esthetician: { type: GraphQLString },
    status: {type: GraphQLString },
    notes: { type: GraphQLString },
    type: { type: GraphQLString },
    priority: {type: GraphQLInt},    
  },
  async resolve(parent, args, context) {
    const foundClient = await Client.findOne({
      email: args.client[0].email,
      phoneNumber: args.client[0].phoneNumber,
    });

    let appt_res;

    const createEventObject = (appointment) => {
      const eventObject = {
        title: "CHOIREDEX Appointment",
        location: "1506 Broadway, Hewlett, NY 11557",
        description: appointment
          ? appointment.store.name + "in" + appointment.store.address
          : "",
        start: appointment
          ? moment(
              moment(appointment.date, "LL")
                .format("LLLL")
                .split(" ")
                .slice(
                  0,
                  moment(appointment.date, "LL").format("LLLL").split(" ")
                    .length - 2
                )
                .join(" ") +
                " " +
                appointment.startTime +
                " " +
                appointment.morningOrEvening,
              "LLLL"
            ).format()
          : "",
        end: appointment
          ? moment(
              moment(appointment.date, "LL")
                .format("LLLL")
                .split(" ")
                .slice(
                  0,
                  moment(appointment.date, "LL").format("LLLL").split(" ")
                    .length - 2
                )
                .join(" ") +
                " " +
                appointment.startTime +
                " " +
                appointment.morningOrEvening,
              "LLLL"
            )
              .add(appointment.duration, "minutes")
              .format()
          : "",
      };

      return eventObject;
    };

    // const twilioTextingFunction = (clientObject, appointmentObject) => {
    //   const accountSid = process.env.TWILIO_ACCOUNT_SID;
    //   const authToken = process.env.TWILIO_AUTH_TOKEN;
    //   const client = require("twilio")(accountSid, authToken);

    //   // Format phone number for Twilio texting purposes
    //   // const clientPhoneNumber = phone(clientObject.phoneNumber); 

    //   client.messages
    //     .create({
    //       body:
    //         "Hi, " +
    //         clientObject.firstName[0].toUpperCase() +
    //         clientObject.firstName.slice(1).toLowerCase() +
    //         "! Your CHOIREDEX appointment has been scheduled for " +
    //         appointmentObject.startTime +
    //         " " +
    //         appointmentObject.morningOrEvening +
    //         " on " +
    //         moment(appointmentObject.date, "MMMM D, YYYY").format(
    //           "dddd, MMMM Do, YYYY"
    //         ) +
    //         ` at 1506 Broadway, Hewlett, NY 11557. Reply Y to confirm.\n\nIf you need to cancel or reschedule your appointment, please call us at (516) 442-8122 or visit ${
    //           process.env.NODE_ENV === "production"
    //             ? "https://is.gd/glow_labs"
    //             : "https://is.gd/glowlabs"
    //         }. We look forward to seeing you soon!`,
    //       from: process.env.GLOW_LABS_TEXT_NUMBER,
    //       to:
    //         process.env.NODE_ENV === "production"
    //           ? clientPhoneNumber[0]
    //           : process.env.TWILIO_TEST_TEXT_NUMBER,
    //     })
    //     .then((message) => console.log("message id:::::::::::::::::::::::::::::::::::", message.id))
    //     .catch((err) => console.log("error:::::::::::::::::::::::::::::::::::", err));
    // };

    const auth = context.isAuth;
    const token = context.cookies["access-token"];

    const adminToken = context.cookies["admin-access-token"];

    let decodedAdminID = "";
    let currentSignedInEmployee = "";

    if (adminToken) {
      
      decodedAdminID = jwt.decode(adminToken).id.toString();

      currentSignedInEmployee = await Employee.findOne({
        _id: decodedAdminID,
      });
    }

    // let transporter = nodemailer.createTransport({
    //   host: process.env.GLOW_LABS_EMAIL_HOST, // "smtp-relay.sendinblue.com",
    //   //service: "yahoo",
    //   secure: false,
    //   port: process.env.GLOW_LABS_EMAIL_PORT, // 587,
    //   auth: {
    //     user: process.env.GLOW_LABS_EMAIL,//"letpat15@yahoo.com",
    //     pass: process.env.GLOW_LABS_EMAIL_APP_PASSWORD//"cHtRxE29qVbhrZOK",
    //   },
    //   debug: false,
    //   logger: true,
    // });
    const newClientId = new mongoose.Types.ObjectId();

    let appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      date: args.date,
      startTime: args.startTime,
      morningOrEvening: args.morningOrEvening,
      endTime: args.endTime,
      duration: args.duration,
      price: args.price,
      isStoreSchedule: args.isStoreSchedule,
      service: args.service,
      store: args.store[0],
      esthetician: "", //args.esthetician,
      createdAt: Date.now(),
      status: args.status,
      client: foundClient
        ? auth !== undefined && !adminToken
          ? {
              _id: jwt.decode(token).id,
              firstName: jwt.decode(token).firstName,
              lastName: jwt.decode(token).lastName,
              email: jwt.decode(token).email,
              phoneNumber: jwt.decode(token).phoneNumber,
            }
          : {
              _id: foundClient._id,
              firstName: args.client[0].firstName,
              lastName: args.client[0].lastName,
              email: args.client[0].email,
              phoneNumber: args.client[0].phoneNumber,
            }
        : {
            _id: newClientId,
            firstName: args.client[0].firstName,
            lastName: args.client[0].lastName,
            email: args.client[0].email,
            phoneNumber: args.client[0].phoneNumber,
          },
      notes: args.notes === "" ? null : args.notes,
      confirmed: false,
      isProcessed: false,
      type: args.type,
      priority: args.priority,
      checkedInDateTime: args.status === "checked-in" ? Date.now() : ""
    });

    let client;

    let newNotification = new Notification({
      _id: new mongoose.Types.ObjectId(),
      new: true,
      type: "bookAppointment",
      date: args.date,
      time: args.startTime + " " + args.morningOrEvening,
      associatedClientFirstName: args.client[0].firstName,
      associatedClientLastName: args.client[0].lastName,
      originalAssociatedStaffFirstName: args.esthetician ? args.esthetician.split(" ")[0] : "",
      originalAssociatedStaffLastName: args.esthetician ? args.esthetician.split(" ")[1] : "",
      createdByFirstName: currentSignedInEmployee
        ? currentSignedInEmployee.firstName
        : args.client[0].firstName,
      createdByLastName: currentSignedInEmployee
        ? currentSignedInEmployee.lastName
        : args.client[0].lastName,
      createdAt: Date.now(),
      meetingId: appointment._id,
      isStoreSchedule: args.isStoreSchedule,
      service: args.service,
    });

    const updateNotifications = (staff) =>
      createNotificationFunction(newNotification, staff);

    if (!foundClient) {

      const password = generator.generate({
        length: 10,
        numbers: true,
        lowercase: true,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      client = new Client({
        _id: newClientId,
        firstName: args.client[0].firstName,
        lastName: args.client[0].lastName,
        email: args.client[0].email,
        phoneNumber: args.client[0].phoneNumber,
        password: password,
      });

      const emailTaken = await Client.findOne({
        email: args.client[0].email,
      });
      const phoneNumberTaken = await Client.findOne({
        phoneNumber: args.client[0].phoneNumber,
      });


      if (!emailTaken || !phoneNumberTaken) {

        // mjmlUtils
        // .inject(`./emails/TemporaryPassword.html`, {
        //   firstName:
        //     client.firstName[0].toUpperCase() +
        //     client.firstName.slice(1).toLowerCase(),
        //   temporaryPassword: client.password,
        //   adminLoginLink:
        //     process.env.NODE_ENV === "production"
        //       ? `${process.env.PRODUCTION_CLIENT_URL}/`
        //       : "http://localhost:3000/",
        // })
        // .then(async (finalTemplate) => {
        //   await transporter.sendMail({
        //     from: process.env.GLOW_LABS_EMAIL,
        //     to: client.email,
        //     subject: "CHOIREDEX Temporary Password",
        //     html: finalTemplate,
        //   });
        // });

        appt_res = await appointment.save();
        const client_res = await client.save();

        if(args.date){
          (
            await Employee.find({
              employeeRole: "Admin",
              // firstName: {
              //   $ne: args.esthetician.split(" ")[0].toLowerCase(),
              // },
              // lastName: { $ne: args.esthetician.split(" ")[1].toLowerCase() },
            })
          ).forEach((currentEmployee) => {
            const notificationsObj = updateNotifications(currentEmployee);
            currentEmployee.notifications = notificationsObj.notifications;

            currentEmployee.save();
          });

          if(args.esthetician){
            const updatedEmployee = await Employee.findOne(
              {
                firstName: args.esthetician.split(" ")[0].trim().toLowerCase(),
                lastName: args.esthetician.split(" ")[1].trim().toLowerCase(),
              },
              (err, currentEmployee) => {
                const notificationsObj = updateNotifications(currentEmployee);
  
                if (currentEmployee) {
                  currentEmployee.notifications = notificationsObj.notifications;
  
                  currentEmployee.save();
                }
              }
            );
          }
          

          const updatedEmployeeRes = await updatedEmployee.save();

          context.pubsub.publish(UPDATED_EMPLOYEE, {
            employee: updatedEmployeeRes,
          });
        } else {
          (
            await Employee.find({
            })
          ).forEach((currentEmployee) => {
            if(currentEmployee.store._id !== args.store[0]._id) return;
            const notificationsObj = updateNotifications(currentEmployee);
            currentEmployee.notifications = notificationsObj.notifications;

            currentEmployee.save();
          });

          const updatedEmployees = await Employee.find(
            {},
            (err, currentEmployees) => {
              currentEmployees.forEach((currentEmployee) => {
                if(currentEmployee.store._id == args.store[0]._id){
                  const notificationsObj = updateNotifications(currentEmployee);
                  if (currentEmployee) {
                    currentEmployee.notifications = notificationsObj.notifications;
                    currentEmployee.save();
                  }
                }
              })
            }
          );

          updatedEmployees.forEach(async (updatedEmployee) => {
            const updatedEmployeeRes = await updatedEmployee.save();

            context.pubsub.publish(UPDATED_EMPLOYEE, {
              employee: updatedEmployeeRes,
            });
          })
        }

        const iCalEvent = new ICalendar(createEventObject(appt_res));
        const yahooCalendarEvent = new YahooCalendar(
          createEventObject(appt_res)
        );
        const googleCalendarEvent = new GoogleCalendar(
          createEventObject(appt_res)
        );
        const outlookCalendarEvent = new OutlookCalendar(
          createEventObject(appt_res)
        );

        // mjmlUtils
        //   .inject(`./emails/BookedAppointment.html`, {
        //     meetingLink: `https://meet.jit.si/${client_res._id}`,
        //     firstName:
        //       client_res.firstName[0].toUpperCase() +
        //       client_res.firstName.slice(1).toLowerCase(),
        //     date: appt_res.date,
        //     day: moment(appt_res.date, "LL").format("dddd"),
        //     startTime: appt_res.startTime + " " + appt_res.morningOrEvening,
        //     eventCalendarLink: client_res.email
        //       .toLowerCase()
        //       .includes("yahoo.com")
        //       ? yahooCalendarEvent.render()
        //       : client_res.email.toLowerCase().includes("gmail.com")
        //       ? googleCalendarEvent.render()
        //       : client_res.email.toLowerCase().includes("hotmail.com") ||
        //         client_res.email.toLowerCase().includes("outlook.com")
        //       ? outlookCalendarEvent.render()
        //       : iCalEvent.render(),
        //     consentFormLink:
        //       process.env.NODE_ENV === "production"
        //         ? `${process.env.PRODUCTION_SERVER_URL}/api/${client_res._id}/consentform`
        //         : `http://localhost:4000/api/${client_res._id}/consentform`,
        //   })
        //   .then(async (finalTemplate) => {
        //     await transporter.sendMail({
        //       from: process.env.GLOW_LABS_EMAIL,
        //       to: client_res.email,
        //       subject: "Your CHOIREDEX Appointment",
        //       html: finalTemplate,
        //     });
        //   });

        // Sends appointment confirmation text from Twilio
        // twilioTextingFunction(client_res, appt_res);

        const generateGuestConsentFormAccessToken = (client_res) => {
          const token = jwt.sign(
            {
              id: client_res._id,
              auth: true,
            },
            process.env.JWT_SECRET_KEY_ACCESS,
            { expiresIn: "7d" }
          );
          return token;
        };

        const guestConsentFormAccessToken = generateGuestConsentFormAccessToken(
          client_res
        );

        if (!adminToken) {
          // Set Guest Consent Form Cookie
          context.res.cookie(
            "guest-consent-form-access-token",
            guestConsentFormAccessToken,
            {
              maxAge: 1000 * 60 * 60 * 24 * 7,
              secure: process.env.NODE_ENV === "production" ? true : false,
              domain:
                process.env.NODE_ENV === "production"
                  ? process.env.PRODUCTION_CLIENT_ROOT
                  : "localhost",
            }
          );
        }

        return {
          ...appt_res,
          ...client_res,
          // ...updatedEmployeeRes,
          createdAt: appt_res.createdAt,
          client: {
            createdAt: client_res.createdAt,
            firstName: client_res.firstName,
            lastName: client_res.lastName,
            email: client_res.email,
            phoneNumber: client_res.phoneNumber,
            consentForm: client_res.consentForm,
          },
          isProcessed: appt_res.isProcessed,
          esthetician: appt_res.esthetician,
          date: appt_res.date,
          startTime: appt_res.startTime,
          morningOrEvening: appt_res.morningOrEvening,
          endTime: appt_res.endTime,
          duration: appt_res.duration,
          price: appt_res.price,
          isStoreSchedule: appt_res.isStoreSchedule,
          service: appt_res.service,
          store: args.store[0],
          notes: appt_res.notes,
          confirmed: appt_res.confirmed,
          _id: appt_res._id,
        };
      }

      appt_res = await appointment.save();

      const iCalEvent = new ICalendar(createEventObject(appt_res));
      const yahooCalendarEvent = new YahooCalendar(createEventObject(appt_res));
      const googleCalendarEvent = new GoogleCalendar(
        createEventObject(appt_res)
      );
      const outlookCalendarEvent = new OutlookCalendar(
        createEventObject(appt_res)
      );

      // mjmlUtils
      //   .inject(`./emails/BookedAppointment.html`, {
      //     meetingLink: `https://meet.jit.si/${client_res._id}`,
      //     firstName:
      //       args.client[0].firstName[0].toUpperCase() +
      //       args.client[0].firstName.slice(1).toLowerCase(),
      //     date: appt_res.date,
      //     day: moment(appt_res.date, "LL").format("dddd"),
      //     startTime: appt_res.startTime + " " + appt_res.morningOrEvening,
      //     eventCalendarLink: args.client[0].email
      //       .toLowerCase()
      //       .includes("yahoo.com")
      //       ? yahooCalendarEvent.render()
      //       : args.client[0].email.toLowerCase().includes("gmail.com")
      //       ? googleCalendarEvent.render()
      //       : args.client[0].email.toLowerCase().includes("hotmail.com") ||
      //         args.client[0].email.toLowerCase().includes("outlook.com")
      //       ? outlookCalendarEvent.render()
      //       : iCalEvent.render(),
      //     consentFormLink:
      //       process.env.NODE_ENV === "production"
      //         ? `${process.env.PRODUCTION_SERVER_URL}/api/${client_res._id}/consentform`
      //         : `http://localhost:4000/${client_res._id}/consentform`,
      //   })
      //   .then(async (finalTemplate) => {
      //     await transporter.sendMail({
      //       from: process.env.GLOW_LABS_EMAIL,
      //       to: client_res.email,
      //       subject: "Your CHOIREDEX Appointment",
      //       html: finalTemplate,
      //     });
      //   });

      // Sends appointment confirmation text from Twilio
      // twilioTextingFunction(args.client[0], appt_res);

      client = await Client.findOne({
        email: args.client[0].email,
      });

      const generateGuestConsentFormAccessToken = (client) => {
        const token = jwt.sign(
          {
            id: client._id,
            auth: true,
          },
          process.env.JWT_SECRET_KEY_ACCESS,
          { expiresIn: "7d" }
        );
        return token;
      };

      const guestConsentFormAccessToken = generateGuestConsentFormAccessToken(
        client
      );

      if (!adminToken) {
        // Set Guest Consent Form Cookie
        context.res.cookie(
          "guest-consent-form-access-token",
          guestConsentFormAccessToken,
          {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production" ? true : false,
            domain:
              process.env.NODE_ENV === "production"
                ? process.env.PRODUCTION_CLIENT_ROOT
                : "localhost",
          }
        );
      }

      if(args.date){
        (
          await Employee.find({
            employeeRole: "Admin",
            // firstName: {
            //   $ne: args.esthetician.split(" ")[0].toLowerCase(),
            // },
            // lastName: { $ne: args.esthetician.split(" ")[1].toLowerCase() },
          })
        ).forEach((currentEmployee) => {
          const notificationsObj = updateNotifications(currentEmployee);
          currentEmployee.notifications = notificationsObj.notifications;

          currentEmployee.save();
        });

        if(args.esthetician){
          const updatedEmployee = await Employee.findOne(
            {
              firstName: args.esthetician.split(" ")[0].trim().toLowerCase(),
              lastName: args.esthetician.split(" ")[1].trim().toLowerCase(),
            },
            (err, currentEmployee) => {
              const notificationsObj = updateNotifications(currentEmployee);
  
              if (currentEmployee) {
                currentEmployee.notifications = notificationsObj.notifications;
  
                currentEmployee.save();
              }
            }
          );
        }
        

        const updatedEmployeeRes = await updatedEmployee.save();

        context.pubsub.publish(UPDATED_EMPLOYEE, {
          employee: updatedEmployeeRes,
        });
      } else {
        (
          await Employee.find({
          })
        ).forEach((currentEmployee) => {
          if(currentEmployee.store._id !== args.store[0]._id) return;
          const notificationsObj = updateNotifications(currentEmployee);
          currentEmployee.notifications = notificationsObj.notifications;

          currentEmployee.save();
        });

        const updatedEmployees = await Employee.find(
          {},
          (err, currentEmployees) => {
            currentEmployees.forEach((currentEmployee) => {
              if(currentEmployee.store._id == args.store[0]._id){
                const notificationsObj = updateNotifications(currentEmployee);
                if (currentEmployee) {
                  currentEmployee.notifications = notificationsObj.notifications;
                  currentEmployee.save();
                }
              }
            })
          }
        );

        updatedEmployees.forEach(async (updatedEmployee) => {
          const updatedEmployeeRes = await updatedEmployee.save();

          context.pubsub.publish(UPDATED_EMPLOYEE, {
            employee: updatedEmployeeRes,
          });
        })
      }

      return {
        ...appt_res,
        // ...updatedEmployeeRes,
        ...client,
        createdAt: appt_res.createdAt,
        client: {
          createdAt: client.createdAt,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phoneNumber: client.phoneNumber,
          consentForm: client.consentForm,
        },
        esthetician: appt_res.esthetician,
        isProcessed: appt_res.isProcessed,
        date: appt_res.date,
        startTime: appt_res.startTime,
        morningOrEvening: appt_res.morningOrEvening,
        endTime: appt_res.endTime,
        duration: appt_res.duration,
        price: appt_res.price,
        isStoreSchedule: appt_res.isStoreSchedule,
        service: appt_res.service,
        store: args.store[0],
        notes: appt_res.notes,
        confirmed: appt_res.confirmed,
        _id: appt_res._id,
      };
    }
    
    // foundClient exist
    client = await Client.findOne({
      email: args.client[0].email,
    });

    const oldAppointments = await Appointment.find({});

    const oldClientOwnAppointments = oldAppointments.filter((item) => {
      return (item.client._id.toString() == foundClient._id.toString()) && item.date !== ""
    }
    );


    // if(args.isStoreSchedule && oldClientOwnAppointments.length){
    //   await Appointment.findOneAndUpdate(
    //     {_id: oldClientOwnAppointments[0]._id},
    //     {
    //       isProcessed: true,
    //     }
    //   )

    //   appointment.date = oldClientOwnAppointments[0].date;
    //   appointment.startTime = oldClientOwnAppointments[0].startTime;
    //   appointment.morningOrEvening = oldClientOwnAppointments[0].morningOrEvening;
    //   appointment.endTime = oldClientOwnAppointments[0].endTime;
    //   appointment.isStoreSchedule = true;
    //   appointment.isProcessed = false;
    //   appointment.confirmed = false;
    
    //   newNotification.date = oldClientOwnAppointments[0].date;
    //   newNotification.time = oldClientOwnAppointments[0].startTime + " " + oldClientOwnAppointments[0].morningOrEvening;
    //   newNotification.isStoreSchedule = true;

    // }
    appt_res = await appointment.save();
      

    const iCalEvent = new ICalendar(createEventObject(appt_res));
    const yahooCalendarEvent = new YahooCalendar(createEventObject(appt_res));
    const googleCalendarEvent = new GoogleCalendar(createEventObject(appt_res));
    const outlookCalendarEvent = new OutlookCalendar(
      createEventObject(appt_res)
    );

    // try {
    //   mjmlUtils
    //     .inject(`./emails/BookedAppointment.html`, {
    //       meetingLink: `https://meet.jit.si/${client._id}`,
    //       firstName:
    //         args.client[0].firstName[0].toUpperCase() +
    //         args.client[0].firstName.slice(1).toLowerCase(),
    //       date: appt_res.date,
    //       day: moment(appt_res.date, "LL").format("dddd"),
    //       startTime: appt_res.startTime + " " + appt_res.morningOrEvening,
    //       eventCalendarLink: args.client[0].email
    //         .toLowerCase()
    //         .includes("yahoo.com")
    //         ? yahooCalendarEvent.render()
    //         : args.client[0].email.toLowerCase().includes("gmail.com")
    //         ? googleCalendarEvent.render()
    //         : args.client[0].email.toLowerCase().includes("hotmail.com") ||
    //           args.client[0].email.toLowerCase().includes("outlook.com")
    //         ? outlookCalendarEvent.render()
    //         : iCalEvent.render(),
    //       consentFormLink:
    //         process.env.NODE_ENV === "production"
    //           ? `${process.env.PRODUCTION_SERVER_URL}/api/${client._id}/consentform`
    //           : `http://localhost:4000/${client._id}/consentform`,
    //     })
    //     .then(async (finalTemplate) => {
    //       await transporter.sendMail({
    //         from:  process.env.GLOW_LABS_EMAIL,
    //         to: client.email,
    //         subject: "Your CHOIREDEX Appointment",
    //         html: finalTemplate,
    //       });
    //     });
    // } catch (err) {
    //   console.log("error:::::::::::::::::::::::::::::::::::", err);
    // }

    // // Sends appointment confirmation text from Twilio
    // twilioTextingFunction(args.client[0], appt_res);

    if(args.date){
      (
        await Employee.find({
          employeeRole: "Admin",
          // firstName: {
          //   $ne: args.esthetician.split(" ")[0].toLowerCase(),
          // },
          // lastName: { $ne: args.esthetician.split(" ")[1].toLowerCase() },
        })
      ).forEach((currentEmployee) => {
        const notificationsObj = updateNotifications(currentEmployee);
        currentEmployee.notifications = notificationsObj.notifications;

        currentEmployee.save();
      });

      if(args.esthetician){
        const updatedEmployee = await Employee.findOne(
          {
            firstName: args.esthetician.split(" ")[0].trim().toLowerCase(),
            lastName: args.esthetician.split(" ")[1].trim().toLowerCase(),
          },
          (err, currentEmployee) => {
            const notificationsObj = updateNotifications(currentEmployee);
  
            if (currentEmployee) {
              currentEmployee.notifications = notificationsObj.notifications;
  
              currentEmployee.save();
            }
          }
        );
      }
      

      const updatedEmployeeRes = await updatedEmployee.save();

      context.pubsub.publish(UPDATED_EMPLOYEE, {
        employee: updatedEmployeeRes,
      });
    } else {
      (
        await Employee.find({
        })
      ).forEach((currentEmployee) => {
        if(currentEmployee.store._id !== args.store[0]._id) return;
        const notificationsObj = updateNotifications(currentEmployee);
        currentEmployee.notifications = notificationsObj.notifications;

        currentEmployee.save();
      });

      const updatedEmployees = await Employee.find(
        {},
        (err, currentEmployees) => {
          currentEmployees.forEach((currentEmployee) => {
            if(currentEmployee.store._id == args.store[0]._id){
              const notificationsObj = updateNotifications(currentEmployee);
              if (currentEmployee) {
                currentEmployee.notifications = notificationsObj.notifications;
                currentEmployee.save();
              }
            }
          })
        }
      );

      updatedEmployees.forEach(async (updatedEmployee) => {
        const updatedEmployeeRes = await updatedEmployee.save();

        context.pubsub.publish(UPDATED_EMPLOYEE, {
          employee: updatedEmployeeRes,
        });
      })
    }

    return {
      ...appt_res,
      ...client,
      createdAt: appt_res.createdAt,
      esthetician: appt_res.esthetician,
      isProcessed: appt_res.isProcessed,
      client: {
        createdAt: client.createdAt,
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phoneNumber: client.phoneNumber,
        consentForm: client.consentForm,
      },
      date: appt_res.date,
      startTime: appt_res.startTime,
      morningOrEvening: appt_res.morningOrEvening,
      endTime: appt_res.endTime,
      duration: appt_res.duration,
      price: appt_res.price,
      isStoreSchedule: appt_res.isStoreSchedule,
      service: appt_res.service,
      store: args.store[0],
      notes: appt_res.notes,
      confirmed: appt_res.confirmed,
      _id: appt_res._id,
    };
  },
};

module.exports = addAppointmentMutation;
