import type { FC, SVGProps } from 'react';
import type { IconBaseProps, IconDefinition, Override } from './types';
import { resolveIconColor } from './utils';



type WebIconProps = Override<SVGProps<SVGSVGElement>, IconBaseProps> & IconBaseProps;


export const createIcon = (definition: IconDefinition): FC<WebIconProps> => {
  return ({
    viewBox = '0 0 24 24',
    size = '1rem',
    fill = '#f0fefe',
    variant = 'monochrome',
    ...rest
  }: WebIconProps) => (
    <svg
      viewBox={ viewBox }
      fontSize={ size }
      width={ size }
      height={ size }
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      { ...rest }
    >
      {
        definition.paths.map((path, index) => (
          <path
            key={ index.toString() }
            d={ path.d }
            fillRule={ path.fillRule }
            clipRule={ path.clipRule }
            fill={ resolveIconColor(fill, variant, index) }
          />
        ))
      }
    </svg>
  );
}