export interface RandomProvider {
  shuffle<T>(list: T[]): void;
}
