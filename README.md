# split-ca

Simple node.js module to split a single certificate authority chain file (bundle, ca-bundle, ca-chain, etc.) into an array, as expected by the node.js tls api

## Installation

`npm install split-ca`

## Usage

Usage will depend on your server module of choice, but most https modules require an options hash with `ca`, `key`, and `cert`. If you have a file containing a certificate bundle, you can use the `splitFileSync` function to read the bundle and split it into an Array:

```js
const https = require('https');
const fs = require('fs');

const { splitFileSync } = require('split-ca');

const options = {
  ca: splitFileSync("path/to/ca_bundle_file"),
  key:fs.readFileSync("path/to/server_key_file"),
  cert:fs.readFileSync("path/to/server_cert_file"),
  requestCert: true,
  rejectUnauthorized: true
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);
```

Non-synchronous version:

```js
const https = require('https');
const fs = require('fs');
const { splitFile } = require('split-ca');

async function startServer() {
  const ca = await splitFile("path/to/ca_bundle_file");

  const options = {
    ca,
    key:fs.readFileSync("path/to/server_key_file"),
    cert:fs.readFileSync("path/to/server_cert_file"),
    requestCert: true,
    rejectUnauthorized: true
  };

  https.createServer(options, function (req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(8000);
}
```

Version if your bundle is in a string rather than a file:

```js
const https = require('https');
const fs = require('fs');
const { splitContent } = require('split-ca');

const options = {
  ca: splitContent(process.env.CA),
  key:fs.readFileSync("path/to/server_key_file"),
  cert:fs.readFileSync("path/to/server_cert_file"),
  requestCert: true,
  rejectUnauthorized: true
};

https.createServer(options, function (req, res) {
  res.writeHead(200);
  res.end("hello world\n");
}).listen(8000);
```

## Args

This module exports three functions:

```
splitFile(filepath, splitString, encoding)
splitFileSync(filepath, splitString, encoding)
splitContent(content, splitString)
```

#### `filepath`

A standard node path to your object.  An error is thrown if the file cannot be parsed, is not formatted properly.

#### `splitString`

Optional.  Defaults to `"\n"`, can be replaced with anything.

#### `encoding`

Optional.  Defaults to `"utf-8"`, can be replaced with anything accepted by node's `fs` module.

#### `content`

PEM-encoded certificate bundle string.

## Credits

Thanks to [Benjie Gillam](https://twitter.com/Benjie) for the [blog post and sample code](http://www.benjiegillam.com/2012/06/node-dot-js-ssl-certificate-chain/) that was unashamedly ripped for this module.
