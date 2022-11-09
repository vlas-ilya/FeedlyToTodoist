import { MakeDirectoryOptions, Mode, ObjectEncodingOptions, OpenMode, PathLike, StatOptions, Stats } from 'node:fs';
import { Abortable } from 'node:events';
import { FileHandle } from 'fs/promises';
import { Stream } from 'node:stream';

export interface Storage {
  readFile(
    path: PathLike | FileHandle,
    options?:
      | ({
          encoding?: null | undefined;
          flag?: OpenMode | undefined;
        } & Abortable)
      | null,
  ): Promise<Buffer>;

  writeFile(
    file: PathLike | FileHandle,
    data:
      | string
      | NodeJS.ArrayBufferView
      | Iterable<string | NodeJS.ArrayBufferView>
      | AsyncIterable<string | NodeJS.ArrayBufferView>
      | Stream,
    options?:
      | (ObjectEncodingOptions & {
          mode?: Mode | undefined;
          flag?: OpenMode | undefined;
        } & Abortable)
      | BufferEncoding
      | null,
  ): Promise<void>;

  mkdir(
    path: PathLike,
    options?:
      | Mode
      | (MakeDirectoryOptions & {
          recursive?: false | undefined;
        })
      | null,
  ): Promise<void>;

  open(path: PathLike, flags?: string | number, mode?: Mode): Promise<FileHandle>;

  readdir(
    path: PathLike,
    options?:
      | (ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
        })
      | BufferEncoding
      | null,
  ): Promise<string[]>;

  lstat(
    path: PathLike,
    opts?: StatOptions & {
      bigint?: false | undefined;
    },
  ): Promise<Stats>;

  readdir(
    path: PathLike,
    options?:
      | (ObjectEncodingOptions & {
          withFileTypes?: false | undefined;
        })
      | BufferEncoding
      | null,
  ): Promise<string[]>;
}
