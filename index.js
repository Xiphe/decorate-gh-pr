const envCi = require('env-ci');
const tmpOct = require('@octokit/rest');
const { name: pkgName, version: pkgVersion } = require('./package.json');

const Octokit = tmpOct.Octokit || tmpOct;

module.exports = async function decorateGhPr({
  comment,
  id = 'decorate-gh-pr',
  prepend = false,
  env = envCi(),
}) {
  if (!env.isPr) {
    throw new Error('Can not decorate a non-existent PR');
  }

  const [owner, repo] = env.slug.split('/');

  const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
    userAgent: `${pkgName} v${pkgVersion}`,
  });

  const {
    data: { body },
  } = await octokit.pulls.get({
    owner,
    repo,
    pull_number: env.pr,
  });

  const hasComment = body.match(
    new RegExp(`<!-- ${id} -->(.|\n|\r)*<!-- /${id} -->`, 'gm'),
  );

  const newComment = [`<!-- ${id} -->`, await comment, `<!-- /${id} -->`].join(
    '\n',
  );

  const inserted = prepend
    ? `${newComment}\n\n${body}`
    : `${body}\n\n${newComment}`;
  const newBody = hasComment
    ? body.replace(
        new RegExp(`<!-- ${id} -->(.|\n|\r)*<!-- /${id} -->`, 'gm'),
        newComment,
      )
    : inserted;

  await octokit.pulls.update({
    owner,
    repo,
    pull_number: env.pr,
    body: newBody,
  });

  return {
    pr: `${owner}/${repo}#${env.pr}`,
    comment: await comment,
  };
};
