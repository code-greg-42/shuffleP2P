import * as IPFS from 'ipfs-core';
import { Buffer } from 'buffer';
const secp = require('@noble/secp256k1');
const { keccak_256 } = require('@noble/hashes/sha3');
const { bytesToHex } = require('@noble/hashes/utils');

const testPicks = [12, 2, 11, 2];
const testPw = ['grandersson'];

export const testSend = async (myAddress, setCurrCid, setIpfsInst, setSigningPub) => {
    const ipfs = await IPFS.create();
    let hashedSelection = bytesToHex(keccak_256(JSON.stringify(testPicks) + testPw));
    console.log(hashedSelection);
    let cardLedger = {
        firstPlayer: myAddress,
        secondPlayer: "0x000",
        depositAmount: 100,
        hands: [{
            hand: 1,
            startingStacks: {
                [myAddress]: 100,
            },
            startingCards: {
                [myAddress]: hashedSelection,
            },
            moves: [
                {
                    player: myAddress,
                    street: 0,
                    firstToAct: true,
                    closingAction: false,
                    betAmount: 2.5,
                },
            ],
        }],
    };
    let hashedLedger = bytesToHex(keccak_256(JSON.stringify(cardLedger)));
    console.log(hashedLedger);
    let signingPrivateKey = Buffer.from(secp.utils.randomPrivateKey()).toString('hex');
    console.log(signingPrivateKey);
    let signingPublicKey = Buffer.from(secp.getPublicKey(signingPrivateKey)).toString('hex');
    console.log(signingPublicKey);
    setSigningPub(signingPublicKey);
    let ipfsSignature = await secp.sign(hashedLedger, signingPrivateKey, {der: true});
    console.log(ipfsSignature);
    let signature = Buffer.from(ipfsSignature).toString('hex');
    console.log(signature);

    cardLedger.hands[0].moves[0].ipfsSignature = signature;
    const ipfsLedger = JSON.stringify(cardLedger);

    const {cid} = await ipfs.add(ipfsLedger);
    const cidString = cid.toString();
    console.log(cidString);
    setCurrCid(cidString);
    setIpfsInst(ipfs);
}