import { promises as fs } from 'fs';

import { FileStorageProvider } from '../../infrastructure-interfaces/storage/FileStorageProvider';
import { FileStorage } from '../../infrastructure-interfaces/storage/FileStorage';
import { FileStorageImpl } from './FileStorageImpl';

export class FileStorageProviderImpl implements FileStorageProvider {
  private storages = {} as {
    [key: string]: {
      [key: string]: FileStorage;
    };
  };

  private loadedPromise = new Promise<void>(async (resolve, reject) => {
    await this.load();
    resolve();
  });

  constructor() {
    this.loadedPromise
      .then(() => console.log('FileStorageProvider initialised'))
      .catch((e) => console.log('FileStorageProvider not initialised', e));
  }

  async getFileStorage(name: string, id: string): Promise<FileStorage> {
    await this.loadedPromise;
    if (!this.storages[name]) {
      this.storages[name] = {} as { [key: string]: FileStorage };
      await fs.mkdir(`./data/${name}`);
    }
    if (!this.storages[name][id]) {
      this.storages[name][id] = new FileStorageImpl(`./data/${name}/${id}`);
      const fileHandle = await fs.open(`./data/${name}/${id}`, 'w');
      await fileHandle.close();
    }
    return this.storages[name][id];
  }

  async getFileStorageIds(name: string): Promise<string[]> {
    await this.loadedPromise;
    return Object.keys(this.storages[name]);
  }

  private async load() {
    const directories = await fs.readdir('./data');
    for (let directory of directories) {
      const stat = await fs.lstat(`./data/${directory}`);
      if (stat.isDirectory()) {
        this.storages[directory] = {} as { [key: string]: FileStorage };
        const files = await fs.readdir(`./data/${directory}/`);
        for (let file of files) {
          const stat = await fs.lstat(`./data/${directory}/${file}`);
          if (stat.isFile()) {
            this.storages[directory][file] = new FileStorageImpl(`./data/${directory}/${file}`);
          }
        }
      }
    }
  }
}
