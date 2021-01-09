import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
require('./db');
import User from './schemas/user';
import Poll, { PollDocument } from './schemas/poll';
import Response, { ResponseDocument } from './schemas/response';

const init = async () => {
  const server: Hapi.Server = new Hapi.Server({
    port: 3000,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/polls',
    handler: async (request: Hapi.Request) => {
      const userId = request.headers['user-id'];

      if (userId && mongoose.isValidObjectId(userId)) {
        const user = await User.findById(userId).exec();

        if (
          user &&
          user.userAgent === request.headers['user-agent']
        ) {
          const polls = await Poll.find({ creatorId: userId }).exec();

          return {
            status: 'success',
            data: {
              polls,
              userId: user._id,
            },
          };
        }
      }

      const user = await User.create({
        userAgent: request.headers['user-agent'],
        ipAddress: request.info.remoteAddress,
      });

      return {
        status: 'success',
        data: {
          polls: [],
          userId: user._id,
        },
      };
    },
  });

  server.route({
    method: 'GET',
    path: '/polls/{id}',
    handler: async (request: Hapi.Request) => {
      const pollId = request.params.id;
      const userId = request.headers['user-id'];

      let poll: PollDocument | null = null;

      if (pollId && mongoose.isValidObjectId(pollId)) {
        poll = await Poll.findById(pollId).exec();
      }

      if (!poll) {
        return {
          status: 'failed',
          data: {
            poll,
          },
        };
      }

      let userResponse: ResponseDocument | null = null;

      if (userId && mongoose.isValidObjectId(userId)) {
        userResponse = await Response.findOne({
          pollId,
          userId,
        }).exec();
      }

      return {
        status: 'success',
        data: {
          poll,
          userResponse,
        },
      };
    },
  });

  server.route({
    method: 'POST',
    path: '/polls/create',
    handler: async (request: Hapi.Request) => {
      const userId = request.headers['user-agent'];

      if (userId && mongoose.isValidObjectId(userId)) {
        const user = await User.findById(userId).exec();

        if (
          user &&
          user.userAgent === request.headers['user-agent']
        ) {
          const polls = await Poll.find({ creatorId: userId }).exec();

          return {
            status: 'success',
            data: {
              polls,
              userId: user._id,
            },
          };
        }
      }

      const user = await User.create({
        userAgent: request.headers['user-agent'],
        ipAddress: request.info.remoteAddress,
      });

      return {
        status: 'success',
        data: {
          polls: [],
          userId: user._id,
        },
      };
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
