import type { CSSProperties, ReactElement, } from 'react';
import type { A11yProps, TSProperties, } from '../@core';


export type ElementChildren = ReactElement | boolean | ElementChildren[];

export type ElementBaseProps = {
  children?: ElementChildren;
  id?: string;
  style?: CSSProperties;
  theme?: TSProperties;
  a11y?: A11yProps;
  testID?: string;
};

export type LayoutProps = ElementBaseProps;
