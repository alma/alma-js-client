import {ApiRootObject, ClientOptions} from "./client";
import {ApiMode} from "./consts";

export class Context {
  public readonly apiKey: string;
  private readonly options: ClientOptions;
  private userAgentComponents: string[] = [];

  constructor(apiKey: string, options: ClientOptions) {
    this.apiKey = apiKey;
    this.options = options;
  }

  get apiRoot(): string {
    // At this point, we *know* options.apiRoot is an ApiRootObject object and not a string
    return (this.options.apiRoot as ApiRootObject)[this.options.mode!].trim();
  }

  get mode(): ApiMode {
    return this.options.mode!;
  }

  get logger(): Console {
    return this.options.logger!;
  }

  urlFor(path: string) {
    let root = this.apiRoot.endsWith("/") ? this.apiRoot.slice(0, -1) : this.apiRoot;
    path = path.startsWith("/") ? path.slice(1) : path;

    return `${root}/${path}`;
  }

  addUserAgentComponent(component: string, version?: string) {
    if (version) {
      this.userAgentComponents.push(`${component}/${version}`);
    } else {
      this.userAgentComponents.push(component);
    }
  }

  get userAgentString(): string {
    return this.userAgentComponents.reverse().join("; ");
  }
}

export default Context;
