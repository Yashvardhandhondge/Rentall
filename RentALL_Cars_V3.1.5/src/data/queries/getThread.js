import {
  GraphQLString as StringType,
  GraphQLInt as IntType,
} from 'graphql';
import { Threads } from '../../data/models';
import ThreadsType from '../types/ThreadsType';

const getThread = {

  type: ThreadsType,

  args: {
    threadType: { type: StringType },
    threadId: { type: IntType },
  },

  async resolve({ request }, { threadType, threadId }) {
    // Check if user already logged in
    if (request?.user || request?.user?.admin) {
      let where = {};

      if (!request?.user?.admin) {

        // For Getting Specific type of threads of a logged in user(Either 'host' or 'guest')
        if (threadType === 'owner') {
          where = {
            host: request?.user?.id
          }
        } else {
          where = {
            guest: request?.user?.id
          }
        }
      }
      // For Getting Specific Thread
      if (threadId != undefined && threadId != null) {
        where = Object.assign({}, where, { id: threadId });
      }

      return await Threads.findOne({ where });

    } else {
      return {
        status: "notLoggedIn",
      };
    }
  }
};

export default getThread;

/**
query getThread($threadType: String, $threadId: Int){
  getThread(threadType: $threadType, threadId: $threadId) {
    id
    listId
    guest
    listData {
      title
      city
      state
      country
      listingData {
        basePrice
        delivery
        currency
      }
    }
    threadItemForType {
      id
      threadId
      content
      sentBy
      type
      startDate
      endDate
      createdAt
    }
    guestProfile {
      profileId
      firstName
      picture
      location
    }
    hostProfile {
      profileId
      firstName
      picture
      location
    }
    status
  }
}
**/