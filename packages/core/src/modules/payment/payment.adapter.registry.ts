import { GatewayAdapter } from './payment.types';

export type AdapterKey = string;
export type AdapterMap = Record<AdapterKey, GatewayAdapter>;

export class AdapterRegistry {
  constructor(private readonly adapters: AdapterMap) {}

  get(gateway: AdapterKey): GatewayAdapter {
    const adapter = this.adapters[gateway];
    if (!adapter) {
      throw new Error(`Gateway ${gateway} not configured`);
    }
    return adapter;
  }
}
