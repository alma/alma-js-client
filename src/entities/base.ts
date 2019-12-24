export class Entity {
  // Lets TypeScript know we're going to access attributes via the `[]` operator
  [attribute: string]: any;
  private readonly data: any;

  constructor(data: any) {
    this.data = data;
    Object.keys(data).forEach(attr => this[attr] = data[attr]);
  }

  get rawData() {
    return this.data;
  }
}

export default Entity;
