import type { IconComponent, IconProps } from './types';
import { createIcon } from './create';


const Icon = createIcon({
  paths: [{
    d: 'M4.02 14a2 2 0 0 1-.01-4h.01a2 2 0 0 1 0 4',
  }, {
    d: 'M12.02 14a2 2 0 0 1-.01-4h.01a2 2 0 0 1 0 4',
  }, {
    d: 'M20.02 14a2 2 0 0 1-.01-4h.01a2 2 0 0 1 0 4',
  }],
});


export const Ellipsis: IconComponent = ({
  viewBox = '0 0 24 24',
  size = '1rem',
  fill = '#f0fefe',
  variant = 'monochrome',
}: IconProps) => {
  return (
    <Icon
      viewBox={ viewBox }
      size={ size }
      fill={ fill }
      variant={ variant }
    />
  )
};
