import { expectTypeOf } from 'expect-type'

import { PaymentsEndpoint } from '@/endpoints/payments'
import Context from '@/context'
import Eligibility from '@/entities/eligibility'
import Request from '../../src/http/request'
import * as RequestModule from '../../src/http/request'
import Response from '../../src/http/response'
import MerchantIdCredentials from '../../src/credentials/MerchantIdCredentials'
import { ApiMode } from '../../src'
import { AxiosResponse } from 'axios'

const FAKE_CONTEXT = new Context(new MerchantIdCredentials('fake-id'), {
  apiRoot: { test: 'https://api.sandbox.getalma.eu', live: '' },
  mode: ApiMode.TEST,
  logger: console,
})

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

  describe('fetch method', () => {
    it('exists', () => {
      expect(PaymentsEndpoint.prototype.fetch).toBeDefined()
    })

    it('calls the API with provided payment ID', async () => {
      const paymentId = 'A_PAYMENT_ID'

      const newRequest = jest.spyOn(PaymentsEndpoint.prototype, 'request')
      const get = jest
        .spyOn(Request.prototype, 'get')
        .mockImplementation(async () => new Response({} as AxiosResponse))

      const endpoint = new PaymentsEndpoint(FAKE_CONTEXT)
      await endpoint.fetch(paymentId)

      expect(newRequest).toHaveBeenCalledWith(`/v1/payments/${paymentId}`)
      expect(get).toHaveBeenCalled()

      get.mockRestore()
      newRequest.mockRestore()
    })

    it('returns the payment data', async () => {
      const paymentData = {
        id: 'A_PAYMENT_ID',
        url: 'https://checkout.sandbox.getalma.eu/A_PAYMENT_ID',
      }

      const get = jest.spyOn(Request.prototype, 'get').mockImplementation(
        async () =>
          new Response({
            data: paymentData,
            status: 200,
            statusText: 'OK',
            headers: { 'Content-type': 'application/json' },
            config: {},
          })
      )

      const endpoint = new PaymentsEndpoint(FAKE_CONTEXT)
      const receivedData = await endpoint.fetch(paymentData.id)

      expect(receivedData).toEqual(paymentData)

      get.mockRestore()
    })
  })
})
