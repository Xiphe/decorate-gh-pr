const envCi = require('env-ci');
const tmpOct = require('@octokit/rest');
const { name: pkgName, version: pkgVersion } = require('./package.json');

const Octokit = tmpOct.Octokit || tmpOct;

module.exports = async function decorateGhPr({
  comment,
  id = 'decorate-gh-pr',
  prepend = false,
  env = envCi(),
  compact = false,
}) {
  if (!env.isCi) {
    throw new Error('Must run in CI');
  }
  if (
    env.name === 'Bamboo' ||
    env.name === 'Bitbucket Pipelines' ||
    env.name === 'AWS CodeBuild' ||
    env.name === 'Codeship' ||
    env.name === 'GitLab CI/CD' ||
    env.name === 'TeamCity' ||
    env.name === 'Jenkins' ||
    env.name === 'Visual Studio Team Services' ||
    env.name === 'Wercker'
  ) {
    throw new Error(`${env.name} CI is not supported`);
  }
  if (!env.isPr) {
    throw new Error('Can not decorate a non-existent PR');
  }

  const [owner, repo] = env.slug.split('/');

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
    userAgent: `${pkgName} v${pkgVersion}`,
  });

  /** @type {number} */
  const pull_number = parseInt(/** @type {any} */ (env.pr), 10);
  const {
    data: { body: existingBody },
  } = await octokit.pulls.get({
    owner,
    repo,
    pull_number,
  });

  const body = existingBody || '';
  const hasComment = body.match(
    new RegExp(`<!-- ${id} -->(.|\n|\r)*<!-- /${id} -->`, 'gm'),
  );

  const newComment = [`<!-- ${id} -->`, await comment, `<!-- /${id} -->`].join(
    compact ? '' : '\n',
  );

  const inserted = prepend
    ? `${newComment}${compact ? ' ' : '\n\n'}${body}`
    : `${body}${compact ? ' ' : '\n\n'}${newComment}`;
  const newBody = hasComment
    ? body.replace(
        new RegExp(`<!-- ${id} -->(.|\n|\r)*<!-- /${id} -->`, 'gm'),
        newComment,
      )
    : inserted;

  await octokit.pulls.update({
    owner,
    repo,
    pull_number,
    body: newBody,
  });

  return {
    pr: `${owner}/${repo}#${env.pr}`,
    comment: await comment,
  };
};
