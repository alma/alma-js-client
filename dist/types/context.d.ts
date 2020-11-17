import { ClientConfig } from './client';
import { ApiMode } from './consts';
import Credentials from './credentials/base';
export declare class Context {
    readonly credentials: Credentials;
    private readonly config;
    private userAgentComponents;
    constructor(credentials: Credentials, options: ClientConfig);
    get apiRoot(): string;
    get mode(): ApiMode;
    set mode(mode: ApiMode);
    get logger(): Console;
    urlFor(path: string): string;
    addUserAgentComponent(component: string, version?: string): void;
    get userAgentString(): string;
}
export default Context;
