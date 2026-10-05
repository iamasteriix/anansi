import type { ToolbarProps, } from './types';
import { View } from '../view';
import { getContentOrdering } from './utils';
import { ToolbarAnchor, ToolbarSegment } from './slots';


export const Toolbar = ({
  children, id, sx, style, a11y, variant, testID, ref,
}: ToolbarProps) => {

  const {
    orientation = 'horizontal',
    justify = 'center',
    gap = 'gap-2',
    ...viewVariant
  } = variant ?? {};
  const flexDirection = orientation === 'vertical' ? 'column' : 'row';

  const { leading, trailing, content } = getContentOrdering(children);

  return (
    <View
      id={ id }
      variant={ viewVariant }
      sx={{ flexDirection, gap, ...sx }}
      style={ style }
      a11y={{ role: 'toolbar', ...a11y }}
      testID={ testID }
      ref={ ref }
    >
      {
        leading.length > 0 &&
        <View sx={{ flexDirection, gap }}>{ leading }</View>
      }
      <View sx={{ flex: 'auto', flexDirection, justifyContent: justify, gap }}>
        { content }
      </View>
      {
        trailing.length > 0 &&
        <View sx={{ flexDirection, gap }}>{ trailing }</View>
      }
    </View>
  );
};

Toolbar.Anchor = ToolbarAnchor;
Toolbar.Segment = ToolbarSegment;
