import { ApiMode, LIVE_API_URL, SANDBOX_API_URL } from './consts'
import Context from './context'
import Endpoint from './endpoints/base'
import PaymentsEndpoint from './endpoints/payments'
import { Constructor } from './types'
import Credentials from './credentials/base'
import ApiKeyCredentials from './credentials/ApiKeyCredentials'
import MerchantIdCredentials from './credentials/MerchantIdCredentials'

export const CLIENT_VERSION = '0.0.1'

export type ApiRootObject = Record<ApiMode, string>

export interface ClientConfig {
  apiRoot: string | ApiRootObject
  mode: ApiMode
  logger: Console
}

export type ClientOptions = Partial<ClientConfig>

export class Client {
  private readonly context: Context
  private endpoints: Map<Constructor<Endpoint>, Endpoint> = new Map()

  constructor(credentials: Credentials, options: ClientOptions = {}) {
    const config = Client.initConfig(options)
    this.context = new Context(credentials, config)
    this.initUserAgent()
  }

  public static withApiKey(apiKey: string, options: ClientOptions = {}): Client {
    return new Client(new ApiKeyCredentials(apiKey), options)
  }

  public static withMerchantId(merchantId: string, options: ClientOptions = {}): Client {
    return new Client(new MerchantIdCredentials(merchantId), options)
  }

  private static initConfig(options: ClientOptions): ClientConfig {
    const defaultConfig: ClientConfig = {
      apiRoot: { [ApiMode.TEST]: SANDBOX_API_URL, [ApiMode.LIVE]: LIVE_API_URL },
      mode: ApiMode.LIVE,
      logger: console,
    }

    const config = { ...defaultConfig, ...options }

    // If a single string value was provided for the API root URL, use it for both LIVE and TEST
    // API modes
    if (typeof config.apiRoot === 'string') {
      config.apiRoot = {
        [ApiMode.TEST]: config.apiRoot,
        [ApiMode.LIVE]: config.apiRoot,
      }
    } else if (!config.apiRoot || !config.apiRoot[ApiMode.TEST] || !config.apiRoot[ApiMode.LIVE]) {
      throw new Error(
        'ClientOptions `apiRoot` must be a string or an object with ApiMode values as keys'
      )
    }

    if (config.mode !== ApiMode.LIVE && config.mode !== ApiMode.TEST) {
      throw new Error('ClientOptions `mode` must be an ApiMode value')
    }

    return config
  }

  private initUserAgent() {
    this.addUserAgentComponent('JavaScript')
    this.addUserAgentComponent('Alma for JS', CLIENT_VERSION)
  }

  public addUserAgentComponent(component: string, version?: string): void {
    this.context.addUserAgentComponent(component, version)
  }

  private endpoint<T extends Endpoint>(klass: Constructor<T>): T {
    let endpoint = this.endpoints.get(klass)

    if (!endpoint) {
      endpoint = new klass(this.context)
      this.endpoints.set(klass, endpoint)
    }

    return endpoint as T
  }

  get payments(): PaymentsEndpoint {
    return this.endpoint(PaymentsEndpoint)
  }
}

export default Client
