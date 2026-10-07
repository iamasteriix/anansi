import type { SxProps } from '../@core';
import type { ToolbarSegmentProps } from './types';
import type { SlotProps } from '../slot/types';
import { createSlot } from '../slot';


const default_anchor_sx: SxProps = {
  justifyContent: 'center',
  width: 'fill',
  height: 'fill',
};
const default_segment_sx: SxProps = {
  flexDirection: 'row',
  justifyContent: 'start',
  gap: 'gap-2',
};


const MakeAnchor = createSlot<SlotProps>({
  displayName: 'Toolbar.Anchor',
  defaultSx: default_anchor_sx,
});

const MakeSegment  = createSlot<ToolbarSegmentProps>({
  displayName: 'Toolbar.Segment',
  defaultSx: default_segment_sx,
});


export const ToolbarAnchor = ({
  children,
  position = 'leading',
  ...rest
}: SlotProps) => {
  return (
    <MakeAnchor
      position={ position }
      { ...rest }
    >
      { children }
    </MakeAnchor>
  );
}


export const ToolbarSegment = ({
  children, sx,
  justify = 'start',
  gap = 'gap-2',
  ...rest
}: ToolbarSegmentProps) => {
  return (
    <MakeSegment
      sx={{ justifyContent: justify, gap, ...sx }}
      { ...rest }
    >
      { children }
    </MakeSegment>
  );
}
