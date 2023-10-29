import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';
import readLine from 'readline';
import Wallet from "../lib/wallet";

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

  //TODO: send tx via api;
  preMenu();
}

menu();