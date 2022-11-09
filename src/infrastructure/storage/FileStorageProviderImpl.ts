import { FileStorageProvider } from '../../infrastructure-interfaces/storage/FileStorageProvider';
import { FileStorage } from '../../infrastructure-interfaces/storage/FileStorage';
import { FileStorageImpl } from './FileStorageImpl';
import { Storage } from '../../utils/storage';

export class FileStorageProviderImpl implements FileStorageProvider {
  private storages = {} as {
    [key: string]: {
      [key: string]: FileStorage;
    };
  };

  private loadedPromise = new Promise<void>(async (resolve, reject) => {
    try {
      await this.load();
      resolve();
    } catch (e) {
      reject(e);
    }
  });

  constructor(private readonly fs: Storage) {
    this.loadedPromise
      .then(() => console.log('FileStorageProvider initialised'))
      .catch((e) => console.log('FileStorageProvider not initialised', e));
  }

  async getFileStorage(name: string, id: string): Promise<FileStorage> {
    await this.loadedPromise;
    if (!this.storages[name]) {
      this.storages[name] = {} as { [key: string]: FileStorage };
      await this.fs.mkdir(`./data/${name}`);
    }
    if (!this.storages[name][id]) {
      this.storages[name][id] = new FileStorageImpl(`./data/${name}/${id}`, this.fs);
      const fileHandle = await this.fs.open(`./data/${name}/${id}`, 'w');
      await fileHandle.close();
    }
    return this.storages[name][id];
  }

  async getFileStorageIds(name: string): Promise<string[]> {
    await this.loadedPromise;
    return Object.keys(this.storages[name]);
  }

  private async load() {
    for (let directory of await this.fs.readdir('./data')) {
      const stat = await this.fs.lstat(`./data/${directory}`);
      if (stat.isDirectory()) {
        this.storages[directory] = {} as { [key: string]: FileStorage };
        for (let file of await this.fs.readdir(`./data/${directory}/`)) {
          const stat = await this.fs.lstat(`./data/${directory}/${file}`);
          if (stat.isFile()) {
            this.storages[directory][file] = new FileStorageImpl(`./data/${directory}/${file}`, this.fs);
          }
        }
      }
    }
  }
}
