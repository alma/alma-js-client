import Credentials from './base';
import { AxiosRequestConfig } from 'axios';
export declare class ApiKeyCredentials implements Credentials {
    readonly apiKey: string;
    constructor(apiKey: string);
    configureCredentials(config: AxiosRequestConfig): AxiosRequestConfig;
}
export default ApiKeyCredentials;
