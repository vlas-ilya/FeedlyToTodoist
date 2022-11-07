import { UserInfo } from '../../domain/user/vo/UserInfo';
import { Links } from '../../domain/user/vo/Links';

export interface NotesTransferService {
  transfer(userId: string, userInfo: UserInfo, links: Links): Promise<Links>;
}
