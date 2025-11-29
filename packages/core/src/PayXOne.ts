import { AdapterMap, AdapterRegistry } from './modules/payment/payment.adapter.registry';
import { PaymentService } from './modules/payment/payment.services';
import {
  PaymentCancelParams,
  PaymentCreateParams,
  PaymentResponse,
  PaymentRetrieveParams,
} from './modules/payment/payment.types';

export class PayXOne {
  private readonly registry: AdapterRegistry;
  private readonly paymentService: PaymentService;

  constructor(adapters: AdapterMap) {
    this.registry = new AdapterRegistry(adapters);
    this.paymentService = new PaymentService(this.registry);
  }

  async createPayment(params: PaymentCreateParams): Promise<PaymentResponse> {
    return this.paymentService.create(params);
  }

  async retrievePayment(params: PaymentRetrieveParams): Promise<PaymentResponse> {
    return this.paymentService.retrieve(params);
  }

  async cancelPayment(params: PaymentCancelParams): Promise<PaymentResponse> {
    return this.paymentService.cancel(params);
  }
}
