// Supported payment methods across gateways
export type PaymentMethod =
  | 'card'
  | 'bank_transfer'
  | 'ewallet'
  | 'qris'
  | 'virtual_account'
  | 'other';

// Unified payment status values used by core
export type PaymentStatus = 'requires_action' | 'pending' | 'succeeded' | 'failed' | 'canceled';

// Base request fields required for creating a payment
export interface BasePaymentRequest {
  amount: number; // Amount in smallest currency unit (e.g. cents)
  currency: string; // ISO currency code (e.g. "USD", "IDR")
  method?: PaymentMethod; // Optional standardized payment method
  description?: string; // Optional description for the payment
  customerId?: string; // Optional customer identifier
  metadata?: Record<string, string>; // Arbitrary metadata key-value pairs
  capture?: boolean; // Whether to capture immediately (if supported)
}

// Generic PaymentRequest allows adapters to add custom fields
export type PaymentRequest<T extends object = BasePaymentRequest> = BasePaymentRequest & T;

// Standardized response returned by core after payment operations
// Adapters can attach raw provider payloads via generic type
export interface PaymentResponse<T extends object = Record<string, never>> {
  id: string; // Unique identifier of the payment
  status: PaymentStatus; // Unified status value
  amount: number; // Amount in smallest currency unit
  currency: string; // ISO currency code
  method?: PaymentMethod; // Optional standardized method
  createdAt: string; // ISO timestamp when payment was created
  updatedAt?: string; // Optional ISO timestamp when updated
  raw?: T; // Provider-specific raw payload for debugging
}

// Request type for retrieving a payment by ID
export interface PaymentRetrieveRequest {
  id: string;
}

// Request type for canceling a payment
export interface PaymentCancelRequest {
  id: string;
  reason?: string; // Optional cancellation reason
}

// Contract that every adapter must implement for the payment domain
export interface PaymentGateway<
  Req extends object = BasePaymentRequest,
  Res extends object = Record<string, never>,
> {
  create(request: PaymentRequest<Req>): Promise<PaymentResponse<Res>>;
  retrieve(request: PaymentRetrieveRequest): Promise<PaymentResponse<Res>>;
  cancel(request: PaymentCancelRequest): Promise<PaymentResponse<Res>>;
}

// Adapter contract: each provider (Stripe, Xendit, etc.) must expose a payment gateway
export interface GatewayAdapter<
  Req extends object = BasePaymentRequest,
  Res extends object = Record<string, never>,
> {
  payment: PaymentGateway<Req, Res>;
}

// High-level params accepted by PayXOne orchestrator for multi-adapter routing
export interface PaymentCreateParams<Req extends object = BasePaymentRequest> {
  gateway: string; // Key identifying which adapter to use
  body: PaymentRequest<Req>; // Request body passed to the adapter
}

export interface PaymentRetrieveParams {
  gateway: string; // Key identifying which adapter to use
  id: string; // Payment ID to retrieve
}

export interface PaymentCancelParams {
  gateway: string; // Key identifying which adapter to use
  id: string; // Payment ID to cancel
  reason?: string; // Optional cancellation reason
}
