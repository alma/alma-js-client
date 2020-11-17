export declare class Entity {
    [attribute: string]: unknown;
    private readonly data;
    constructor(data: Record<string, unknown>);
    get rawData(): Record<string, unknown>;
}
export default Entity;
