import type { StorageAdapter, StorageTopics, } from './types';


export const storageAdapter = (topic: keyof StorageTopics): StorageAdapter => ({
  get: <T> (key: string) => {
    if (!key || typeof key !== 'string') return null;
    const data = localStorage.getItem(`${topic}:${key}`);
    if (!data) return null;
    const foo: T = JSON.parse(data);
    return foo;
  },


  set: <T> (
    key: string,
    payload: T
  ) => {
    if (!key || typeof key !== 'string') throw new Error('invalid key');
    if (payload === null || payload === undefined) throw new Error('invalid payload value');
    const value = JSON.stringify(payload);
    localStorage.setItem(`${topic}:${key}`, value);
    return;
  },


  remove: (key: string) => {
    if (!key || typeof key !== 'string') throw new Error('invalid key');
    localStorage.removeItem(`${topic}:${key}`);
    return;
  },
});