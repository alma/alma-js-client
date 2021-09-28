import { ApiMode } from './consts';
import PaymentsEndpoint from './endpoints/payments';
import Credentials from './credentials/base';
export declare const CLIENT_VERSION = "1.1.1";
export declare type ApiRootObject = Record<ApiMode, string>;
export interface ClientConfig {
    apiRoot: ApiRootObject;
    mode: ApiMode;
    logger: Console;
}
export declare type ClientOptions = Partial<Omit<ClientConfig, 'apiRoot'> & {
    apiRoot: string | ApiRootObject;
}>;
export declare class Client {
    private readonly context;
    private endpoints;
    constructor(credentials: Credentials, options?: ClientOptions);
    static withApiKey(apiKey: string, options?: ClientOptions): Client;
    static withMerchantId(merchantId: string, options?: ClientOptions): Client;
    private static initConfig;
    private initUserAgent;
    addUserAgentComponent(component: string, version?: string): void;
    private endpoint;
    get payments(): PaymentsEndpoint;
    get mode(): ApiMode;
    set mode(mode: ApiMode);
}
export default Client;
