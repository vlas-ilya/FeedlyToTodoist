import { BaseError } from './domain/BaseError';

export function getOrThrowIfEmpty<T>(obj: T, err: BaseError): T {
  if (!obj) {
    throw err;
  }
  return obj;
}
