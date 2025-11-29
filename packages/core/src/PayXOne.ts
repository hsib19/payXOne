import { CoreError } from './errors';
import { AdapterMap, AdapterRegistry } from './modules/payment/registry';
import {
  PaymentCancelParams,
  PaymentCreateParams,
  PaymentResponse,
  PaymentRetrieveParams,
} from './modules/payment/types';

export class PayXOne {
  private readonly registry: AdapterRegistry;

  constructor(adapters: AdapterMap) {
    this.registry = new AdapterRegistry(adapters);
  }

  async createPayment(params: PaymentCreateParams): Promise<PaymentResponse> {
    try {
      const adapter = this.registry.get(params.gateway);
      return await adapter.payment.create(params.body);
    } catch (err) {
      throw CoreError.from(err);
    }
  }

  async retrievePayment(params: PaymentRetrieveParams): Promise<PaymentResponse> {
    try {
      const adapter = this.registry.get(params.gateway);
      return await adapter.payment.retrieve({ id: params.id });
    } catch (err) {
      throw CoreError.from(err);
    }
  }

  async cancelPayment(params: PaymentCancelParams): Promise<PaymentResponse> {
    try {
      const adapter = this.registry.get(params.gateway);
      return await adapter.payment.cancel({ id: params.id, reason: params.reason });
    } catch (err) {
      throw CoreError.from(err);
    }
  }
}
