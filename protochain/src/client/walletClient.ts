import dotenv, { parse } from 'dotenv';
dotenv.config();

import axios from 'axios';
import readLine from 'readline';
import Wallet from "../lib/wallet";
import Transaction from '../lib/transaction';
import TransactionType from '../lib/transactionType';
import TransactionInput from '../lib/transactionInput';

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
    rl.question('Choose your option', (answer) => {
      switch(answer){
        case '1': createWallet(); break;
        case '2': recoverWallet(); break;
        case '3': getBalance(); break;
        case '4': senTX(); break;
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

      //TODO balance validation

      const tx = new Transaction();
      tx.timestamp = Date.now();
      tx.to = toWallet;
      tx.type = TransactionType.REGULAR;
      tx.txInput = new TransactionInput({
        amount,
        fromAdress: myWallePub
      } as TransactionInput)

      tx.txInput.sign(myWallePri);
      tx.hash = tx.getHash();

      try {
        const txResponse = await axios.post(`http://localhost:3000/transactions/`, tx); 
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

menu();