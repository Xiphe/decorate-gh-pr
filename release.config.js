// release.config.js
const isStable = !process.env.PRE_RELEASE;

module.exports = {
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'next',
    'next-major',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
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
          "Pre-released on <date><% print(date.format('YYYY/MM/DD HH:mm:ss')) %></date><br /><code>npm install decorate-gh-pr@<%= version %></code><hr />",
      },
    ],
    isStable && '@semantic-release/github',
  ].filter(Boolean),
};
