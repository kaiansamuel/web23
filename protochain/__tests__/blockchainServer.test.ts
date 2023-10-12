import request from 'supertest';
import { describe, test, expect, jest } from '@jest/globals';
import { app } from '../src/server/blockchainServer'

jest.mock('../src/lib/block')
jest.mock('../src/lib/blockchain')

describe('Blockchain Server Tests', () => {
  test('Get /status', async () => {
  const response = await request(app)
    .get('/status/');
    expect(response.status).toEqual(200)  
    expect(response.body.isValid.sucess).toEqual(true)
  })
})