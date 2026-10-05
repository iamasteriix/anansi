import type { CSSProperties, } from 'react';
import type { ThemeProviderProps, ThemesType } from './types';
import { storageAdapter, tokens, } from '../core';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ThemeContext } from './context';
import { toCSSVariables } from './utils';
import styles from './style.module.css';


const default_themes: ThemesType = { moonsong: tokens, };


/**
 * Provides the resolved theme to all children via context and CSS variables
 */
export const ThemeProvider = ({
  themes = default_themes,
  persister = storageAdapter,
  children,
}: ThemeProviderProps) => {

  const fallback: keyof ThemesType = Object.keys(themes)[0];
  const [themeName, setThemeName] = useState<keyof ThemesType>(fallback);
  
  // persist all provided themes
  useEffect(
    () => {
      const persist = persister('theme');
      Object.entries(themes)
        .forEach(([name, tokens]) => {
          persist.set(name, tokens);
        });
    },
    [themes, persister]
  );

  useLayoutEffect(
    () => {
      let canceled = false;
      Promise.resolve(
        persister('activeTheme').get<string>('name')
      ).then(activeThemeName => {
          if (!canceled && activeThemeName && activeThemeName in themes) setThemeName(activeThemeName);
        });
      return () => {
        canceled = true;
      };
    },
    [themes, persister]
  );

  const setTheme = useCallback(
    (name: keyof ThemesType) => {
      if (!(name in themes)) return;
      setThemeName(name);
      persister('activeTheme').set('name', name);
    },
    [themes, persister]
  );

  const resolvedTheme = themes[themeName];
  const cssVars: CSSProperties = useMemo(
    () => toCSSVariables(resolvedTheme),
    [resolvedTheme]
  );

  const themeProviderValues = useMemo(
    () => ({
      tokens: resolvedTheme,
      name: themeName,
      setTheme,
    }),
    [resolvedTheme, themeName, setTheme]
  );

  return (
    <ThemeContext.Provider value={ themeProviderValues }>
      <div
        className={ styles.theme }
        style={ cssVars }
      >
        { children }
      </div>
    </ThemeContext.Provider>
  );
}