import {ApiMode, LIVE_API_URL, SANDBOX_API_URL} from "./consts";
import Context from "./context";
import Endpoint from "./endpoints/base";
import PaymentsEndpoint from "./endpoints/payments";
import {Constructor} from "./types";

export const CLIENT_VERSION = "0.0.1";

export type ApiRootObject = Record<ApiMode, string>;
export interface ClientOptions {
  apiRoot?: string | ApiRootObject,
  mode?: ApiMode,
  logger?: Console
}

export class Client {
  private readonly context: Context;
  private endpoints: Map<Constructor<Endpoint>, Endpoint> = new Map();

  constructor(apiKey: string, options: ClientOptions = {}) {
    if (!apiKey.trim()) {
      throw new Error("An API key is required to instantiate a new Client");
    }

    options = Client.initOptions(options);
    this.context = new Context(apiKey, options);

    this.initUserAgent();
  }

  private static initOptions(options: ClientOptions): ClientOptions {
    let defaultOptions: ClientOptions = {
      apiRoot: {[ApiMode.TEST]: SANDBOX_API_URL, [ApiMode.LIVE]: LIVE_API_URL},
      mode: ApiMode.LIVE,
      logger: console
    };

    options = {...defaultOptions, ...options};

    // If a single string value was provided for the API root URL, use it for both LIVE and TEST
    // API modes
    if (typeof options.apiRoot === "string") {
      options.apiRoot = {
        [ApiMode.TEST]: options.apiRoot,
        [ApiMode.LIVE]: options.apiRoot,
      };
    } else if (!options.apiRoot || !options.apiRoot[ApiMode.TEST] || !options.apiRoot[ApiMode.LIVE]) {
      throw new Error("ClientOptions `apiRoot` must be a string or an object with ApiMode values as keys");
    }

    if (options.mode !== ApiMode.LIVE && options.mode !== ApiMode.TEST) {
      throw new Error("ClientOptions `mode` must be an ApiMode value")
    }

    return options;
  }

  private initUserAgent() {
    this.addUserAgentComponent("JavaScript");
    this.addUserAgentComponent("Alma for JS", CLIENT_VERSION);
  }

  public addUserAgentComponent(component: string, version?: string) {
    this.context.addUserAgentComponent(component, version);
  }

  private endpoint<T extends Endpoint>(klass: Constructor<T>): T {
    let endpoint = this.endpoints.get(klass);

    if (!endpoint) {
      endpoint = new klass(this.context);
      this.endpoints.set(klass, endpoint);
    }

    return endpoint as T;
  }

  get payments(): PaymentsEndpoint {
    return this.endpoint(PaymentsEndpoint);
  }
}

export default Client;
