# decorate-gh-pr

[![CircleCI Status](https://circleci.com/gh/Xiphe/decorate-gh-pr/tree/main.svg?style=shield)](https://app.circleci.com/pipelines/github/Xiphe/decorate-gh-pr?branch=main)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![semantish-prerelease](https://img.shields.io/badge/%F0%9F%93%A6%F0%9F%9B%B8-semantish--prerelease-d86b86.svg)](https://github.com/Xiphe/semantish-prerelease)

append updatable text to the description of a pull request on GitHub.

## Usage

All usages require a `GITHUB_TOKEN` or `GH_TOKEN` environment variable with write access to the PR.

When invoked multiple times with same `id` the previous text will be overwritten.

### CLI

`npx decorate-gh-pr -h`

```bash
decorate-gh-pr [flags]

decorate a GitHub Pull request

Options:

  -f, --file     JavaScript file producing a Promise resolving to comment
  -c, --comment  The comment
  -r, --prepend  (Optional) Prepend new comments to the PR body
                 Default: false - comment is appended at the end
  -m, --compact  (Optional) Minimize added new-lines and whitespace
                 Default: false - new comments are added in a new line
  -i, --id       (Optional) Custom Identifier for the comment
                 Default: "decorate-gh-pr"
  -p, --pr       (Optional) PR identifier. Example: Xiphe/decorate-gh-pr#1
                 Default: CI environment from env-ci package
  -h, --help     Print this message
```

### Lib

`npm install decorate-gh-pr`

```js
const decorateGhPr = require(' decorate-gh-pr');
const envCi = require('env-ci');

decorateGhPr({
  comment: 'Hello PR',
  /* OPTIONAL: */
  id: 'decorate-gh-pr',
  prepend: false,
  env: envCi(),
  compact: false,
}).catch((err) => {
  /* handle error */
});
```

### With semantic-release

`npm install decorate-gh-pr`

```js
// release.config.js
module.exports = {
  plugins: [
    [
      "decorate-gh-pr/on-release",
      {
        /* uses https://lodash.com/docs/4.17.15#template */
        comment: 'Hello <%= version %> on <% print(date.toISOString()) %>'
        /* OPTIONAL: */
        compact: false,
        prepend: false,
        id: 'decorate-gh-pr',
      }
    ],
  ]
};
```

`comment` can either be a string, or function. `CommentProps` are available as
variables in lodash template string or passed as argument.

```ts
type CommentProps = {
  name: string;
  type: string;
  version: string;
  gitHead: string;
  gitTag: string;
  channel?: string;
  /* Normal Date Object with argumented format() method from 
     https://www.npmjs.com/package/date-and-time */
  date: Date & { format: (format: string) => string };
};
```

## License

> The MIT License
>
> Copyright (C) 2021 Hannes Diercks
>
> Permission is hereby granted, free of charge, to any person obtaining a copy of
> this software and associated documentation files (the "Software"), to deal in
> the Software without restriction, including without limitation the rights to
> use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
> of the Software, and to permit persons to whom the Software is furnished to do
> so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
> FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
> COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
> IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
> CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
