import {AxiosResponse} from "axios";

export class Response {
  private readonly response: AxiosResponse;

  constructor(response: AxiosResponse) {
    this.response = response;
  }

  get statusCode(): number {
    return this.response.status;
  }

  get data(): any {
    return this.response.data;
  }
}

export default Response;
