export declare type Constructor<T> = {
    new (...args: any[]): T;
};
declare type AtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export declare type integer = number;
declare type Address = {
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
};
declare type PaymentDataProps = {
    purchase_amount: integer;
    installments_count?: integer;
    return_url: string;
    customer_cancel_url?: string;
    ipn_callback_url?: string;
    billing_address?: Address;
    shipping_address?: Address;
    custom_data?: any;
};
declare type CustomerData = {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    addresses?: Address[];
};
declare type OrderData = {
    merchant_reference?: string;
    merchant_url?: string;
    data?: any;
};
interface PaymentPayloadBase {
    customer?: CustomerData;
    orders?: OrderData[];
    order?: OrderData;
}
export declare type SingleEligibilityPayload = {
    installments_count?: integer;
};
export declare type MultipleEligibilityPayload = {
    installments_count?: integer[];
};
export interface PaymentEligibilityPayload extends PaymentPayloadBase {
    payment: Omit<PartialBy<PaymentDataProps, 'return_url'>, 'installments_count'> & (SingleEligibilityPayload | MultipleEligibilityPayload);
}
export interface PaymentPayload extends PaymentPayloadBase {
    payment: AtLeastOne<PaymentDataProps, 'billing_address' | 'shipping_address'>;
}
export {};
