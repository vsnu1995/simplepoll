import Hapi from '@hapi/hapi';
import mongoose from 'mongoose';
import Joi from 'joi';
require('./db');
import User, { returnUser } from './schemas/user';
import Poll, { IPollDocument, IPollPayload } from './schemas/poll';
import Response, { IResponseDocument } from './schemas/response';

const init = async () => {
  const server: Hapi.Server = new Hapi.Server({
    port: 3000,
    host: 'localhost',
  });

  server.validator(require('joi'));

  server.route({
    method: 'GET',
    path: '/polls',
    handler: async (request: Hapi.Request) => {
      const user = await returnUser(request);

      const polls = await Poll.find({ creatorId: user?._id }).exec();

      return {
        status: 'success',
        data: {
          polls: polls,
          user,
        },
      };
    },
  });

  server.route({
    method: 'GET',
    path: '/polls/{id}',
    handler: async (request: Hapi.Request) => {
      const pollId = request.params.id;

      let poll: IPollDocument | null = null;

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

      const user = await returnUser(request);
      const userResponse = await Response.findOne({
        pollId,
        userId: user._id,
      }).exec();

      return {
        status: 'success',
        data: {
          poll,
          userResponse,
          user,
        },
      };
    },
  });

  server.route({
    method: 'POST',
    path: '/responses/{pollId}',
    options: {
      validate: {
        payload: {
          responseIndexes: Joi.array().items(Joi.number()),
        },
      },
    },
    handler: async (request: Hapi.Request) => {
      const pollId = request.params.pollId;

      let poll: IPollDocument | null = null;

      if (pollId && mongoose.isValidObjectId(pollId)) {
        poll = await Poll.findById(pollId).exec();
      }

      const user = await returnUser(request);

      const userResponse = await Response.findOne({
        pollId,
        userId: user._id,
      }).exec();

      return {
        status: 'success',
        data: {
          poll,
          userResponse,
          user,
        },
      };
    },
  });

  server.route({
    method: 'POST',
    path: '/polls/create',
    options: {
      validate: {
        payload: {
          question: Joi.string().min(1).max(2048),
          options: Joi.array().items(Joi.string().min(1).max(2048)),
          multiSelect: Joi.boolean(),
          optionsAddable: Joi.boolean(),
        },
      },
    },
    handler: async (request: Hapi.Request) => {
      const pollObj = <IPollPayload>request.payload;

      const user = await returnUser(request);

      const poll = new Poll({
        question: pollObj.question,
        options: pollObj.options,
        multiSelect: pollObj.multiSelect,
        optionsAddable: pollObj.optionsAddable,
        creatorId: user._id,
      });

      await poll.save();

      return {
        status: 'success',
        data: {
          poll: poll,
          user: user,
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
