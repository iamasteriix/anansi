import type { ThemeProviderValue } from './types';
import { useContext } from 'react';
import { ThemeContext } from './context';


export const useTheme = (): ThemeProviderValue => {
  const value = useContext(ThemeContext);
  if (!value) throw new Error ('invalid theme');
  return value;
}
