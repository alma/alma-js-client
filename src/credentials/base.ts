import {AxiosRequestConfig} from "axios";

export interface Credentials {
  configureCredentials(config: AxiosRequestConfig): AxiosRequestConfig;
}

export default Credentials;
