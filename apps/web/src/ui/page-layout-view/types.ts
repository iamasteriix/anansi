import type { Ref } from 'react';
import type { LayoutProps } from '../types';


export type PageLayoutViewProps = LayoutProps & {
  ref?: Ref<HTMLDivElement>;
};
