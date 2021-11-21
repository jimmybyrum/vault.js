export type Config = {
  expires?: string,
  max_age?: string,
  domain?: string,
  path?: string,
  secure?: boolean
}

export interface Cache {
  [key: string]: any;
}

export interface Storage {
  [key: string]: any,
  type: string,
  version?: string,
  set(key: string, value: any, config?: object): any,
  setItem(key: string, value: any, config?: object): any,
  get(key: string, default_value?: any): any,
  getItem(key: string, default_value?: any): any,
  getAndRemove(key: string): any,
  list(raw?: boolean): void,
  getList(): any,
  remove(key: string): void,
  removeItem(key: string): void,
  clear(): void,
}

export type Memory = Storage;
export type File = Storage;

export type Vault = Omit<Storage, 'getAndRemove' | 'getItem' | 'getList' | 'removeItem' | 'setItem'> & {
  File: File,
  Memory: Memory,
}

export type Cookie = Omit<Storage, 'remove' | 'removeItem' | 'getAndRemove'> & {
  remove(key: string, config?: Config): void,
  removeItem(key: string, config?: Config): void,
  getAndRemove(key: string, config?: Config): any,
}