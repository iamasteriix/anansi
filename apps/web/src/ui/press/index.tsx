import type { PressElementProps } from '../@core';
import { PressElement } from '../@core';


// Core —————————————————————————————————————————————————————————————————————————————————
export const Press = ({
  children, id, theme, style, a11y, testID, ref,
  onLayout,
  delayLongPress, disabled,
  onHoverIn, onHoverOut, onLongPress, onPress, onPressIn, onPressMove, onPressOut,
}: PressElementProps) => {
  return (
    <PressElement
      theme={ theme }
      style={ style }
      a11y={ a11y }
      id={ id }
      testID={ testID }
      ref={ ref }
      onLayout={ onLayout }
      onPress={ onPress }
      onPressIn={ onPressIn }
      onPressMove={ onPressMove }
      onPressOut={ onPressOut }
      onLongPress={ onLongPress }
      onHoverIn={ onHoverIn }
      onHoverOut={ onHoverOut }
      delayLongPress={ delayLongPress }
      disabled={ disabled }
    >
      { children }
    </PressElement>
  );
}
