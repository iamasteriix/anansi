import type { PointerEvent, Ref, SyntheticEvent, } from 'react';
import type { ElementBaseProps, ElementChildren } from '../types';


export type PressableState = {
  pressed?: boolean;
};

type PressEvent = SyntheticEvent<HTMLDivElement>;

export type PressableProps = Omit<ElementBaseProps, 'children'> & {
  onPress?: (event: PressEvent) => void;
  onPressIn?: (event: PressEvent) => void;
  onPressOut?: (event: PressEvent) => void;
  onPressMove?: (event: PressEvent) => void;
  onLongPress?: (event: PressEvent) => void;
  onHoverIn?: (event: PointerEvent) => void;
  onHoverOut?: (event: PointerEvent) => void;
  delayLongPress?: number;
  disabled?: boolean;
  children?: ElementChildren | ((state: PressableState) => ElementChildren);
  ref?: Ref<HTMLDivElement>;
};
