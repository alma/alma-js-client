import axios, {AxiosRequestConfig, AxiosResponse, Method} from "axios";
import Context from "../context";
import Response from "./response";

export class RequestError extends Error {
  private request: Request | undefined;
  private response: Response | undefined;

  constructor(message: string, request?: Request, response?: Response) {
    super();
    this.message = message;
    this.request = request;
    this.response = response;
  }
}

export class Request {
  private readonly context: Context;
  private readonly url: string;
  private readonly headers: Record<string, string>;
  private params: Record<string, any>;
  private body: any;

  constructor(context: Context, url: string) {
    this.context = context;
    this.url = url;

    this.headers = {
      "User-Agent": this.context.userAgentString,
      "Accept": "application/json",
    };

    this.params = {};
    this.body = null;
  }

  setBody(body: any): Request {
    this.body = body;
    return this;
  }

  setQueryParams(params: Record<string, any>): Request {
    this.params = params;
    return this;
  }

  private requestConfig(method: Method): AxiosRequestConfig {
    let config: AxiosRequestConfig = {
      url: this.url,
      headers: this.headers,
      params: this.params,
      method
    };

    if (this.body) {
      config.data = this.body;
    }

    // Enrich the request configuration with credentials information
    config = this.context.credentials.configureCredentials(config);

    return config;
  }

  private sendRequest(method: Method): Promise<Response> {
    return axios
      .request(this.requestConfig(method))
      .then(Request.processResponse)
      .catch(this.processErrorResponse)
  }

  get(): Promise<Response> {
    this.body = null;
    return this.sendRequest("get");
  }

  post(): Promise<Response> {
    return this.sendRequest("post");
  }

  put(): Promise<Response> {
    return this.sendRequest("put");
  }

  private static processResponse(resp: AxiosResponse): Response {
    return new Response(resp);
  }

  private processErrorResponse(error: any): never {
    let errorMessage = "Unknown error";
    let response: Response | undefined;

    if (error.response) {
      response = new Response(error.response);
      if (response.data) {
        errorMessage = response.data.message || response.data.error;
      }
    } else {
      errorMessage = `${error.name}: ${error.message}`;
    }

    throw new RequestError(errorMessage, this, response);
  }
}

export default Request;
