import type { ReactNode } from 'react';
import type { StorageAdapter, StorageTopics, ThemeTokensType } from '../core';


export type ThemesType = Record<string, ThemeTokensType>;

export type ThemeProviderProps = {
  themes?: ThemesType;
  persister?: (topic: keyof StorageTopics) => StorageAdapter;
  children: ReactNode;
};

export type ThemeProviderValue = {
  tokens: ThemeTokensType;
  name: string;
  setTheme: (name: string) => void;
};
