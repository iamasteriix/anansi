import type { StorageAdapter, StorageTopics } from '../types';
import type { ThemeTokensType } from '../core';
import type { ReactNode } from 'react';


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
