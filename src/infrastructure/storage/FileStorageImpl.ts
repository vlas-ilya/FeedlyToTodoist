import { promises as fs } from 'fs';

import { FileStorage } from '../../infrastructure-interfaces/storage/FileStorage';

export class FileStorageImpl implements FileStorage {
  constructor(private readonly path: string) {}

  async read(): Promise<any> {
    let buffer = await fs.readFile(this.path);
    return JSON.parse(buffer.toString());
  }

  async write(value: any) {
    await fs.writeFile(this.path, JSON.stringify(value));
  }
}
