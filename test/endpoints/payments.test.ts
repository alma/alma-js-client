import { expectTypeOf } from 'expect-type'

import { PaymentsEndpoint } from '@/endpoints/payments'
import Context from '@/context'
import Eligibility from '@/entities/eligibility'

describe('Payments endpoint', () => {
  describe('eligibility method', () => {
    it('exists', () => {
      expect(PaymentsEndpoint.prototype.eligibility).toBeDefined()
    })

    it('correctly infers return type from payload argument', () => {
      const spy = jest.spyOn(PaymentsEndpoint.prototype, 'eligibility').mockReturnValue(null)

      // As we're only testing TypeScript's type inference, it's OK to instantiate without any real context
      const endpoint = new PaymentsEndpoint({} as Context)

      // Unspecified `payment.installments_count` in payload leads to single `Eligibility` result
      let singleEligibility = endpoint.eligibility({
        payment: {
          purchase_amount: 1500,
        },
      })
      expectTypeOf(singleEligibility).toEqualTypeOf<Promise<Eligibility>>()

      // If `typeof payment.installments_count` is `number`, result is `Eligibility`
      singleEligibility = endpoint.eligibility({
        payment: {
          purchase_amount: 1500,
          installments_count: 3,
        },
      })
      expectTypeOf(singleEligibility).toEqualTypeOf<Promise<Eligibility>>()

      // If `typeof payment.installments_count` is `number[]`, result is `Eligibility[]`
      const multipleEligibility = endpoint.eligibility({
        payment: {
          purchase_amount: 1500,
          installments_count: [3, 4],
        },
      })
      expectTypeOf(multipleEligibility).toEqualTypeOf<Promise<Eligibility[]>>()

      spy.mockRestore()
    })
  })
})
