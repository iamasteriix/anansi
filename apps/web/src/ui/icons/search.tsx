import type { IconComponent, IconProps, } from './types';
import { createIcon } from './create';



const Solid = createIcon({
  paths: [{
    d: 'M21.788 21.788a.723.723 0 0 0 0-1.022L18.122 17.1a9.157 9.157 0 1 0-1.022 1.022l3.666 3.666a.723.723 0 0 0 1.022 0',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  }],
});



const SolidDuo = createIcon({
  paths: [{
    d: 'M20.313 11.157a9.157 9.157 0 1 1-18.313 0 9.157 9.157 0 0 1 18.313 0',
  }, {
    d: 'm17.1 18.122 3.666 3.667a.723.723 0 0 0 1.023-1.023L18.122 17.1a9 9 0 0 1-1.022 1.022',
  }],
});



const Outline = createIcon({
  paths: [{
    d: 'M11.5 2.75a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5M1.25 11.5c0-5.66 4.59-10.25 10.25-10.25S21.75 5.84 21.75 11.5 17.16 21.75 11.5 21.75 1.25 17.16 1.25 11.5',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  }, {
    d: 'M17.97 17.97a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  }],
});



const OutlineDuo = createIcon({
  paths: [{
    d: 'M11.5 2.75a8.75 8.75 0 1 0 0 17.5 8.75 8.75 0 0 0 0-17.5M1.25 11.5c0-5.66 4.59-10.25 10.25-10.25S21.75 5.84 21.75 11.5 17.16 21.75 11.5 21.75 1.25 17.16 1.25 11.5',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  }, {
    d: 'M17.97 17.97a.75.75 0 0 1 1.06 0l3.5 3.5a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  }],
});



export const Search: IconComponent = ({
  viewBox = '0 0 24 24',
  size = '1rem',
  fill = '#f0fefe',
  variant = 'monochrome',
  solid = false,
}: IconProps) => {
  
  const isDuotone = variant === 'duotone';
  const SelectedIcon = isDuotone && solid ? SolidDuo
    : isDuotone ? OutlineDuo
    : solid ? Solid
    : Outline;

  return (
    <SelectedIcon
      viewBox={ viewBox }
      size={ size }
      fill={ fill }
      variant={ variant }
    />
  );
}
