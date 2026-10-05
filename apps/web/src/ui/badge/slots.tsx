import type { CSSProperties } from 'react';
import type { BadgeIconSlot } from './types';
import { createSlot } from '../slot';
import { Icon } from '../icon';


const default_slot_style: CSSProperties = {
  width: 'content',
  height: 'content',
};


const MakeBadgeIconSlot = createSlot({
  displayName: 'Badge.Icon',
  defaultStyle: default_slot_style,
});


export const BadgeIcon = ({
  icon, variant, ref,
  position = 'leading',
  ...rest
}: BadgeIconSlot) => {
  return (
    <MakeBadgeIconSlot position={ position }>
      <Icon
        icon={ icon }
        variant={ variant }
        ref={ ref }
        { ...rest }
      />
    </MakeBadgeIconSlot>
  );
}
