// A generic Constructor type
export type Constructor<T> = {
  new(...args: any[]): T;
};

// This type allows declaring a type that ensures at least one of a set of keys is provided
// https://stackoverflow.com/a/49725198/283481
type AtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
}[Keys]

// This type allows making some properties optional from a base type where they're required
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// For semantic purposes
type integer = number;

type Address = {
  first_name?: string;
  last_name?: string;
  company?: string;
  line1?: string;
  line2?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
}

type PaymentDataProps = {
  purchase_amount: integer;
  installments_count?: integer;

  return_url: string;
  customer_cancel_url?: string;
  ipn_callback_url?: string;

  billing_address?: Address;
  shipping_address?: Address;

  custom_data?: any;
}

type CustomerData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
}

type OrderData = {
  merchant_reference?: string;
  merchant_url?: string;
  data?: any;
}

interface PaymentPayloadBase {
  customer?: CustomerData;
  orders?: OrderData[];
  order?: OrderData;
}

// For the Eligibility endpoint, `return_url` is optional and `installments_count` can be an array
// of integers
export interface PaymentEligibilityPayload extends PaymentPayloadBase {
  payment: Omit<PartialBy<PaymentDataProps, 'return_url'>, 'installments_count'> & { installments_count?: integer | integer[] };
}

// For the Payment creation endpoint, one of `billing_address` or `shipping_address` is required
export interface PaymentPayload extends PaymentPayloadBase {
  payment: AtLeastOne<PaymentDataProps, "billing_address" | "shipping_address">;
}
