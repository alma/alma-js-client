import Context from "../context";
import Request from "../http/request";
export declare class Endpoint {
    private readonly context;
    constructor(context: Context);
    get logger(): Console;
    request(path: string): Request;
}
export default Endpoint;
