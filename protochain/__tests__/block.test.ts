import { describe, test, expect, beforeAll } from '@jest/globals';
import Block from '../src/lib/block';
import BlockInfo from '../src/lib/blockinfo';

describe("Block tests", () => {

  const exampleDifficulty = 0; 
  const exampleMiner = 'Kaian';
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      data: 'Genesis Block'
    }as Block)
  });


  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block);
    block.mine(exampleDifficulty, exampleMiner)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  })
 
  test("Should create to block info", () => {
    const block = Block.fromBlockInfo({
      data: 'Block 2',
      difficulty: exampleDifficulty,
      feePerTx: 1,
      index: 1,
      maxDifficulty: 62,
      previousHash: genesis.hash
    }as BlockInfo) 

    block.mine(exampleDifficulty, exampleMiner)

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeTruthy();
  })
  
  test("Should not be valid(fallbacks)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(previous hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: 'abc',
      data: 'Block 2'
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block);
    block.timestamp = -1;
    block.hash = block.getHash()
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(empty hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block);
    block.mine(exampleDifficulty, exampleMiner)

    block.hash = '';

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })
  
  test("Should not be valid(no mined)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2'
    } as Block);
    
    block.hash = '';

    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: ''
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

  test("Should not be valid(index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: ''
    } as Block);
    const valid = block.isValid(genesis.hash, genesis.index, exampleDifficulty);
    expect(valid.sucess).toBeFalsy();
  })

})