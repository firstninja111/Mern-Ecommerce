const graphql = require("graphql");
const ServiceType = require("../types/ServiceType");
const Service = require("../../models/service");
const Store = require("../../models/store");
const Employee = require("../../models/employee");
const { UserInputError } = require("apollo-server");

const { GraphQLString, GraphQLInt, GraphQLID } = graphql;

const updateServiceMutation = {
  type: ServiceType,
  args: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLInt },
    image: { type: GraphQLString },
  },
  async resolve(parent, args, context) {
    const adminAccessToken = context.cookies["admin-access-token"];

    if (!adminAccessToken) {
      throw new UserInputError("Admin is not authenticated.");
    } else {
      const oldService = await Service.findOne({ _id: args._id });

      const service = await Service.findOneAndUpdate(
        {
          _id: args._id,
        },
        { 
          name: args.name,
          description: args.description,
         },
        {
          new: true,
        }
      );
      const res = await service.save();

      // update store and employee with this service
      const allStores = await Store.find({});
      const allEmployees = await Employee.find({});
      allStores.forEach(async (store) => {
        if(store.availableServices.includes(oldService.name)){
          var serviceList = store.availableServices;
          serviceList.map((item, i) => {
            if(item == oldService.name) serviceList[i] = args.name;
          })
          const currentStore = await Store.findOneAndUpdate(
            {
              _id: store._id,
            },
            { 
              availableServices: serviceList,
            },
            {
              new: true,
            }
          );
          const storeRes = await currentStore.save();

          const updatedStore = {
            _id: storeRes._id,
            name: storeRes.name.trim(),
            address: storeRes.address.trim(),
            coordinateLat: storeRes.coordinateLat,
            coordinateLng: storeRes.coordinateLng,
            city: storeRes.city.trim(),
            country: storeRes.country.trim(),
            phone: storeRes.phone,
            email: storeRes.email,
            website: storeRes.website.trim(),
            timezone: storeRes.timezone.trim(),
            availableServices: serviceList,
          };

          // employee store update
          allEmployees.forEach(async (employee) => {
            if(employee.store._id.toString() == updatedStore._id.toString()){
              const currentEmployee = await Employee.findOneAndUpdate(
                {
                  _id: employee._id,
                },
                { 
                  store: updatedStore
                },
                {
                  new: true,
                }
              );
              currentEmployee.save();
            }
          })
        }
      })


      return {
        ...res,
        _id: service._id,
        name: service.name,
        description: service.description,
      };
    }
  },
};
module.exports = updateServiceMutation;
