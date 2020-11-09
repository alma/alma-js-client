export class Entity {
  // Lets TypeScript know we're going to access attributes via the `[]` operator
  [attribute: string]: unknown
  private readonly data: Record<string, unknown>

  constructor(data: Record<string, unknown>) {
    this.data = data
    Object.keys(data).forEach((attr) => (this[attr] = data[attr]))
  }

  get rawData(): Record<string, unknown> {
    return this.data
  }
}

export default Entity
