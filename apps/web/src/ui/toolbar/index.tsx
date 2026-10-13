import type { Ref } from 'react';
import type { ElementChildren, ElementProps, TsSize } from '../@core';
import { createSlot, slotProp, SlotScopeProvider, useSlots, ViewElement, } from '../@core';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
export type ToolbarVariant = {
  orientation?: 'horizontal' | 'vertical';
  size?: 'xsm' | 'sm' | 'md' | 'lg' | 'xl';
  anchorEdge?: 'top' | 'bottom' | 'start' | 'end';
  anchorOffset?: TsSize;
};

export type ToolbarSlotProps = {
  alignment?: 'start' | 'end';
};

type ToolbarSlotContentProps = {
  children?: ElementChildren;
};

export type ToolbarProps = ElementProps & {
  variant?: ToolbarVariant;
  ref?: Ref<HTMLDivElement>;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
const resolveVariants = (variant?: ToolbarVariant) => {
  const classes: (string | undefined)[] = [
    styles.toolbar,
    styles[`toolbar--orientation-${variant?.orientation ?? 'horizontal'}`],
    styles[`toolbar--size-${variant?.size ?? 'md'}`],
    variant?.anchorEdge && styles['toolbar--anchor']
  ];
  const edge = variant?.anchorEdge === 'start' ? 'insetInlineStart' : variant?.anchorEdge === 'end' ? 'insetInlineEnd' : variant?.anchorEdge;
  const offset = variant?.anchorOffset;
  const positionProp = edge ? { [edge]: offset || 0, } : undefined;
  return ({
    cssClasses: classes.filter(Boolean).join(' '),
    positionProp,
  });
};


const ToolbarSlotContent = ({ children, }: ToolbarSlotContentProps) => <>{ children }</>;


// Core —————————————————————————————————————————————————————————————————————————————————
export const Toolbar = ({
  children, id, theme, style, a11y, variant, testID, ref,
}: ToolbarProps) => {
  
  const slots = useSlots(children, ['Slot']);
  const startSlot = slots.Slot.filter(element => slotProp(element, 'alignment') === 'start');
  const endSlot = slots.Slot.filter(element => slotProp(element, 'alignment') === 'end');
  const content = [
    ...slots.default,
    ...slots.Slot.filter(element => {
      const alignment = slotProp(element, 'alignment');
      return alignment !== 'start' && alignment !== 'end';
    }),
  ];

  const { cssClasses, positionProp, } = resolveVariants(variant);

  return (
    <SlotScopeProvider value='Toolbar'>
      <ViewElement
        classes={ cssClasses }
        theme={{ ...positionProp, ...theme, }}
        style={ style }
        a11y={ a11y }
        ref={ ref }
        testID={ testID }
        id={ id }
      >
        { startSlot.length > 0 &&
          <ViewElement classes={ styles['toolbar__slot--start'] }>{ startSlot }</ViewElement>
        }
        <ViewElement classes={ styles['toolbar__content'] }>{ content }</ViewElement>
        { endSlot.length > 0 &&
          <ViewElement classes={ styles['toolbar__slot--end'] }>{ endSlot }</ViewElement>
        }
      </ViewElement>
    </SlotScopeProvider>
  );
};


// Slots ————————————————————————————————————————————————————————————————————————————————
Toolbar.Slot = createSlot<
  typeof ToolbarSlotContent,
  ToolbarSlotContentProps,
  ToolbarSlotProps
>(
  ToolbarSlotContent, {
    slotName: 'Slot',
    parentName: 'Toolbar',
    slotProps: ['alignment'],
});
