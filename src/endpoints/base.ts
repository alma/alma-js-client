import {Constructor} from "../types";
import Context from "../context";
import Request from "../http/request";

export class Endpoint {
  private readonly context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  get logger(): Console {
    return this.context.logger;
  }

  request(path: string): Request {
    return new Request(this.context, this.context.urlFor(path));
  }
}

export default Endpoint;
