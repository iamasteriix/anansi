import type { ButtonProps } from '../button/types';
import type { TSProperties } from '../@core';
import { createSlot } from '../slot';
import { Button } from '../button';
import { useContextMenuContext } from './context';


const default_section_sx: TSProperties = {
  marginBottom: 'relative-1',
  paddingBottom: 'relative-1',
  borderBottomWidth: 'light',
  borderColor: 'secondary',
};


const MakeItem = createSlot<ButtonProps>({
  displayName: 'ContextMenu.Item',
  useContext: () => {
    const { closeMenu } = useContextMenuContext();
    return { closeMenu, };
  }
});

export const MakeSection = createSlot({
  displayName: 'ContextMenu.Section',
  defaultSx: default_section_sx,
});


// maybe remove wrapping `MakeItem` if slot does not work
export const ContextMenuItem = (props: ButtonProps) => {
  return (
    <MakeItem>
      <Button { ...props }/>
    </MakeItem>
  );
}
