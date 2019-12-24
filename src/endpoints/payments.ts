import Endpoint from "./base";
import {PaymentEligibilityPayload} from "../types";
import Eligibility from "../entities/eligibility";

const PAYMENTS_PATH = "/v1/payments";

export class PaymentsEndpoint extends Endpoint {
  async eligibility(data: PaymentEligibilityPayload): Promise<Eligibility> {
    let response = await this.request(`${PAYMENTS_PATH}/eligibility`).setBody(data).post();
    return new Eligibility(response.data)
  }
}

export default PaymentsEndpoint
