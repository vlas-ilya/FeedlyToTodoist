import { FileStorage } from '../../infrastructure-interfaces/storage/FileStorage';
import { Storage } from '../../utils/storage';

export class FileStorageImpl implements FileStorage {
  constructor(private readonly path: string, private readonly fs: Storage) {}

  async read(): Promise<any> {
    let buffer = await this.fs.readFile(this.path);
    return JSON.parse(buffer.toString());
  }

  async write(value: any) {
    await this.fs.writeFile(this.path, JSON.stringify(value));
  }
}
