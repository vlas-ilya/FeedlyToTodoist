import { Error } from './Error';

export function getOrThrowIfEmpty<T>(obj: T, err: Error): T {
  if (!obj) {
    throw err;
  }
  return obj;
}
