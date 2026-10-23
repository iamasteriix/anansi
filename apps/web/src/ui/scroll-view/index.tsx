import type { ScrollViewElementProps } from '../@core';
import type { ViewVariant } from '../view';
import { ScrollViewElement } from '../@core';
import { resolveViewVariants } from '../view';


// Types ————————————————————————————————————————————————————————————————————————————————
export type ScrollViewProps = Omit<ScrollViewElementProps, 'showsScrollIndicator'> & {
  variant?: ViewVariant;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
};


// Core —————————————————————————————————————————————————————————————————————————————————
export const ScrollView = ({
  children, id, variant, theme, style, a11y, testID, ref,
  showsHorizontalScrollIndicator, showsVerticalScrollIndicator,
  onContentSizeChange, onLayout, onScroll,
  horizontal = false,
  scrollEnabled = true,
}: ScrollViewProps) => {

  const showsScrollIndicator = horizontal ? showsHorizontalScrollIndicator : showsVerticalScrollIndicator;

  return (
    <ScrollViewElement
      onContentSizeChange={ onContentSizeChange }
      onLayout={ onLayout }
      onScroll={ onScroll }
      scrollEnabled={ scrollEnabled }
      showsScrollIndicator={ showsScrollIndicator }
      classes={ resolveViewVariants(variant) }
      theme={ theme }
      style={ style }
      id={ id }
      testID={ testID }
      a11y={ a11y }
      ref={ ref }
    >
      { children }
    </ScrollViewElement>
  );
}
