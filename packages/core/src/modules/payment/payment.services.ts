import { CoreError } from '../../errors';
import { AdapterRegistry } from './payment.adapter.registry';
import {
  PaymentCancelParams,
  PaymentCreateParams,
  PaymentResponse,
  PaymentRetrieveParams,
} from './payment.types';

export class PaymentService {
  constructor(private readonly registry: AdapterRegistry) {}

  async create(params: PaymentCreateParams): Promise<PaymentResponse> {
    try {
      const adapter = this.registry.get(params.gateway);
      return await adapter.payment.create(params.body);
    } catch (err) {
      throw CoreError.from(err);
    }
  }

  async retrieve(params: PaymentRetrieveParams): Promise<PaymentResponse> {
    try {
      const adapter = this.registry.get(params.gateway);
      return await adapter.payment.retrieve({ id: params.id });
    } catch (err) {
      throw CoreError.from(err);
    }
  }

  async cancel(params: PaymentCancelParams): Promise<PaymentResponse> {
    try {
      const adapter = this.registry.get(params.gateway);
      return await adapter.payment.cancel({ id: params.id, reason: params.reason });
    } catch (err) {
      throw CoreError.from(err);
    }
  }
}
