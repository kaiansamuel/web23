import dotenv from 'dotenv';
dotenv.config();

import axios from "axios";
import Block from "../lib/block";
import BlockInfo from "../lib/blockinfo";
import Wallet from '../lib/wallet';
import TransactionType from '../lib/transactionType';
import TransactionOutput from '../lib/transactionOutput';
import Transaction from '../lib/transaction';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER;

const minerWallet = new Wallet(process.env.MINER_WALLET);

console.log(`Logged as ${minerWallet.publicKey}`)

let totalMined = 0;

function getRewardTx(): Transaction {
  const txo = new TransactionOutput({
    toAdress: minerWallet.publicKey,
    amount: 10
  } as TransactionOutput);

  const tx = new Transaction({
    txOutputs: [txo],
    type: TransactionType.Fee
  } as Transaction);

  tx.hash = tx.getHash();
  tx.txOutputs[0].tx = tx.hash;
  
  return tx;
} 

async function mine(){
  console.log('Geting next block info...')
  const { data } = await axios.get(`http://localhost:3000/blocks/next`);
  if(!data){
    console.log('No tx found, Waiting...');
    return setTimeout(() => {
      mine();
    }, 5000)
  }
  const blockInfo = data as BlockInfo;

  const newBlock = Block.fromBlockInfo(blockInfo);
 
  newBlock.transactions.push(getRewardTx());

  newBlock.miner = minerWallet.publicKey;
  newBlock.hash = newBlock.getHash();

  console.log(`Start mining block # ${blockInfo.index}`);
  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey);

  console.log('Blocked mined! Sending to blockchain...')
  
  try {
    await axios.post(`http://localhost:3000/blocks/`, newBlock);
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