# node-nakiri

[![npm version](https://img.shields.io/npm/v/node-nakiri.svg?style=flat)](https://www.npmjs.com/package/node-nakiri)

Node.js API client for [Nakiri](https://github.com/jozsefsallai/nakiri).

## Getting Started

Before you jump straight into the code, you will need to get an API key for the
Nakiri group you want to use the library with. To do this, head over to
[Nakiri][nakiri-dashboard] (or whatever instance you want to use) and copy the
API key of the group.

You may also want to take note of the group's ID to pass it as a parameter to
the client's options.

**1. Install the package**

```sh
npm i node-nakiri
# or
yarn add node-nakiri
```

**2. Import the client**

```js
import { Client } from 'node-nakiri';
// or
const { Client } = require('node-nakiri');
```

**3. Set up your event listeners and log in**

```js
const client = new Client();

client.on('ready', () => {
  console.log('Boom, baby!');
});

client.on('error', (err) => {
  mylogger.error('Oh no!', err);
});

client.on('entryAdded', (data) => {
  console.log('New entry!', data.value);
});

client.on('entryRemoved', (data) => {
  console.log('RIP entry...', data.value);
});

await client.login('YOUR_NAKIRI_API_KEY');
```

A more detailed API documentation can be found in the [library docs][docs-page].

## License

MIT.

[nakiri-dashboard]: https://nakiri.one/manage
[docs-page]: https://jozsefsallai.github.io/node-nakiri
