import * as ecc from 'tiny-secp256k1';
import ECPairFactory, { ECPairInterface } from 'ecpair';

const ECPair = ECPairFactory(ecc);

//Wallet Class
export default class Wallet {

  privateKey: string;
  publicKey: string;
  
  constructor(wifiOrPrivateKey?: string){
    let keys;

    if(wifiOrPrivateKey){
      if(wifiOrPrivateKey.length === 64)
        keys = ECPair.fromPrivateKey(Buffer.from(wifiOrPrivateKey, 'hex'));
      else
        keys = ECPair.fromWIF(wifiOrPrivateKey)
    }
    else
      keys = ECPair.makeRandom();

    this.privateKey = keys.privateKey?.toString('hex') || '';
    this.publicKey = keys.publicKey.toString('hex');
  }
}