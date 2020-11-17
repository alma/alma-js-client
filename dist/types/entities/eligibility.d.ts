import Entity from './base';
import { integer } from '../types';
export interface IInstallment {
    purchase_amount: integer;
    customer_fee: integer;
    due_date: integer;
}
export declare type IPaymentPlan = IInstallment[];
export interface IEligibility {
    eligible: boolean;
    installments_count: integer;
    payment_plan?: IPaymentPlan;
}
export declare type EligibleEligibility = Required<IEligibility>;
export declare type NotEligibleEligibility = Omit<IEligibility, 'payment_plan'>;
export declare class Eligibility extends Entity implements IEligibility {
    eligible: boolean;
    installments_count: integer;
    payment_plan: IPaymentPlan;
    get isEligible(): boolean;
}
export default Eligibility;
