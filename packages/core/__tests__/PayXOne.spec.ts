import { PayXOne } from '../src/PayXOne';
import {
  PaymentCancelParams,
  PaymentCreateParams,
  PaymentResponse,
  PaymentRetrieveParams,
  PaymentStatus,
} from '../src/modules/payment/types';

// Mock PaymentService so we can drive success/error paths precisely
import { PaymentService } from '../src/modules/payment/services';
jest.mock('../src/modules/payment/services');

describe('PayXOne wrapper', () => {
  // Mocks for PaymentService methods
  const createMock = jest.fn();
  const retrieveMock = jest.fn();
  const cancelMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Make the PaymentService constructor return our method mocks
    (PaymentService as jest.MockedClass<typeof PaymentService>).mockImplementation(() => {
      return {
        create: createMock,
        retrieve: retrieveMock,
        cancel: cancelMock,
      } as unknown as PaymentService;
    });
  });

  it('createPayment delegates to PaymentService.create and returns the response', async () => {
    const payxone = new PayXOne({}); // adapters not used because PaymentService is mocked

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

    createMock.mockResolvedValueOnce(mockResponse);

    const res = await payxone.createPayment(params);

    expect(createMock).toHaveBeenCalledWith(params);
    expect(res).toEqual(mockResponse);
  });

  it('createPayment propagates a rejection from PaymentService.create', async () => {
    const payxone = new PayXOne({});

    const params: PaymentCreateParams = {
      gateway: 'stripe',
      body: { amount: 2000, currency: 'IDR' },
    };

    const err = new Error('create failed');
    createMock.mockRejectedValueOnce(err);

    await expect(payxone.createPayment(params)).rejects.toThrow('create failed');
    expect(createMock).toHaveBeenCalledWith(params);
  });

  it('retrievePayment delegates to PaymentService.retrieve and returns the response', async () => {
    const payxone = new PayXOne({});

    const params: PaymentRetrieveParams = { gateway: 'stripe', id: 'pay_123' };

    const mockResponse: PaymentResponse = {
      id: 'pay_123',
      status: 'succeeded' as PaymentStatus,
      amount: 1500,
      currency: 'USD',
      createdAt: new Date().toISOString(),
    };

    retrieveMock.mockResolvedValueOnce(mockResponse);

    const res = await payxone.retrievePayment(params);

    expect(retrieveMock).toHaveBeenCalledWith(params);
    expect(res).toEqual(mockResponse);
  });

  it('retrievePayment propagates a rejection from PaymentService.retrieve', async () => {
    const payxone = new PayXOne({});

    const params: PaymentRetrieveParams = { gateway: 'stripe', id: 'pay_456' };

    const err = new Error('retrieve failed');
    retrieveMock.mockRejectedValueOnce(err);

    await expect(payxone.retrievePayment(params)).rejects.toThrow('retrieve failed');
    expect(retrieveMock).toHaveBeenCalledWith(params);
  });

  it('cancelPayment delegates to PaymentService.cancel and returns the response', async () => {
    const payxone = new PayXOne({});

    const params: PaymentCancelParams = {
      gateway: 'stripe',
      id: 'pay_123',
      reason: 'user_request',
    };

    const mockResponse: PaymentResponse = {
      id: 'pay_123',
      status: 'canceled' as PaymentStatus,
      amount: 1000,
      currency: 'USD',
      createdAt: new Date().toISOString(),
    };

    cancelMock.mockResolvedValueOnce(mockResponse);

    const res = await payxone.cancelPayment(params);

    expect(cancelMock).toHaveBeenCalledWith(params);
    expect(res).toEqual(mockResponse);
  });

  it('cancelPayment propagates a rejection from PaymentService.cancel', async () => {
    const payxone = new PayXOne({});

    const params: PaymentCancelParams = { gateway: 'stripe', id: 'pay_789', reason: 'timeout' };

    const err = new Error('cancel failed');
    cancelMock.mockRejectedValueOnce(err);

    await expect(payxone.cancelPayment(params)).rejects.toThrow('cancel failed');
    expect(cancelMock).toHaveBeenCalledWith(params);
  });
});
