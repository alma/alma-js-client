import Credentials from "./base";
import {AxiosRequestConfig} from "axios";

export class MerchantIdCredentials implements Credentials {
  private readonly merchantId: string;

  constructor(merchantId: string) {
    if (!merchantId.trim()) {
      throw new Error('A merchant ID is required to instantiate a new Client')
    }

    this.merchantId = merchantId;
  }

  configureCredentials(config: AxiosRequestConfig): AxiosRequestConfig {
    // Add the Authorization header to the request configuration
    return {
      ...config,
      headers: {
        ...config.headers,
        "Authorization": `Alma-Merchant-Auth ${this.merchantId}`,
      }
    };
  }

}

export default MerchantIdCredentials;
