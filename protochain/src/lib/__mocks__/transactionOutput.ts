import Validation from "../validation";
/**
 * Mocked Transaction Output Class
 */
export default class TransactionOutput {
  toAdress: string;
  amount: number;
  tx?: string;

  constructor(txOutput?: TransactionOutput){
    this.toAdress = txOutput?.toAdress || 'abc';
    this.amount = txOutput?.amount || 10;
    this.tx = txOutput?.tx || 'xyz';
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
