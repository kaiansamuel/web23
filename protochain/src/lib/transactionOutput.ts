import Validation from "./validation";
import sha256  from "crypto-js/sha256";
/**
 * Transaction Output Class
 */
export default class TransactionOutput {
  toAdress: string;
  amount: number;
  tx?: string;

  constructor(txOutput?: TransactionOutput){
    this.toAdress = txOutput?.toAdress || '';
    this.amount = txOutput?.amount || 0;
    this.tx = txOutput?.tx || '';
  }
  isValid(): Validation {
    if(this.amount < 1)
      return new Validation(false, 'Negative Amount');

      return new Validation();
  }

  getHash(): string {
    return sha256(this.toAdress + this.amount).toString();
  }
}  
