import type { Ref } from 'react';
import type { ElementChildren, ElementProps, TsSize } from '../@core';
import { createSlot, slotProp, SlotScopeProvider, useSlots, ViewElement, } from '../@core';
import styles from './style.module.css';


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
    cssClass: classes.filter(Boolean).join(' '),
    positionProp,
  });
};


const ToolbarSlotContent = ({ children, }: ToolbarSlotContentProps) => <>{ children }</>;


export const Toolbar = ({
  children, id, theme, style, a11y, variant, testID, ref,
}: ToolbarProps) => {
  
  const slots = useSlots(children, ['Slot']);
  const leadingSlot = slots.Slot.filter(element => slotProp(element, 'alignment') === 'start');
  const trailingSlot = slots.Slot.filter(element => slotProp(element, 'alignment') === 'end');
    const content = [
    ...slots.default,
    ...slots.Slot.filter(element => {
      const alignment = slotProp(element, 'alignment');
      return alignment !== 'start' && alignment !== 'end';
    }),
  ];

  const { cssClass, positionProp, } = resolveVariants(variant);

  return (
    <SlotScopeProvider value='Toolbar'>
      <ViewElement
        classes={ cssClass }
        theme={{ ...positionProp, ...theme, }}
        style={ style }
        a11y={ a11y }
        ref={ ref }
        testID={ testID }
        id={ id }
      >
        { leadingSlot.length > 0 &&
          <ViewElement classes={ styles['toolbar--leading'] }>{ leadingSlot }</ViewElement>
        }
        <ViewElement classes={ styles['toolbar--content'] }>{ content }</ViewElement>
        { trailingSlot.length > 0 &&
          <ViewElement classes={ styles['toolbar--trailing'] }>{ trailingSlot }</ViewElement>
        }
      </ViewElement>
    </SlotScopeProvider>
  );
};


Toolbar.Slot = createSlot<typeof ToolbarSlotContent, ToolbarSlotContentProps, ToolbarSlotProps>(
  ToolbarSlotContent, {
    slotName: 'Slot',
    parentName: 'Toolbar',
    slotProps: ['alignment'],
});
