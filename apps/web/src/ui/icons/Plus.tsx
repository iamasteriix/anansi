import type { IconComponent, IconProps } from './types';
import { createIcon } from './create';


const Icon = createIcon({
  paths: [{
    d: 'M3.25 12a.75.75 0 0 1 .75-.75h16a.75.75 0 0 1 0 1.5H4a.75.75 0 0 1-.75-.75',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  }, {
    d: 'M12 3.25a.75.75 0 0 1 .75.75v16a.75.75 0 0 1-1.5 0V4a.75.75 0 0 1 .75-.75',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  }],
});


export const Plus: IconComponent = ({
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