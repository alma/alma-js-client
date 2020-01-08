import Endpoint from "./base";
import {PaymentEligibilityPayload} from "../types";
import Eligibility from "../entities/eligibility";

const PAYMENTS_PATH = "/v1/payments";

export class PaymentsEndpoint extends Endpoint {
  async eligibility(data: PaymentEligibilityPayload): Promise<Eligibility | Eligibility[]> {
    let response = await this.request(`${PAYMENTS_PATH}/eligibility`).setBody(data).post();

    let serverError = response.statusCode >= 500;
    let responseData = response.data;
    let result: Eligibility | Eligibility[];

    if (!serverError && Array.isArray(responseData)) {
      responseData = responseData.sort((a, b) => {
        return a.installments_count - b.installments_count;
      });

      result = responseData.map((d: any) => new Eligibility(d));
    } else if (!serverError && responseData && typeof responseData === "object") {
      result = new Eligibility(responseData);
    } else {
      result = new Eligibility({eligible: false});
    }

    return result;
  }
}

export default PaymentsEndpoint
