import Credentials from './base';
import { AxiosRequestConfig } from 'axios';
export declare class MerchantIdCredentials implements Credentials {
    private readonly merchantId;
    constructor(merchantId: string);
    configureCredentials(config: AxiosRequestConfig): AxiosRequestConfig;
}
export default MerchantIdCredentials;
