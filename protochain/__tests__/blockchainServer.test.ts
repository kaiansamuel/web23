import request from 'supertest';
import { describe, test, expect, jest } from '@jest/globals';
import { app } from '../src/server/blockchainServer'
import Block from '../src/lib/block';

jest.mock('../src/lib/block')
jest.mock('../src/lib/blockchain')

describe('Blockchain Server Tests', () => {
  test('Get /status - Should return status', async () => {
    const response = await request(app)
    .get('/status/');
    expect(response.status).toEqual(200)  
    expect(response.body.isValid.sucess).toEqual(true)
  })
  
  test('Get /blocks/:indexOrHash - Should get Genesis', async () => {
    const response = await request(app)
      .get('/blocks/0');
    expect(response.status).toEqual(200)  
    expect(response.body.index).toEqual(0)
  })
  
  test('Get /blocks/:hash - Should get Block', async () => {
    const response = await request(app)
      .get('/blocks/abc');
    expect(response.status).toEqual(200)  
    expect(response.body.hash).toEqual('abc');
  })
  
  test('Get /blocks/:index - Should NOT get Block', async () => {
    const response = await request(app)
      .get('/blocks/-1');
    expect(response.status).toEqual(404)  
  })

  test('POST /blocks/ - Should add Block', async () => {
    const block = new Block({
      index: 1
    } as Block);
    const response = await request(app)
      .post('/blocks/')
      .send(block);
    expect(response.status).toEqual(201)  
    expect(response.body.index).toEqual(1);
  })
  
  test('POST /blocks/ - Should NOT add Block (empty)', async () => {
    const response = await request(app)
      .post('/blocks/')
      .send({});
    expect(response.status).toEqual(422);
  })
 
  test('POST /blocks/ - Should NOT add Block (invalid)', async () => {
    const block = new Block({
      index: -1
    } as Block);
    const response = await request(app)
      .post('/blocks/')
      .send(block);
    expect(response.status).toEqual(400);
  })
})