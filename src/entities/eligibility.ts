import Entity from "./base";
import {integer} from "../types";

export interface IInstallment {
  purchase_amount: integer;
  customer_fee: integer;
  due_date: integer;
}

export type IPaymentPlan = IInstallment[];

export interface IEligibility {
  eligible: boolean;
  installments_count: integer;
  payment_plan?: IPaymentPlan;
}

export type EligibleEligibility = Required<IEligibility>;
export type NotEligibleEligibility = Omit<IEligibility, 'payment_plan'>;

export class Eligibility extends Entity implements IEligibility {
  // @ts-ignore
  public eligible: boolean;
  // @ts-ignore
  // tslint:disable-next-line:variable-name
  public installments_count: integer;
  // @ts-ignore
  // tslint:disable-next-line:variable-name
  public payment_plan: IPaymentPlan;

  get isEligible(): boolean {
    return this.eligible;
  }
}

export default Eligibility;
