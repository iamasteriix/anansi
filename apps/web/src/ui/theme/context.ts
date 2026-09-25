import type { ThemeProviderValue } from './types';
import { createContext } from 'react';


export const ThemeContext = createContext<ThemeProviderValue | null>(null);
