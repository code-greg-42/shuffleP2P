import { Buffer } from 'buffer';
const secp = require('@noble/secp256k1');
const { keccak_256 } = require('@noble/hashes/sha3');
const { bytesToHex } = require('@noble/hashes/utils');

export const incomingMessage = async (ipfs, cid, signingPub) => {
    let response = ipfs.cat(cid);
    let content = [];
    for await (const chunk of response) {
      content = [...content, ...chunk];
    };
    const ipfsRaw = Buffer.from(content).toString('utf8');
    console.log(ipfsRaw);
    const ipfsObj = JSON.parse(ipfsRaw);
    console.log(ipfsObj);
    const {ipfsSignature} = ipfsObj.hands[0].moves[0];
    console.log(ipfsSignature);
    delete ipfsObj.hands[0].moves[0].ipfsSignature;
    console.log(ipfsObj);
    console.log(signingPub);
    let hashedObj = bytesToHex(keccak_256(JSON.stringify(ipfsObj)));
    console.log(hashedObj);
    const isVerified = secp.verify(ipfsSignature, hashedObj, signingPub);
    console.log(isVerified);
}