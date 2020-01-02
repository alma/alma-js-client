import Credentials from "./base";
import {AxiosRequestConfig} from "axios";

export class ApiKeyCredentials implements Credentials {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey.trim()) {
      throw new Error("An API key is required to instantiate a new Client");
    }

    this.apiKey = apiKey;
  }

  configureCredentials(config: AxiosRequestConfig): AxiosRequestConfig {
    // Add the Authorization header to the request configuration
    return {
      ...config,
      headers: {
        ...config.headers,
        "Authorization": `Alma-Auth ${this.apiKey}`,
      }
    };
  }

}

export default ApiKeyCredentials;
