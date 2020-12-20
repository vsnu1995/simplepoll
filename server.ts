import Hapi from '@hapi/hapi';
require('./db');
import User from './schemas/user';

const init = async () => {
  const server: Hapi.Server = new Hapi.Server({
    port: 3000,
    host: 'localhost',
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: async (request: Hapi.Request) => {
      const user = await User.create({
        userAgent: request.headers['user-agent'],
        ipAddress: request.info.remoteAddress,
      });
      return user._id;
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
