import { BaseValueObject } from '../../../utils/domain/BaseValueObject';

export type TransferringStatusValue = 'RUN_SUCCESSFULLY' | 'RUN_UNSUCCESSFULLY' | 'DONT_RUN';
export type TransferringStatusError =
  | 'NO_ERROR'
  | 'INCORRECT_FEEDLY_CREDENTIALS'
  | 'INCORRECT_TODOIST_CREDENTIALS'
  | 'UNKNOWN_ERROR';

export class TransferringStatus extends BaseValueObject {
  constructor(
    public readonly status: TransferringStatusValue,
    public readonly error: TransferringStatusError,
  ) {
    super();
  }

  static empty(): TransferringStatus {
    return new TransferringStatus('DONT_RUN', 'NO_ERROR');
  }
}
