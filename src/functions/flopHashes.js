import { ethers } from 'ethers';
import { getSuit } from './cardFunctions';

const tempPw = 'grandersson';

export const legendBlockRoll = (blockLength) => {
    const randomBlock = Math.floor(Math.random() * blockLength);
    const randomLegend = Math.floor(Math.random() * 64);
    const randArr = [randomBlock, randomLegend];
    return randArr;
}

export const hashBlock = (block) => {
    const first = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(block.timestamp) + tempPw));
    const second = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(block.extraData) + tempPw));
    const third = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(block.hash) + tempPw));
    const hashArr = [first, second, third, tempPw];
    return hashArr;
}

export const printCards = (hashes, block, legend) => {
    console.log(legend);
    let cards = [];
    let suits = [];
    if (verifyHashes(hashes, block, hashes[3])) {
        for (let i = 0; i < 3; i++) {
        let hash = hashes[i];
        let card = "";
        let suit = "";
        suit = getSuit(hash);
        let cardHash = hash.slice(legend);
        let ind = cardHash.search(/[1-8]/);
        console.log(ind);
        if (ind === -1) {
            ind = hash.search(/[1-8]/);
            card = hash[ind];
            } else {
            card = cardHash[ind];
            }
        cards.push(card);
        suits.push(suit);
        }
        console.log(cards);
        console.log(suits);
    } else {
        console.log('hashes not verified');
    }
}

const verifyHashes = (hashes, block, pw) => {
    const first = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(block.timestamp) + pw)) === hashes[0];
    const second = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(block.extraData) + pw)) === hashes[1];
    const third = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(block.hash) + pw)) === hashes[2];
    if (first && second && third) {
        return true;
    } else {
        return false;
    }
}