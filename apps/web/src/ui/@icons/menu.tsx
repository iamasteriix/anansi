import type { IconComponent, IconProps } from './types';
import { createIcon } from './create-icon';


const Icon = createIcon({
  paths: [{ d: 'M4 7a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1M4 17a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1', }],
});


export const Menu: IconComponent = ({
  viewBox = '0 0 24 24',
  size = '1rem',
  fill = '#f0fefe',
  variant = 'monochrome',
}: IconProps) => (
  <Icon
    viewBox={ viewBox }
    size={ size }
    fill={ fill }
    variant={ variant }
  />
);
