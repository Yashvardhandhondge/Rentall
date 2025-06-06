import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType,
  GraphQLInt as IntType,
  GraphQLList as List,
} from 'graphql';

const DateAvailability = new ObjectType({
  name: 'DateAvailability',
  fields: {
    blockedDates: {
      type: new List(StringType),
      resolve(blockedDate) {
        return blockedDate;
      }
    },
    status: { type: IntType },
  },
});

const DateAvailabilityType = new ObjectType({
  name: 'DateAvailabilityType',
  fields: {
    results: { type: new List(DateAvailability) },
    status: { type: IntType },
    errorMessage: { type: StringType }
  },
});

export default DateAvailabilityType;
