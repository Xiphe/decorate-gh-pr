// release.config.js
const isStable = !process.env.PRE_RELEASE;

console.log('ENV CI', require('env-ci')());
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    !isStable && [
      './on-release',
      {
        prepend: true,
        id: 'foo-bar',
        comment:
          '<date>(<% print(date.toISOString()) %>)</date> Pre-released<br /><code>npm install <%= version %></code><hr />',
      },
    ],
    isStable && '@semantic-release/github',
  ].filter(Boolean),
};
