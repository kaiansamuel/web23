import { describe, test, expect, beforeAll } from '@jest/globals';
import Wallet from '../src/lib/wallet';
import TransactionInput from '../src/lib/transactionInput';

describe("Transaction Input tests", () => {

 
    
    let alice: Wallet, bob: Wallet;
    beforeAll(() => {
      alice = new Wallet();
      bob = new Wallet();
    })
 
    test("Should be valid", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAdress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput)
    txInput.sign(alice.privateKey);

    const valid = txInput.isValid();
    expect(valid.sucess).toBeTruthy();
  }) 
    
  test("Should NOT be valid(defaults)", () => {
    const txInput = new TransactionInput();
    txInput.sign(alice.privateKey);

    const valid = txInput.isValid();
    expect(valid.sucess).toBeFalsy();
  }) 
    
    test("Should NOT be valid(Empty Signature)", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAdress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput)
    
    const valid = txInput.isValid();
    expect(valid.sucess).toBeFalsy();
  }) 
    
  test("Should NOT be valid(negative amount)", () => {
    const txInput = new TransactionInput({
      amount: -10,
      fromAdress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid();
    expect(valid.sucess).toBeFalsy();
  }) 
  
  test("Should NOT be valid(invalid signature)", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAdress: alice.publicKey,
      previousTx: 'abc'
    } as TransactionInput)
    txInput.sign(bob.privateKey)

    const valid = txInput.isValid();
    expect(valid.sucess).toBeFalsy();
  }) 
 
  test("Should NOT be valid(invalid previousTX)", () => {
    const txInput = new TransactionInput({
      amount: 10,
      fromAdress: alice.publicKey,
    } as TransactionInput)
    txInput.sign(alice.privateKey)

    const valid = txInput.isValid();
    expect(valid.sucess).toBeFalsy();
  }) 
})