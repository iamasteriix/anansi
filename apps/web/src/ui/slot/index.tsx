import type { SxProps } from '../@core';
import type { SlotParams, SlotProps, } from './types';
import { useMemo } from 'react';
import { View } from '../view';


const default_sx: SxProps = {
  width: 'fill',
  height: 'fill',
};


export const createSlot = <T extends Record<string, any> = {}> ({
  displayName = 'Slot',
  defaultSx = default_sx,
  defaultStyle = {},
  useContext: useSlotContext = () => ({}),
  extraProps,
}: SlotParams<T>) => {

  const SlotComponent = ({
    children, id, sx, style, position,
    ...rest
  }: SlotProps & T) => {
    const contextProps = useSlotContext ? useSlotContext() : {};
    const mergedSx = useMemo<SxProps>(() => {
      const order = position === 'leading' ? -1 : position === 'trailing' ? 1 : undefined;
      return ({
        ...defaultSx,
        ...(order !== undefined && { order }),
        ...sx,
      });
    }, [sx, position]);
    const mergedStyle = useMemo(() => ({ ...defaultStyle, ...style, }), [style]);

    // drop `undefined`s from `rest` so they delete stuff
    const definedRest = Object.fromEntries(
      Object.entries(rest)
        .filter(([, value]) => value != undefined)
    );

    return (
      <View
        { ...extraProps }
        { ...contextProps }
        { ...definedRest }
        sx={ mergedSx }
        style={ mergedStyle }
        id={ id }
      >
        { children }
      </View>
    );
  }

  SlotComponent.displayName = displayName;

  return SlotComponent;
}
