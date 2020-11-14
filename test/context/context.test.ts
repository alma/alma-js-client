import { ApiMode } from '@/index'
import { Context } from '@/context'
import MerchantIdCredentials from '@/credentials/MerchantIdCredentials'

describe('Context', () => {
  let context: Context
  const testConfig = {
    apiRoot: {
      [ApiMode.LIVE]: 'https://live.local/',
      [ApiMode.TEST]: 'https://test.local',
    },
    mode: ApiMode.TEST,
    logger: console,
  }

  beforeEach(() => {
    context = new Context(new MerchantIdCredentials('xxx'), testConfig)
  })

  it('returns mode from initial config', () => {
    expect(context.mode).toBe(testConfig.mode)
  })

  it('can set a different mode', () => {
    context.mode = ApiMode.LIVE
    expect(context.mode).toBe(ApiMode.LIVE)
  })

  describe.each([
    /// expectedRootMode, apiMode
    [ApiMode.LIVE, ApiMode.LIVE],
    [ApiMode.TEST, ApiMode.TEST],
    ///
  ])('returns %s apiRoot for %s mode', (expectedRootMode, apiMode) => {
    it('works', () => {
      context.mode = apiMode
      expect(context.apiRoot).toBe(testConfig.apiRoot[expectedRootMode])
    })
  })

  it('returns the logger object from provided config', () => {
    expect(context.logger).toBe(testConfig.logger)
  })

  describe.each([
    /// expectedUrl, path, mode
    ['https://live.local/path/to/endpoint', '/path/to/endpoint', ApiMode.LIVE],
    ['https://live.local/path/to/endpoint', 'path/to/endpoint', ApiMode.LIVE],
    ['https://test.local/path/to/endpoint', '/path/to/endpoint', ApiMode.TEST],
    ['https://test.local/path/to/endpoint', 'path/to/endpoint', ApiMode.TEST],
    ///
  ])(
    'returns URL "%s" for path "%s" with mode %s',
    (expectedUrl: string, path: string, mode: ApiMode) => {
      it('works', () => {
        context.mode = mode
        expect(context.urlFor(path)).toBe(expectedUrl)
      })
    }
  )

  it('handles user-agent components', () => {
    context.addUserAgentComponent('JavaScript')
    context.addUserAgentComponent('API Client tests', '42')

    expect(context.userAgentString).toBe('API Client tests/42; JavaScript')
  })
})
