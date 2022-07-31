const { Lifetime, createContainer, asValue, asClass } = require('awilix');

const { mongoDb } = require('./mongoDb');
const { sendEmail } = require('./mailer');
const { queueBackgroundJobs } = require('./bull');

/**
 * It creates a container, registers some dependencies, and then loads all the files in the repository
 * and service directories
 * @returns A function that returns a container.
 */
const Container = () => {
  const container = createContainer();

  container.register('mongoDb', asValue(mongoDb));
  container.register('sendEmail', asValue(sendEmail));
  container.register('queueBackgroundJobs', asValue(queueBackgroundJobs));

  const options = {
    cwd: __dirname,
    formatName: (_, descriptor) => {
      const path = descriptor.path.split('/');
      const className = path[path.length - 2];
      let classType = path[path.length - 3];
      classType = classType.charAt(0).toUpperCase() + classType.substring(1);
      return className + classType;
    },
    resolverOptions: {
      register: asClass,
      lifetime: Lifetime.SINGLETON,
    },
  };

  container.loadModules(['../repository/*/index.js', '../service/*/index.js'], options);

  return container;
};

module.exports = { container: Container() };
