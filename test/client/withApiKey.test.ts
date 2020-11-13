import { ApiMode, Client } from '@/index'

import ApiKeyCredentials from '../../src/credentials/ApiKeyCredentials'

/**
 * Client tests
 */
describe('API client', () => {
  describe('instantiation with an API key', () => {
    it('exposes withApiKey method', () => {
      expect(Client.withApiKey).toBeInstanceOf(Function)
    })

    describe.each([
      /// expectedMode, apiKey
      [ApiMode.TEST, 'sk_test_xxx'],
      [ApiMode.LIVE, 'sk_live_xxx'],
      ///
    ])('%s mode inference from "%s" API key', (expectedMode, apiKey) => {
      it('works with withApiKey', () => {
        const client = Client.withApiKey(apiKey)
        expect(client.mode).toBe(expectedMode)
      })

      it('works with constructor', () => {
        const client = new Client(new ApiKeyCredentials(apiKey))
        expect(client.mode).toBe(expectedMode)
      })

      it('does not override provided mode', () => {
        const otherMode = {
          [ApiMode.LIVE]: ApiMode.TEST,
          [ApiMode.TEST]: ApiMode.LIVE,
        }
        const client = Client.withApiKey(apiKey, { mode: otherMode[expectedMode] })
        expect(client.mode).toBe(otherMode[expectedMode])
      })
    })
  })

  describe('with a merchant ID', () => {
    it('exposes withMerchantId method', () => {
      expect(Client.withMerchantId).toBeInstanceOf(Function)
    })
  })
})
