import { ApiMode, LIVE_API_URL, SANDBOX_API_URL } from './consts'
import Context from './context'
import Endpoint from './endpoints/base'
import PaymentsEndpoint from './endpoints/payments'
import { Constructor } from './types'
import Credentials from './credentials/base'
import ApiKeyCredentials from './credentials/ApiKeyCredentials'
import MerchantIdCredentials from './credentials/MerchantIdCredentials'

// The actual version will be inserted upon release into the built files
export const CLIENT_VERSION = '%%_SEMANTIC_VERSION_%%'

export type ApiRootObject = Record<ApiMode, string>

export interface ClientConfig {
  apiRoot: ApiRootObject
  mode: ApiMode
  logger: Console
}

// Client options are all optional (you don't say!) and `apiRoot` can be given
// as a single string or a complete ApiRootObject
export type ClientOptions = Partial<
  Omit<ClientConfig, 'apiRoot'> & { apiRoot: string | ApiRootObject }
>

export class Client {
  private readonly context: Context
  private endpoints: Map<Constructor<Endpoint>, Endpoint> = new Map()

  constructor(credentials: Credentials, options: ClientOptions = {}) {
    const config = Client.initConfig(credentials, options)
    this.context = new Context(credentials, config)
    this.initUserAgent()
  }

  public static withApiKey(apiKey: string, options: ClientOptions = {}): Client {
    return new Client(new ApiKeyCredentials(apiKey), options)
  }

  public static withMerchantId(merchantId: string, options: ClientOptions = {}): Client {
    return new Client(new MerchantIdCredentials(merchantId), options)
  }

  private static initConfig(credentials: Credentials, options: ClientOptions): ClientConfig {
    const defaultConfig: ClientConfig = {
      apiRoot: { [ApiMode.TEST]: SANDBOX_API_URL, [ApiMode.LIVE]: LIVE_API_URL },
      mode: ApiMode.LIVE,
      logger: console,
    }

    // If a single string value was provided for the API root URL, use it for both LIVE and TEST
    // API modes
    if (typeof options.apiRoot === 'string') {
      options.apiRoot = {
        [ApiMode.TEST]: options.apiRoot,
        [ApiMode.LIVE]: options.apiRoot,
      }
    } else if (
      options.apiRoot &&
      (!options.apiRoot[ApiMode.TEST] || !options.apiRoot[ApiMode.LIVE])
    ) {
      throw new Error(
        'ClientOptions `apiRoot` must be a string or an object with ApiMode values as keys'
      )
    }

    if (!!options.mode && options.mode !== ApiMode.LIVE && options.mode !== ApiMode.TEST) {
      throw new Error('ClientOptions `mode` must be an ApiMode value')
    }

    // Infer API mode from provided API key when it makes sense
    if (!options.mode && credentials instanceof ApiKeyCredentials) {
      options.mode = credentials.apiKey.indexOf('_live_', 2) > 0 ? ApiMode.LIVE : ApiMode.TEST
    }

    return { ...defaultConfig, ...(options as ClientConfig) }
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

  get mode(): ApiMode {
    return this.context.mode
  }

  set mode(mode: ApiMode) {
    this.context.mode = mode
  }
}

export default Client
