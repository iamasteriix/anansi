import type { IconProps, IconVariant } from './types';
import { resolveA11y, useMediaQuery } from '../@core';
import styles from './style.module.css';


const size_map: Record<NonNullable<IconVariant['size']>, string> = {
  xsm: 'var(--typography-textXs)',
  sm: 'var(--typography-textSm)',
  md: 'var(--typography-textLg)',
  lg: 'var(--typography-textXl)',
};

const default_variant: IconVariant = {
  name: 'monochrome',
  size: 'md',
  solid: false,
};
const default_a11y = { hidden: true, };


export const Icon = ({
  id, theme, style, testID,
  variant = default_variant,
  a11y = default_a11y,
  icon: IconComponent,
}: IconProps) => {
  
  const fontSize = size_map[variant.size || 'md'];
  const fill = variant.name === 'duotone' ? ['currentColor', 'var(--colors-accent)'] : 'currentColor';
  
  const { cssProperties, } = useMediaQuery(theme, style);
  const accessibility = resolveA11y(a11y);

  return (
    <span
      className={ styles.icon }
      style={ cssProperties }
      id={ id }
      data-testid={ testID }
      data-variant={ variant.name }
      { ...accessibility }
    >
      <IconComponent
        viewBox='0 0 24 24'
        size={ fontSize }
        fill={ fill }
        variant={ variant.name }
        solid={ variant.solid }
      />
    </span>
  );
}
