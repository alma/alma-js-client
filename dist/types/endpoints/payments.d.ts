import Endpoint from './base';
import { PaymentEligibilityPayload } from '../types';
import Eligibility from '../entities/eligibility';
export declare class PaymentsEndpoint extends Endpoint {
    eligibility(data: PaymentEligibilityPayload): Promise<Eligibility | Eligibility[]>;
}
export default PaymentsEndpoint;
