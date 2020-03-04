#!/usr/bin/env node

const minimist = require('minimist');
const path = require('path');
const decorateGhPR = require('./index');

const argv = minimist(process.argv.slice(2), {
  alias: {
    f: 'file',
    h: 'help',
    c: 'comment',
    m: 'compact',
    i: 'id',
    p: 'pr',
    r: 'prepend',
  },
});

let exit = 0;

if (!argv.file && !argv.comment) {
  console.error('Warning! can not update a PR with no content\n');
  exit = 1;
  argv.help = true;
}

if (argv.help) {
  console.log(
    [
      'decorate-gh-pr [flags]',
      '',
      'decorate a GitHub Pull request',
      '',
      'Options:',
      '',
      '  -f, --file     JavaScript file producing a Promise resolving to comment',
      '  -c, --comment  The comment',
      '  -r, --prepend  (Optional) Prepend new comments to the PR body',
      '                 Default: false - comment is appended at the end',
      '  -m, --compact  (Optional) Minimize added new-lines and whitespace',
      '                 Default: false - new comments are added in a new line',
      '  -i, --id       (Optional) Custom Identifier for the comment',
      '                 Default: "decorate-gh-pr"',
      '  -p, --pr       (Optional) PR identifier. Example: Xiphe/decorate-gh-pr#1',
      '                 Default: CI environment from env-ci package',
      '  -h, --help     Print this message',
    ].join('\n'),
  );
  process.exit(exit);
}

const config = {
  comment: argv.file
    ? /* eslint-disable-next-line import/no-dynamic-require, global-require */
      require(path.resolve(process.cwd(), argv.file))()
    : argv.comment,
  prepend: argv.prepend,
  compact: argv.compact,
  env: argv.pr
    ? {
        isPr: true,
        slug: argv.pr.split('#')[0].trim(),
        pr: parseInt(argv.pr.split('#')[1].trim(), 10),
      }
    : undefined,
  id: argv.id && argv.id.length ? argv.id : undefined,
};
decorateGhPR(config).then(
  () => console.log('OK'),
  (err) => {
    console.error(err);
    process.exit(err.code || 1);
  },
);
