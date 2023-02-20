import { Maybe } from '../types/Maybe';

export const ifNotEmpty = (value: Maybe<string>, defaultValue: string): string => {
  if (!value || !value.trim()) {
    return defaultValue;
  }
  return value;
};
