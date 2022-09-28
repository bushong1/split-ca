const fs = require('fs');

function splitFileSync(filepath, split = "\n", encoding = "utf8") {
  const chain = fs.readFileSync(filepath, encoding);
  return splitContent(chain, split);
}

async function splitFile(filepath, split = "\n", encoding = "utf8") {
  const chain = await fs.promises.readFile(filepath, encoding);
  return splitContent(chain, split);
}

function splitContent(chain, split = "\n") {
  const ca = [];
  if (chain.indexOf("-END CERTIFICATE-") < 0 || chain.indexOf("-BEGIN CERTIFICATE-") < 0) {
    throw Error("File does not contain 'BEGIN CERTIFICATE' or 'END CERTIFICATE'");
  }
  chain = chain.split(split);
  let cert = [];
  for (const line of chain) {
    if (!(line.length !== 0)) {
      continue;
    }
    cert.push(line);
    if (line.match(/-END CERTIFICATE-/)) {
      ca.push(cert.join(split));
      cert = [];
    }
  }
  return ca;
}

module.exports = splitFileSync;

module.exports.splitFile = splitFile;
module.exports.splitFileSync = splitFileSync;
module.exports.splitContent = splitContent;
