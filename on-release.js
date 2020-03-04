const getEnvCi = require('env-ci');
const template = require('lodash.template');
const decorateGhPr = require('./index');

function resolveComment(comment, args) {
  switch (typeof comment) {
    case 'string':
      return template(comment)(args);
    case 'function':
      return comment(args);
    default:
      return `released ${args.name}`;
  }
}

module.exports = {
  async publish(pluginConfig, { cwd, env, logger, nextRelease }) {
    const envCi = getEnvCi({ cwd, env });

    if (!envCi.isPr) {
      logger.log('Skipping PR decoration since no PR was found');
      return;
    }

    const { pr, comment } = await decorateGhPr({
      comment: resolveComment(pluginConfig.comment, {
        ...nextRelease,
        date: new Date(),
      }),
      compact: pluginConfig.compact,
      prepend: pluginConfig.prepend,
      id: pluginConfig.id,
      env: envCi,
    });

    logger.success(`Updated ${pr}: ${comment}`);
  },
};
