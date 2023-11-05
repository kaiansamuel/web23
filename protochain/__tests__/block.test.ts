import { describe, test, expect, beforeAll, jest } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockinfo';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';
import TransactionOutput from '../src/lib/transactionOutput';
import Wallet from '../src/lib/wallet';

jest.mock('../src/lib/transaction');
jest.mock('../src/lib/transactionInput')
jest.mock('../src/lib/transactionOutput')

describe("Block tests", () => {

  const exampleDifficulty = 1; 
  let alice: Wallet;
  let genesis: Block;

  beforeAll(() => {
    alice = new Wallet();
    genesis = new Block({
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block)    
  });


  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [] as Transaction[]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput({
        toAdress: alice.publicKey,
        amount: 1
      } as TransactionOutput)]
    } as Transaction))

    block.mine(exampleDifficulty, alice.publicKey)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  })
 
  test("Should NOT be valid(no fee) ", () => {   
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);

    block.mine(exampleDifficulty, alice.publicKey)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })
 
  test("Should create to block info", () => {
    const block = Block.fromBlockInfo({
      transactions: [],
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash
    }as BlockInfo) 
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput({
        toAdress: alice.publicKey,
        amount: 1
      } as TransactionOutput)]
    } as Transaction))

    block.hash = block.getHash();

    block.mine(exampleDifficulty, alice.publicKey)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  })
  
  test("Should NOT be valid(2 FEE)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
        type: TransactionType.Fee, 
        txInputs: [new TransactionInput()]
      } as Transaction),
      new Transaction({
        type: TransactionType.Fee, 
        txInputs: [new TransactionInput()]
      } as Transaction)
    ]
    } as Block);
    block.mine(exampleDifficulty, alice.publicKey)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should NOT be valid(invalid tx)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction()]
    } as Block);

    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.mine(exampleDifficulty, alice.publicKey)

    block.transactions[0].txOutputs[0].toAdress = '';

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(fallbacks)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(invalid previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: 'abc',
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(invalid timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey)

    block.hash = '';

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })
  
  test("Should not be valid(no mined)", () => {
    const block = new Block({
      index: 1,
      nonce: 0,
      miner: '',
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(txInputs)", () => {
    const txInputs = [new TransactionInput()];
    txInputs[0].amount = -1;

    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs
      } as Transaction)]
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(invalid index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [new Transaction({
        txInputs: [new TransactionInput()]
      } as Transaction)]
    } as Block);
    block.transactions.push(new Transaction({
      type: TransactionType.Fee,
      txOutputs: [new TransactionOutput()]
    } as Transaction))

    block.hash = block.getHash();
    block.mine(exampleDifficulty, alice.publicKey);

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

})