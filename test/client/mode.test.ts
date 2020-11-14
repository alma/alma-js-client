import { ApiMode, Client } from '@/index'
import Context from '@/context'

function buildClient() {
  return Client.withApiKey('sk_test_xxx')
}

describe('API client', () => {
  describe('API mode', () => {
    it('can be retrieved on the Client instance', () => {
      const client = buildClient()

      expect(client).toHaveProperty('mode')
      expect(client.mode).toBe(ApiMode.TEST)
    })

    it('retrieves it from its context', () => {
      const spy = jest.spyOn(Context.prototype, 'mode', 'get').mockReturnValue('blah' as ApiMode)

      const client = buildClient()
      expect(client.mode).toBe('blah')

      spy.mockRestore()
    })

    it('can be set', () => {
      const client = buildClient()
      client.mode = ApiMode.LIVE
      expect(client.mode).toBe(ApiMode.LIVE)
    })

    it('sets it on its context', () => {
      const spy = jest.spyOn(Context.prototype, 'mode', 'set')

      const client = buildClient()
      client.mode = ApiMode.LIVE

      expect(spy).toHaveBeenCalledWith(ApiMode.LIVE)

      spy.mockRestore()
    })
  })
})
