import Endpoint from './base'
import { MultipleEligibilityPayload,Payment, PaymentEligibilityPayload, PaymentPayload } from '../types'
import Eligibility from '../entities/eligibility'

const PAYMENTS_PATH = '/v1/payments'

type EligibilityResult<
  T extends PaymentEligibilityPayload
> = T['payment'] extends MultipleEligibilityPayload ? Eligibility[] : Eligibility

export class PaymentsEndpoint extends Endpoint {
  async eligibility<T extends PaymentEligibilityPayload>(data: T): Promise<EligibilityResult<T>>
  async eligibility(data: PaymentEligibilityPayload): Promise<Eligibility | Eligibility[]> {
    const response = await this.request(`${PAYMENTS_PATH}/eligibility`).setBody(data).post()

    const serverError = response.statusCode >= 500
    let responseData = response.data
    let result: Eligibility | Eligibility[]

    if (!serverError && Array.isArray(responseData)) {
      responseData = responseData.sort((a, b) => {
        return a.installments_count - b.installments_count
      })

      result = responseData.map((d: Record<string, unknown>) => new Eligibility(d))
    } else if (!serverError && responseData && typeof responseData === 'object') {
      result = new Eligibility(responseData)
    } else {
      result = new Eligibility({ eligible: false })
    }

    return result
  }

  async create(data: PaymentPayload): Promise<Payment> {
    const response = await this.request(`${PAYMENTS_PATH}`).setBody(data).post()
    return response.data
  }
}

export default PaymentsEndpoint
