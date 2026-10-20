import type { Ref } from 'react';
import type { ElementChildren, ElementProps, TsSize } from '../@core';
import {
  createSlot, slotProp, SlotScopeProvider, useSlots, ViewElement,
} from '../@core';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
export type ToolbarVariant = {
  orientation?: 'horizontal' | 'vertical';
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
  
  const slots = useSlots(children, ['slot']);
  const startSlot: ElementChildren = [];
  const endSlot: ElementChildren = [];
  for (const element of slots.slot) {
    const alignment = slotProp<ToolbarSlotProps['alignment']>(element, 'alignment') ?? 'start';
    (alignment === 'end' ? endSlot : startSlot).push(element); 
  }

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
        <ViewElement classes={ styles['toolbar__content'] }>{ slots.default }</ViewElement>
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
    slotName: 'slot',
    parentName: 'Toolbar',
    slotProps: ['alignment'],
});
