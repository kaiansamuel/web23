import Block from './block'
import Validation from '../validation';
import BlockInfo from '../blockinfo';
import Transaction from './transaction';
import TransactionSearch from '../transactionSearch';
import TransactionInput from '../transactionInput';
import TransactionOutput from '../transactionOutput';

//Blockchain class
export default class Blockchain {
  blocks: Block[];
  mempool: Transaction[];
  nextIndex: number = 0;
  //Creates a new mocked Blockchain
  constructor(miner: string){
    this.blocks = [];
    this.mempool = [new Transaction()];

    this.blocks.push(new Block({
      index: 0,
      hash: 'abc',
      previousHash: "",
      miner,
      timestamp: Date.now()
    } as Block));
    this.nextIndex++;
  }

  getLastBlock(): Block{
    return this.blocks[this.blocks.length -1]
  }

  addBlock(block: Block): Validation{
    if(block.index < 0) return new Validation(false, 'Invalid mock block')
   
    this.blocks.push(block);
    this.nextIndex++;

    return new Validation();
  }

  addTransaction(transaction: Transaction): Validation {
    const validation = transaction.isValid();
    if(!validation.sucess) return validation;

    this.mempool.push(transaction);
    return new Validation();
  }

  getTransaction(hash: string): TransactionSearch{
    if(hash === '-1')
      return { mempoolIndex: -1, blockIndex: -1 } as TransactionSearch;
    return {
      mempoolIndex: 0,
      transaction: new Transaction();
    } as TransactionSearch;
  }

  getBlock(hash: string): Block | undefined {
    if(!hash || hash === '-1') return undefined;
    return this.blocks.find(b => b.hash === hash)
  }

  isValid(): Validation {
    return new Validation();
  }  

  getFeePerTx(): number {
    return 1;
  }

  getNextBlock(): BlockInfo{
      return {
      transactions: this.mempool.slice(0, 2),
      difficulty: 1,
      previousHash: this.getLastBlock().hash,
      index: this.blocks.length,
      feePerTx: this.getFeePerTx(),
      maxDifficulty: 62
    } as BlockInfo;
  }

  getTxInputs(wallet: string): (TransactionInput | undefined)[]{
    return [new TransactionInput({
      amount: 10,
      fromAdress: wallet,
      previousTx: 'abc',
      signature: 'abc'
  } as TransactionInput)]
  }

  getTxOutputs(wallet: string): TransactionOutput[]{
    return [new TransactionOutput({
      amount: 10,
      toAdress: wallet,
      tx: 'abc'
    } as TransactionOutput)]
  }

  getUtxo(wallet: string): TransactionOutput[] {
    return this.getTxOutputs(wallet);
  }

  getBalance(wallet: string): number {
    return 10;
  }
}