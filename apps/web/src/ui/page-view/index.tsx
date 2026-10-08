import type { ReactElement, Ref } from 'react';
import type { ElementProps } from '../@core';
import type { ToolbarVariant } from '../toolbar';
import { createSlot, slotProp, SlotScopeProvider, useSlots, ViewElement, } from '../@core';
import { Toolbar } from '../toolbar';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
export type PageViewInset = 'top' | 'bottom' | 'start' | 'end';
export type PageViewProps = ElementProps & {
  insets?: PageViewInset[];
  ref?: Ref<HTMLDivElement>;
};

type PageViewSlotVariant = Omit<ToolbarVariant, 'orientation' | 'anchorEdge'>;
type PageViewSlotAlignment = PageViewInset;
type PageViewSlotProps = ElementProps & {
  variant?: PageViewSlotVariant;
  alignment?: PageViewSlotAlignment;
  ref?: Ref<HTMLDivElement>;
};


// Utils ————————————————————————————————————————————————————————————————————————————————
const resolveClasses = (
  insets: PageViewInset[] = ['top', 'bottom', 'start', 'end']
): string => [
  styles['page-view'],
  insets?.includes('top') && styles['page-view--safe-top'],
  insets?.includes('bottom') && styles['page-view--safe-bottom'],
  insets?.includes('start') && styles['page-view--safe-start'],
  insets?.includes('end') && styles['page-view--safe-end'],
].filter(Boolean).join(' ');


/**
 * Coerce toolbar `alignment`
 */
const alignToVariant = (
  alignment: PageViewSlotAlignment | undefined
): Pick<ToolbarVariant, 'orientation' | 'anchorEdge'> => {
  switch (alignment) {
    case 'bottom': return { anchorEdge: 'bottom', orientation: 'horizontal', };
    case 'start': return { anchorEdge: 'start', orientation: 'vertical', };
    case 'end': return { anchorEdge: 'end', orientation: 'vertical', };
    case 'top':
    default: return { anchorEdge: 'top', orientation: 'horizontal', };
  }
}


// Core —————————————————————————————————————————————————————————————————————————————————
export const PageView = ({
  children, id, theme, style, a11y, testID, ref, insets,
}: PageViewProps) => {

  const slots = useSlots(children, ['Toolbar']);

  const byEdge: Record<PageViewInset, ReactElement[]> = {
    top: [],
    bottom: [],
    start: [],
    end: [],
  };
  for (const element of slots.Toolbar) {
    const alignment = slotProp<PageViewSlotAlignment>(element, 'alignment') ?? 'top';
    byEdge[alignment].push(element);
  }

  return (
    <SlotScopeProvider value='PageView'>
      <ViewElement
        classes={ resolveClasses(insets) }
        theme={ theme }
        style={ style }
        a11y={ a11y }
        ref={ ref }
        testID={ testID }
        id={ id }
      >
        { byEdge.top.length > 0 &&
          <ViewElement classes={ styles['region-top'] }>{ byEdge.top }</ViewElement>
        }

        <ViewElement classes={ styles['region-middle'] }>
          { byEdge.start.length > 0 &&
            <ViewElement classes={ styles['region-start'] }>{ byEdge.start }</ViewElement>
          }
          <ViewElement classes={ styles['region-body'] }>{ slots.default }</ViewElement>
          { byEdge.end.length > 0 &&
            <ViewElement classes={ styles['region-end'] }>{ byEdge.end }</ViewElement>
          }
        </ViewElement>

        { byEdge.bottom.length > 0 &&
          <ViewElement classes={ styles['region-bottom'] }>{ byEdge.bottom }</ViewElement>
        }
      </ViewElement>
    </SlotScopeProvider>
  );
};


PageView.Toolbar = createSlot<typeof Toolbar, PageViewSlotProps, PageViewSlotProps>(
  Toolbar, {
    slotName: 'Toolbar',
    parentName: 'PageView',
    slotProps: ['alignment'],
    derive: (child, slot) => ({
      ...child,
      variant: {
        ...child.variant,
        ...alignToVariant(slot.alignment),
      },
    }),
  },
);
