import { Client } from '@/index'

/**
 * Client tests
 */
describe('API client', () => {
  describe('instantiation with a merchant ID', () => {
    it('exposes withMerchantId method', () => {
      expect(Client.withMerchantId).toBeInstanceOf(Function)
    })
  })
})
