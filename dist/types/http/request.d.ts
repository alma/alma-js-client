import Context from '../context';
import Response from './response';
export declare class RequestError extends Error {
    private request;
    private response;
    constructor(message: string, request?: Request, response?: Response);
}
export declare class Request {
    private readonly context;
    private readonly url;
    private readonly headers;
    private params;
    private body;
    constructor(context: Context, url: string);
    setBody(body: unknown): Request;
    setQueryParams(params: Record<string, unknown>): Request;
    private requestConfig;
    private sendRequest;
    get(): Promise<Response>;
    post(): Promise<Response>;
    put(): Promise<Response>;
    private static processResponse;
    private processErrorResponse;
}
export default Request;
