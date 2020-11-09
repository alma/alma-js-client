import { Client } from '../src'

/**
 * Client tests
 */
describe('API client', () => {
  it('exposes withApiKey method', () => {
    expect(Client.withApiKey).toBeTruthy()
  })

  it('exposes withMerchantId method', () => {
    expect(Client.withMerchantId).toBeTruthy()
  })
})
