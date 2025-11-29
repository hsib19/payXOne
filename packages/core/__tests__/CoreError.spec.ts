import { CoreError } from '../src/errors';

describe('CoreError', () => {
  it('should set default code when not provided', () => {
    const err = new CoreError('Something went wrong');
    expect(err.message).toBe('Something went wrong');
    expect(err.code).toBe('CORE_ERROR');
    expect(err.name).toBe('CoreError');
  });

  it('should set custom code when provided', () => {
    const err = new CoreError('Custom error', 'CUSTOM_CODE');
    expect(err.message).toBe('Custom error');
    expect(err.code).toBe('CUSTOM_CODE');
  });

  it('should return same instance when passed a CoreError to from()', () => {
    const original = new CoreError('Original', 'ORIG');
    const result = CoreError.from(original);
    expect(result).toBe(original);
  });

  it('should wrap a plain Error into CoreError', () => {
    const plain = new Error('Plain error');
    const result = CoreError.from(plain);
    expect(result).toBeInstanceOf(CoreError);
    expect(result.message).toBe('Plain error');
    expect(result.code).toBe('UNKNOWN');
  });

  it('should handle unknown input gracefully', () => {
    const result = CoreError.from(null);
    expect(result).toBeInstanceOf(CoreError);
    expect(result.message).toBe('Unknown error');
    expect(result.code).toBe('UNKNOWN');
  });
});
