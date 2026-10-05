import type { SlotProps } from '../slot/types';
import { View } from '../view';


export const PageLayoutHeader = ({
  children, sx,
  ...rest
}: SlotProps) => {
  return (
    <View
      sx={{ flexShrink: 0, ...sx, }}
      { ...rest }
    >
      { children }
    </View>
  );
}


export const PageLayoutFooter = ({
  children, sx,
  ...rest
}: SlotProps) => {
  return (
    <View
      sx={{ flexShrink: 0, ...sx, }}
      { ...rest }
    >
      { children }
    </View>
  );
}
