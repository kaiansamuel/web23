import * as ecc from 'tiny-secp256k1';
import ECPairFactory from 'ecpair';
import { SHA256 } from 'crypto-js';
import Validation from './validation';

const ECPair = ECPairFactory(ecc);


//Transaction Input class
export default class TransactionInput {
  fromAdress: string;
  amount: number; 
  signature: string;
  previousTx: string;
  //Creates a new Transaction Input
  //@param txInput The tx input data
  constructor(txInput?: TransactionInput){
    this.previousTx = txInput?.previousTx || '';
    this.fromAdress = txInput?.fromAdress || '';
    this.amount = txInput?.amount || 0;
    this.signature = txInput?.signature || '';
  }
  //Generate the tx input signature
  //@param privateKey The from private Key
  sign(privateKey: string): void {
    this.signature = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
      .sign(Buffer.from(this.getHash(), 'hex'))
      .toString('hex');
  }
  /**
   * Generates the tx input hash
   * @returns the tx input hash
   */
  getHash(): string {
    return SHA256(this.previousTx + this.fromAdress + this.amount).toString();
  }
  /**
   * Validates if the tx input is ok
   * @returns a Validation result object
   */
  isValid(): Validation {
    if (!this.previousTx || !this.signature)
      return new Validation(false, 'Signature are prvious tx are required');
    if (this.amount < 1)
      return new Validation(false, 'Amount must to be greather than zero')
    
    const hash = Buffer.from(this.getHash(), 'hex');
    const isValid = ECPair.fromPublicKey(Buffer.from(this.fromAdress, 'hex'))
      .verify(hash, Buffer.from(this.signature, 'hex'))
      
    return isValid ? new Validation() : new Validation(false, 'Invalid tx input signature')
  }
}