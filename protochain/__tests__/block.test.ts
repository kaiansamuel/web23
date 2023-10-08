import { describe, test, expect } from '@jest/globals';
import Block from '../src/lib/block';

describe("Block tests", () => {

  test("Should be valid", () => {
    const block = new Block(1, 'abc', 'Block 2');
    const valid = block.isValid();
    expect(valid).toBeTruthy();
  })

  test("Should not be valid(previous hash)", () => {
    const block = new Block(1, '', 'Block 2');
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

  test("Should not be valid(timestamp)", () => {
    const block = new Block(1, 'abc', 'Block 2');
    block.timestamp = -1;
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

  test("Should not be valid(hash)", () => {
    const block = new Block(1, 'abc', 'Block 2');
    block.hash = '';
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

  test("Should not be valid(data)", () => {
    const block = new Block(1, 'abc', '');
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

  test("Should not be valid(index)", () => {
    const block = new Block(-1, 'abc', 'Block 2');
    const valid = block.isValid();
    expect(valid).toBeFalsy();
  })

})