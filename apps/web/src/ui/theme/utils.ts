import type { ThemeTokensType } from '../core';


/**
 * Flattens the resolved token set into CSS custom properties
 * and injects them onto a wrapping div.
 * e.g. colors.primary -> --colors-primary
 */
export const toCSSVariables = (tokens: ThemeTokensType): Record<string, string> => {
  return Object
    .entries(tokens)
    .reduce((acc, [category, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        acc[`--${category}-${key}`] = value as string
      });
      return acc;
    },
    {} as Record<string, string>
  );
}
