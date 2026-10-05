import type { ButtonBadgeSlot, ButtonIconSlot, ButtonSlotProps } from './types';
import { createSlot } from '../slot';
import { Icon } from '../icon';
import { Badge } from '../badge';


const MakeButtonIconSlot = createSlot({ displayName: 'Button.Icon', });
const MakeButtonBadgeSlot = createSlot({ displayName: 'Button.Badge', });
const MakeButtonSlot = createSlot({ displayName: 'Button.Slot', });


export const ButtonIcon = ({
  icon, variant, ref,
  position = 'leading',
  ...rest
}: ButtonIconSlot) => {
  return (
    <MakeButtonIconSlot position={ position }>
      <Icon
        icon={ icon }
        variant={ variant }
        ref={ ref }
        { ...rest }
      />
    </MakeButtonIconSlot>
  );
}


export const ButtonBadge = ({
  variant, ref,
  position = 'leading',
  ...rest
}: ButtonBadgeSlot) => {
  return (
    <MakeButtonBadgeSlot position={ position }>
      <Badge
        variant={ variant }
        ref={ ref }
        { ...rest }
      />
    </MakeButtonBadgeSlot>
  );
}


export const ButtonSlot = ({
  children, gap, sx,
  position = 'leading',
  ...rest
}: ButtonSlotProps) => {
  return (
    <MakeButtonSlot
      position={ position }
      sx={{ ...sx, gap, }}
      { ...rest }
    >
      { children }
    </MakeButtonSlot>
  );
}
