import { AxiosResponse } from 'axios';
export declare class Response {
    private readonly response;
    constructor(response: AxiosResponse);
    get statusCode(): number;
    get data(): any;
}
export default Response;
