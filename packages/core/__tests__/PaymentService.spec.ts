import { CoreError } from '../src/errors';
import { AdapterRegistry } from '../src/modules/payment/registry';
import { PaymentService } from '../src/modules/payment/services';
import {
  PaymentCancelParams,
  PaymentCreateParams,
  PaymentResponse,
  PaymentRetrieveParams,
  PaymentStatus,
} from '../src/modules/payment/types';

describe('PaymentService', () => {
  let registry: AdapterRegistry;
  let service: PaymentService;

  // Mock adapter
  const mockAdapter = {
    payment: {
      create: jest.fn(),
      retrieve: jest.fn(),
      cancel: jest.fn(),
    },
  };

  beforeEach(() => {
    registry = new AdapterRegistry({ stripe: mockAdapter });
    service = new PaymentService(registry);

    jest.clearAllMocks();
  });

  it('should call adapter.payment.create and return response', async () => {
    const params: PaymentCreateParams = {
      gateway: 'stripe',
      body: { amount: 1000, currency: 'USD' },
    };

    const mockResponse: PaymentResponse = {
      id: 'pay_123',
      status: 'succeeded' as PaymentStatus,
      amount: 1000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
    };

    mockAdapter.payment.create.mockResolvedValue(mockResponse);

    const result = await service.create(params);

    expect(mockAdapter.payment.create).toHaveBeenCalledWith(params.body);
    expect(result).toEqual(mockResponse);
  });

  it('should throw CoreError when adapter.create throws', async () => {
    const params: PaymentCreateParams = {
      gateway: 'stripe',
      body: { amount: 1000, currency: 'USD' },
    };

    mockAdapter.payment.create.mockRejectedValue(new Error('Adapter failure'));

    await expect(service.create(params)).rejects.toThrow(CoreError);
  });

  it('should call adapter.payment.retrieve and return response', async () => {
    const params: PaymentRetrieveParams = { gateway: 'stripe', id: 'pay_123' };

    const mockResponse: PaymentResponse = {
      id: 'pay_123',
      status: 'succeeded' as PaymentStatus,
      amount: 1000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
    };

    mockAdapter.payment.retrieve.mockResolvedValue(mockResponse);

    const result = await service.retrieve(params);

    expect(mockAdapter.payment.retrieve).toHaveBeenCalledWith({ id: params.id });
    expect(result).toEqual(mockResponse);
  });

  it('should throw CoreError when adapter.retrieve throws', async () => {
    const params: PaymentRetrieveParams = { gateway: 'stripe', id: 'pay_123' };

    mockAdapter.payment.retrieve.mockRejectedValue(new Error('Retrieve failure'));

    await expect(service.retrieve(params)).rejects.toThrow(CoreError);
  });

  it('should call adapter.payment.cancel and return response', async () => {
    const params: PaymentCancelParams = { gateway: 'stripe', id: 'pay_123', reason: 'test' };

    const mockResponse: PaymentResponse = {
      id: 'pay_123',
      status: 'canceled' as PaymentStatus,
      amount: 1000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
    };

    mockAdapter.payment.cancel.mockResolvedValue(mockResponse);

    const result = await service.cancel(params);

    expect(mockAdapter.payment.cancel).toHaveBeenCalledWith({
      id: params.id,
      reason: params.reason,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw CoreError when adapter.cancel throws', async () => {
    const params: PaymentCancelParams = { gateway: 'stripe', id: 'pay_123', reason: 'test' };

    mockAdapter.payment.cancel.mockRejectedValue(new Error('Cancel failure'));

    await expect(service.cancel(params)).rejects.toThrow(CoreError);
  });
});
