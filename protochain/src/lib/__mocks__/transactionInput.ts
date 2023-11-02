import Validation from '../validation';

//Mocked Transaction Input class
export default class TransactionInput {
  fromAdress: string;
  amount: number; 
  signature: string;
  previousTx: string;

  //Creates a new Transaction Input
  //@param txInput The tx input data
  constructor(txInput?: TransactionInput){
    this.previousTx= txInput?.previousTx || 'xyz  ';
    this.fromAdress = txInput?.fromAdress || 'carteira1';
    this.amount = txInput?.amount || 10;
    this.signature = txInput?.signature || 'abc';
  }
  //Generate the tx input signature
  //@param privateKey The from private Key
  sign(privateKey: string): void {
    this.signature = 'abc';
  }
  /**
   * Generates the tx input hash
   * @returns the tx input hash
   */
  getHash(): string {
    return 'abc';
  }
  /**
   * Validates if the tx input is ok
   * @returns a Validation result object
   */
  isValid(): Validation {
    if (!this.previousTx || !this.signature)
      return new Validation(false, 'Signature are prvious tx are required');
    if (!this.signature)
      return new Validation(false, 'Signature is required');
    if (this.amount < 1)
      return new Validation(false, 'Amount must to be greather than zero')
    
    return new Validation(); 
  }
}