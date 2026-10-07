import type { SlotProps } from '../slot/types';
import { View } from '../view';


export const PageLayoutHeader = ({
  children, theme,
  ...rest
}: SlotProps) => {
  return (
    <View
      theme={{ flexShrink: 0, ...theme, }}
      { ...rest }
    >
      { children }
    </View>
  );
}


export const PageLayoutFooter = ({
  children, theme,
  ...rest
}: SlotProps) => {
  return (
    <View
      theme={{ flexShrink: 0, ...theme, }}
      { ...rest }
    >
      { children }
    </View>
  );
}
