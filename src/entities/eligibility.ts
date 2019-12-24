import Entity from "./base";

export class Eligibility extends Entity {
  get isEligible(): boolean {
    return this.eligible;
  }
}

export default Eligibility;
