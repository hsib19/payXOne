export class CoreError extends Error {
  readonly code: string;

  constructor(message: string, code: string = 'CORE_ERROR') {
    super(message);
    this.code = code;
    this.name = 'CoreError';
  }

  static from(err: unknown): CoreError {
    if (err instanceof CoreError) return err;
    const anyErr = err as { message?: string; code?: string };
    return new CoreError(anyErr?.message ?? 'Unknown error', anyErr?.code ?? 'UNKNOWN');
  }
}
