import dotenv, { parse } from 'dotenv';
dotenv.config();

import axios from 'axios';
import readLine from 'readline';
import Wallet from "../lib/wallet";
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionInput from '../lib/transactionInput';
import TransactionOutput from '../lib/transactionOutput';

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER

let myWallePub = '';
let myWallePri = '';

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout
})

function menu(){
  setTimeout(() => {
    console.clear();

    if(myWallePub)
      console.log(`You are logged as ${myWallePub}`);
    else
      console.log(`You aren't logged.`);

    console.log('1 - Create Wallet');  
    console.log('2 - Recover Wallet');
    console.log('3 - Balance')
    console.log('4 - Send tx')
    console.log('5 - Search tx')
    rl.question('Choose your option', (answer) => {
      switch(answer){
        case '1': createWallet(); break;
        case '2': recoverWallet(); break;
        case '3': getBalance(); break;
        case '4': senTX(); break;
        case '5': searchTx(); break;
        default: {
          console.log('Wrong option');
          menu();
        }
      }
    })

  }, 1000)
}

function preMenu(){
  rl.question('Press any key to continue...', () => {
    menu();
  })
}

function createWallet(){
  console.clear();
  const wallet = new Wallet();
  console.log('Your new wallet:');
  console.log(wallet);

  myWallePub = wallet.publicKey;
  myWallePri = wallet.privateKey;
  preMenu();
}

function recoverWallet(){
  console.clear();
  rl.question('What is private key or WIF?', (wifOrPrivateKey) => {
    const wallet = new Wallet(wifOrPrivateKey);
    console.log('Your recovered wallet:');
    console.log(wallet);

    myWallePub = wallet.publicKey;
    myWallePri = wallet.privateKey;
    preMenu();
  })
}

function getBalance(){
  console.clear();

  if(!myWallePub){
    console.log(`You don't have a wallet yet.`);
    return preMenu();
  }

  //TODO: get balance via api;
  preMenu();
}

function senTX(){
  console.clear();

  if(!myWallePub){
    console.log(`You don't have a wallet yet.`);
    return preMenu();
  }
  console.log(`Your wallet is ${myWallePub}`);
  rl.question('To wallet: ', (toWallet) => {
    if(toWallet.length < 66){
      console.log('Invalid Wallet');
      return preMenu();
    }
    rl.question('Amount', async (amountStr) => {
      const amount = parseInt(amountStr)
      if(!amount){
        console.log('Invalid Amount.');
        return preMenu();
      }

      const walletResponse = await axios.get(`${BLOCKCHAIN_SERVER}wallets/${myWallePub}`);
      const balance = walletResponse.data.balance as number;
      const fee = walletResponse.data.fee as number;
      const utxo = walletResponse.data.utxo as TransactionOutput[];

      if(balance < amount + fee){
        console.log('Insuficient balance(tx + fee)');
        return preMenu();
      }
      //TODO balance validation

      const tx = new Transaction();
      tx.timestamp = Date.now();
      tx.txOutputs = [new TransactionOutput({
        toAdress: toWallet,
        amount
      } as TransactionOutput)];

      tx.type = TransactionType.REGULAR;
      tx.txInputs = [new TransactionInput({
        amount,
        fromAdress: myWallePub,
        previousTx: utxo[0].tx
      } as TransactionInput)]

      tx.txInputs[0].sign(myWallePri);
      tx.hash = tx.getHash();
      tx.txOutputs[0].tx = tx.hash;

      try {
        const txResponse = await axios.post(`http://localhost:3040/transactions/`, tx); 
        console.log('Transaction accepted. Waiting the miners!');
        console.log(txResponse.data.hash);       
      } catch (err: any) {
          console.error(err.response ? err.response.data : err.message);
      }

      return preMenu();

    })
  })
  //TODO: send tx via api;
  preMenu();
}

function searchTx(){
  console.clear();
  rl.question(`Your tx hash: `, async (hash) => {
    const response = await axios.get(`http://localhost:3040/transactions/${hash}`);
    console.log(response.data);
    return preMenu();
  })
}

menu();