import type { FC } from 'react';


export type Override<T, U> = Omit<T, keyof U> & U;

type SvgPathData = {
  d: string;
  fillRule?: 'nonzero' | 'evenodd';
  clipRule?: 'nonzero' | 'evenodd';
};

export type IconDefinition = {
  viewBox?: string;
  size?: string;
  paths: SvgPathData[];
};

export type IconProps = {
  viewBox?: string;
  size?: string;
  fill?: string | string[];
  variant?: 'monochrome' | 'duotone';
  solid?: boolean;
};

export type IconBaseProps = {
  viewBox?: string;
  size?: string;
  fill?: string | string[];
  variant?: 'monochrome' | 'duotone';
};

export type IconComponent = FC<IconProps>;
