import { AdapterRegistry } from '../src/modules/payment/registry';
import { GatewayAdapter } from '../src/modules/payment/types';

describe('AdapterRegistry', () => {
  const mockAdapter: GatewayAdapter = {
    payment: {
      create: jest.fn(),
      retrieve: jest.fn(),
      cancel: jest.fn(),
    },
  };

  it('should return adapter when gateway is configured', () => {
    const registry = new AdapterRegistry({ stripe: mockAdapter });
    const adapter = registry.get('stripe');

    expect(adapter).toBe(mockAdapter);
  });

  it('should throw error when gateway is not configured', () => {
    const registry = new AdapterRegistry({ stripe: mockAdapter });

    expect(() => registry.get('xendit')).toThrow('Gateway xendit not configured');
  });
});
