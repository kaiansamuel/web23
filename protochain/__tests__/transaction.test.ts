import { describe, test, expect, jest } from '@jest/globals';
import Transaction from '../src/lib/transaction';
import TransactionType from '../src/lib/transactionType';
import TransactionInput from '../src/lib/transactionInput';\

jest.mock('../src/lib/transactionInput')

describe("Transaction tests", () => {
  test("Should be valid (REGULAR default)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'carteiraTo'
    } as Transaction)
    
    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  })

  test("Should NOT be valid (invalid hash)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'carteiraTo',
      type: TransactionType.REGULAR,
      timestamp: Date.now(),
      hash: 'abc'
    } as Transaction)
    
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  })

  test("Should be valid (FEE)", () => {
    const tx = new Transaction({
      txInput: new TransactionInput(),
      to: 'carteiraTo',
      type: TransactionType.Fee
    } as Transaction)
    
    tx.txInput = undefined;
    tx.hash = tx.getHash();

    const valid = tx.isValid();
    expect(valid.sucess).toBeTruthy();
  })

  test("Should NOT be valid (invalid to)", () => {
    const tx = new Transaction()
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  })
  
  test("Should NOT be valid (invalid txInput)", () => {
    const tx = new Transaction({
      to: 'carteiraTo',
      txInput: new TransactionInput({
        amount: -10,
        fromAdress: 'carteiraFrom',
        signature: 'abc'
      } as TransactionInput)
    } as Transaction)
    const valid = tx.isValid();
    expect(valid.sucess).toBeFalsy();
  })
}) 
