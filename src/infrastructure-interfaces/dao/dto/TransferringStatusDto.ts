import {
  TransferringStatus,
  TransferringStatusError,
  TransferringStatusValue,
} from '../../../domain/user/vo/TransferringStatus';

export class TransferringStatusDto {
  constructor(public readonly status: string, public readonly error: string) {}

  toEntity(): TransferringStatus {
    const status = this.getTransferringStatusValue();
    const error = this.getTransferringStatusError();
    return new TransferringStatus(status, error);
  }

  static fromEntity(transferringStatus: TransferringStatus): TransferringStatusDto {
    return new TransferringStatusDto(transferringStatus.status, transferringStatus.error);
  }

  private getTransferringStatusValue(): TransferringStatusValue {
    switch (this.status) {
      case 'RUN_SUCCESSFULLY':
        return 'RUN_SUCCESSFULLY';
      case 'RUN_UNSUCCESSFULLY':
        return 'RUN_UNSUCCESSFULLY';
      case 'DONT_RUN':
        return 'DONT_RUN';
    }
    return 'DONT_RUN';
  }

  private getTransferringStatusError(): TransferringStatusError {
    switch (this.error) {
      case 'NO_ERROR':
        return 'NO_ERROR';
      case 'INCORRECT_FEEDLY_CREDENTIALS':
        return 'INCORRECT_FEEDLY_CREDENTIALS';
      case 'INCORRECT_TODOIST_CREDENTIALS':
        return 'INCORRECT_TODOIST_CREDENTIALS';
      case 'UNKNOWN_ERROR':
        return 'UNKNOWN_ERROR';
    }
    return 'NO_ERROR';
  }
}
