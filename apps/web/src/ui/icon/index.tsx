import type { ComponentType, Ref } from 'react';
import type { ElementProps } from '../@core';
import { tokens, ViewElement } from '../@core';
import styles from './style.module.css';


// Types ————————————————————————————————————————————————————————————————————————————————
type IconComponentProps = {
  viewBox?: string;
  size?: string;
  variant?: 'monochrome' | 'duotone';
  fill?: string | string[];
  solid?: boolean;
};

export type IconVariant = {
  name?: 'monochrome' | 'duotone';
  size?: 'xsm' | 'sm' | 'md' | 'lg';
  solid?: boolean;
};

export type IconProps = Omit<ElementProps, 'children'> & {
  icon: ComponentType<IconComponentProps>,
  variant?: IconVariant;
  children?: never;
  ref?: Ref<HTMLDivElement>;
};


// Core —————————————————————————————————————————————————————————————————————————————————
const size_map: Record<NonNullable<IconVariant['size']>, string> = {
  xsm: tokens.typography.textXs,
  sm: tokens.typography.textSm,
  md: tokens.typography.textMd,
  lg: tokens.typography.textLg,
};

const default_variant: IconVariant = {
  name: 'monochrome',
  size: 'md',
  solid: false,
};
const default_a11y = { hidden: true, };


/**
 * @todo Maybe use `useTheme` for icon sizes instead
 */
export const Icon = ({
  id, theme, style, testID, ref,
  variant = default_variant,
  a11y = default_a11y,
  icon: IconComponent,
}: IconProps) => {
  
  const fontSize = size_map[variant.size || 'md'];
  const fill = variant.name === 'duotone' ? ['currentColor', 'var(--colors-accent)'] : 'currentColor';

  return (
    <ViewElement
      classes={ styles.icon }
      theme={ theme }
      style={ style }
      a11y={ a11y }
      ref={ ref }
      testID={ testID }
      id={ id }
    >
      <IconComponent
        viewBox='0 0 24 24'
        size={ fontSize }
        fill={ fill }
        variant={ variant.name }
        solid={ variant.solid }
      />
    </ViewElement>
  );
}
