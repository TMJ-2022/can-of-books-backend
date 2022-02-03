const jwt = require('jsonwebtoken'); 
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: process.env.JWKS_URI
});

function getKey(header, callback){
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyUser(request, errOrUserCallback) {

  try {
    const token = request.headers.authorization.split(' ')[1];
    // this console allows me to grab the token so I can use it to test it in ThunderClient
    // make a request from the client-side, get my token back, then test it in ThunderClient
    console.log(token);
    // we get .verify from jwt - it verifies the user 
    jwt.verify(token, getKey, {}, errOrUserCallback);
  } catch (error) {
    errOrUserCallback('Not Authorized');
  }
}

module.exports = verifyUser

