import type { CSSProperties } from 'react';
import type { AbsoluteFillStyle, StorageAdapter, StorageTopics, StyleProp, } from './types';


// STORAGE ==============================================================================
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
// ======================================================================================


// STYLE SHEET ==========================================================================
const preprocessors = new Map<string, (value: unknown) => unknown>();


const absoluteFillObject: AbsoluteFillStyle = Object.freeze({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
});


export const StyleSheet = {
  create: <T extends Record<string, CSSProperties>>(styles: T): Readonly<T> => styles,


  flatten: <T extends object>(style: StyleProp<T>): T | undefined => {
    let result: Record<string, unknown> | undefined;
    const merge = (values: Record<string, unknown>) => {
      const keys = Object.keys(values);
      for (const key of keys) {
        const styleValue = values[key];
        if (styleValue === null) continue;
        const preprocess = preprocessors.get(key);
        (result ??= {})[key] = preprocess ? preprocess(styleValue) : styleValue;
      }
    }
    const walk = (values: StyleProp<T>) => {
      if (!values || typeof values !== 'object') return;
      if (Array.isArray(values)) values.forEach(value => walk(value));
      else merge(values as Record<string, unknown>);
    }
    walk(style);
    return result as T | undefined;
  },


  compose: <T extends object>(
    style1: StyleProp<T>,
    style2: StyleProp<T>
  ): StyleProp<T> => (
    style1 && style2 ? [style1, style2] : style1 || style2
  ),


  setStyleAttributePreprocessor: (
    property: string,
    process: (value: unknown) => unknown,
  ): void => {
    preprocessors.set(property, process);
  },


  absoluteFillObject,
  absoluteFill: absoluteFillObject,
  hairlineWidth: 1 /(typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1),
};
// ======================================================================================
