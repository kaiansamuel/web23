import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockinfo";

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = {
  privateKey: '123456',
  publicKey: `${process.env.MINER_WALLET}`
}

console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0;

async function mine(){
  console.log('Geting next block info...')
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}blocks/next`);
  const blockInfo = data as BlockInfo;

  const newBlock = Block.fromBlockInfo(blockInfo);
  //TODO add tx de recompensa

  console.log(`Start mining block # ${blockInfo.index}`);
  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

  console.log('Blocked mined! Sending to blockchain...')
  
  try {
    await axios.post(`${BLOCKCHAIN_SERVER}blocks/`, newBlock);
    console.log('Block send and accepted!')
    totalMined++;
    console.log(`Total mined Blocks: ${totalMined}`)
  } catch (err: any) {
    console.error(err.response ? err.response.data : err.message)
  }
  setTimeout(() => {
    mine();
  }, 1000);
}
mine()