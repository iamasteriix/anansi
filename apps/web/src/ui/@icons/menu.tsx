import type { IconComponent, IconProps } from './types';
import { createIcon } from './create-icon';


const Icon = createIcon({
  paths: [{ d: 'M5 8.25a.75.75 0 0 0 0 1.5h14a.75.75 0 0 0 0-1.5zM5 14.25a.75.75 0 0 0 0 1.5h14a.75.75 0 0 0 0-1.5z', }],
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
