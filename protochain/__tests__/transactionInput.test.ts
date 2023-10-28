import { describe, test, expect, beforeAll } from '@jest/globals';
import Wallet from '../src/lib/wallet';
import TransactionInput from '../src/lib/transactionInput';

describe("Transaction Input tests", () => {

 
    
    let alice: Wallet;
    beforeAll(() => {
      alice = new Wallet();
    })
 
    test("Should be valid", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAdress: alice.publicKey
    } as TransactionInput)
    txInput.sign(alice.privateKey);

    const valid = txInput.isValid();
    expect(valid.sucess).toBeTruthy();
  }) 
})