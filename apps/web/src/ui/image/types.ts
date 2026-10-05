import type { Ref, SyntheticEvent, } from 'react';
import type { LayoutEvent } from '../core';
import type { LayoutProps } from '../types';


export type ImageEvent = SyntheticEvent<HTMLImageElement, Event>;

export type ImageVariant = {
  resize?: 'cover' | 'contain' | 'stretch' | 'center';
  blur?: 'low' | 'medium' | 'high';
};

type ReferrerPolicy =
  | 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin'
  | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';

export type ImageProps = Omit<LayoutProps, 'children'> & {
  variant?: ImageVariant;
  children?: never;
  src: string;
  alt: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  referrerPolicy?: ReferrerPolicy;
  onError?: (event: ImageEvent) => void;
  onLoad?: (event: ImageEvent) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onLayout?: (event: LayoutEvent) => void;
  ref?: Ref<HTMLImageElement>;
};
