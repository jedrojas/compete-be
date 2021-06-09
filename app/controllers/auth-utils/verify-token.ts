import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

import { IDecodedJwt } from './models';

export const client = jwksClient({
  jwksUri: "https://dev-k8hhju21.us.auth0.com/.well-known/jwks.json",
});

export const getKey = async (header: any, callback: any) => {
  await client
    .getSigningKey(header.kid)
    .then((sk) => {
      const pubKey = sk.getPublicKey();
      callback(null, pubKey);
    })
    .catch((e) => {
      console.log("--error--", e);
    });
};

export const verifyToken = (accessToken: string) => {
  return new Promise<IDecodedJwt>(async (resolve, reject) => {
    try {
      jwt.verify(accessToken, getKey, undefined, (err, decoded) => {
        if (err) {
          throw err;
        }
        resolve(decoded as IDecodedJwt);
      });
    } catch (err) {
      reject(err);
    }
  });
};
