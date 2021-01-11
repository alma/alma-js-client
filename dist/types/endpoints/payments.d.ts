import Endpoint from './base';
import { MultipleEligibilityPayload, Payment, PaymentEligibilityPayload, PaymentPayload } from '../types';
import Eligibility from '../entities/eligibility';
declare type EligibilityResult<T extends PaymentEligibilityPayload> = T['payment'] extends MultipleEligibilityPayload ? Eligibility[] : Eligibility;
export declare class PaymentsEndpoint extends Endpoint {
    eligibility<T extends PaymentEligibilityPayload>(data: T): Promise<EligibilityResult<T>>;
    create(data: PaymentPayload): Promise<Payment>;
}
export default PaymentsEndpoint;
