import { ApiMode, Client } from '../src'
import { Context } from '../src/context'

import { mocked } from 'ts-jest/utils'

jest.mock('../src/context')

/**
 * Client tests
 */
describe('API client', () => {
  describe('instantiation', () => {
    it('exposes withApiKey method', () => {
      expect(Client.withApiKey).toBeTruthy()
    })

    it('exposes withMerchantId method', () => {
      expect(Client.withMerchantId).toBeTruthy()
    })
  })

  describe('ClientOptions', () => {
    const MockedContext = mocked(Context, true)

    beforeEach(() => {
      // Clear all instances and calls to constructor and all methods:
      MockedContext.mockClear()
    })

    it('accepts a string as apiRoot and sets it for both modes', () => {
      const expectedApiRoot = 'http://api-root.local'
      Client.withApiKey('sk_test_xxx', { apiRoot: expectedApiRoot })

      const actualApiRoot = MockedContext.mock.calls[0][1].apiRoot

      expect(actualApiRoot).toBeInstanceOf(Object)
      expect(actualApiRoot).toHaveProperty(ApiMode.LIVE)
      expect(actualApiRoot).toHaveProperty(ApiMode.TEST)

      expect(actualApiRoot[ApiMode.LIVE]).toBe(expectedApiRoot)
      expect(actualApiRoot[ApiMode.TEST]).toBe(expectedApiRoot)
    })
  })
})
