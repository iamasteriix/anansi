import type { CSSProperties, ReactElement, Ref } from 'react';
import type { A11yProps, SxProps, ThemeTokensType } from '../core';


type ElementChildren = ReactElement | ElementChildren[];

export type ElementBaseProps = {
  sx?: SxProps;
  a11y?: A11yProps;
  style?: CSSProperties;
  children?: ElementChildren;
  testID?: string;
};

export type LayoutProps = ElementBaseProps & {
  ref?: Ref<HTMLDivElement>;
};


// ======================================================================================
export type StorageTopics = {
  theme: Record<string, ThemeTokensType>,
  activeTheme: string;
};


export type StorageAdapter = {
  get: <T> (key: string) => T | null | Promise<T | null>;

  set <T> (
    key: string,
    value: T
  ): void | Promise<void>;

  remove (key: string): void | Promise<void>,
};
// ======================================================================================
