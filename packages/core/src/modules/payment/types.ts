export type PaymentMethod =
  | 'card'
  | 'bank_transfer'
  | 'ewallet'
  | 'qris'
  | 'virtual_account'
  | 'other';

export type PaymentStatus = 'requires_action' | 'pending' | 'succeeded' | 'failed' | 'canceled';

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: PaymentMethod;
  description?: string;
  customerId?: string;
  metadata?: Record<string, string>;
  capture?: boolean;
}

export interface PaymentResponse {
  id: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  method: PaymentMethod;
  createdAt: string;
  updatedAt?: string;
  raw?: unknown;
}

export interface PaymentRetrieveRequest {
  id: string;
}

export interface PaymentCancelRequest {
  id: string;
  reason?: string;
}

export interface PaymentGateway {
  create(request: PaymentRequest): Promise<PaymentResponse>;
  retrieve(request: PaymentRetrieveRequest): Promise<PaymentResponse>;
  cancel(request: PaymentCancelRequest): Promise<PaymentResponse>;
}

export interface GatewayAdapter {
  payment: PaymentGateway;
}
