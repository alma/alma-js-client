// A generic Constructor type
export type Constructor<T> = {
  new (...args: any[]): T
}

// This type allows declaring a type that ensures at least one of a set of keys is provided
// https://stackoverflow.com/a/49725198/283481
type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

// This type allows making some properties optional from a base type where they're required
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// For semantic purposes
export type integer = number

type Address = {
  first_name?: string
  last_name?: string
  company?: string
  line1?: string
  line2?: string
  postal_code?: string
  city?: string
  country?: string
  email?: string
  phone?: string
}

type PaymentDataProps = {
  purchase_amount: integer
  installments_count?: integer

  return_url: string
  customer_cancel_url?: string
  ipn_callback_url?: string

  billing_address?: Address
  shipping_address?: Address

  custom_data?: any
}

type CustomerPayload = {
  first_name?: string
  last_name?: string
  email?: string
  phone?: string
  addresses?: Address[]
}

type OrderPayload = {
  merchant_reference?: string
  merchant_url?: string
  data?: any
}

interface PaymentPayloadBase {
  customer?: CustomerPayload
  orders?: OrderPayload[]
  order?: OrderPayload
}

// For the Eligibility endpoint, `return_url` is optional and `installments_count` can be an array
// of integers
export type SingleEligibilityPayload = { installments_count?: integer }
export type MultipleEligibilityPayload = { installments_count?: integer[] }

export interface PaymentEligibilityPayload extends PaymentPayloadBase {
  payment: Omit<PartialBy<PaymentDataProps, 'return_url'>, 'installments_count'> &
    (SingleEligibilityPayload | MultipleEligibilityPayload)
}

// For the Payment creation endpoint, one of `billing_address` or `shipping_address` is required
export interface PaymentPayload extends PaymentPayloadBase {
  payment: AtLeastOne<PaymentDataProps, 'billing_address' | 'shipping_address'>
}

export interface Card {
  brand: string
  country: string
  created: number
  exp_month: number
  exp_year: number
  funding: string
  id: string
  last4: string
  psp_representations: {
    stripe: {
      customer_id: string
      original_source_id: string
    }
  }
  three_d_secure_possible: boolean
  verified: boolean
}
export interface Installment {
  customer_fee: number
  due_date: number
  original_purchase_amount: number
  purchase_amount: number
  state: 'pending' | 'paid' | 'covered'
}
export interface Requirement {
  is_met: boolean
  name:
    | 'customer_info'
    | 'valid_payment_method'
    | 'phone_verification'
    | 'id_video_verification'
    | 'banking_data_verification'
}
export type State =
  | 'not_ready'
  | 'not_started'
  | 'scored_no'
  | 'scored_maybe'
  | 'scored_yes'
  | 'in_progress'
  | 'paid'
  | 'late'
  | 'default'

export interface Customer extends CustomerPayload {
  addresses: Address[]
  bank_accounts: []
  banking_data_collected: boolean
  birth_date: string | null
  business_id_number: string | null
  business_name: string | null
  card: Card | null
  cards: Card[]
  collection_state: string | null
  created: number
  email: string | null
  email_verified: boolean
  first_name: string | null
  id: string
  is_business: boolean
  last_name: string | null
  phone: string | null
  phone_verified: boolean
  primary_bank_account: Record<string, unknown> | null
}

export interface Order extends OrderPayload {
  comment: string | null
  created: number
  customer_url: string | null
  data: Record<string, unknown>
  id: string
  merchant_reference: string | null
  merchant_url: string | null
  payment: string
}

export interface Refund {
  id: string
  created: number
  amount: number
  payment: string
  merchant_reference: string | null
  from_payment_cancellation: boolean
}

export interface User {
  id: string
  created: number
  name: string
  email: string
  is_alma_staff: boolean
  staff_role: string
}

export interface Payment {
  billing_address?: Address
  can_be_charged: boolean
  created: number
  custom_data: Record<string, unknown>
  customer: Customer
  customer_cancel_url: string
  customer_fee: number
  deferred_days: number
  deferred_months: number
  id: string
  installments_count: number
  is_customer_kyced: boolean
  locale: string
  merchant_id: string
  merchant_name: string
  merchant_website: string | null
  logo_url?: string
  orders: Order[]
  origin: string
  payment_plan: Installment[]
  preferred_payment_method: 'card' | 'bank_debit' | null
  purchase_amount: number
  refunds: Refund[]
  requirements: Requirement[]
  return_url: string
  seller: User | null
  sepa_debit_enabled: boolean
  shipping_address?: Address
  state: State
  url: string
  using_sepa_debit: boolean
}
