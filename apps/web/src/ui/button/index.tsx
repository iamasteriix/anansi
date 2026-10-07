import type { ReactNode } from 'react';
import type { ButtonProps, GlassButtonProps } from './types';
import { Pressable } from '../pressable';
import { getContentOrdering, resolveBaseVariants, resolveGlassVariants, } from './utils';
import { ButtonBadge, ButtonIcon, ButtonSlot } from './slots';
import styles from './base.module.css';


/**
 * Handles static children and the case where they are a function with render props,
 * whatever that means.
 */
const renderChildren = (children: ButtonProps['children']) => {
  const resolve = (resolvedNode: ReactNode) => {
    const { leading, trailing, content, } = getContentOrdering(resolvedNode);
    return (
      <>
        {
          leading.length > 0 &&
          <span className={ styles.button__slot }>{ leading }</span>
        }
        <span className={ styles.button__content }>{ content }</span>
        {
          trailing.length > 0 &&
          <span className={ styles.button__slot }>{ trailing }</span>
        }
      </>
    );
  }

  return typeof children === 'function'
    ? (state: Parameters<Extract<ButtonProps['children'], Function>>[0]) => resolve(children(state))
    : resolve(children);
}


/**
 * Unified foundation for both regular and glass buttons
 */
const ButtonBase = ({
  children, id, theme, a11y, style, testID, ref,
  disabled,
  className,
}: ButtonProps & {
  className: string;
}) => {
  return (
    <span className={ className }>
      <Pressable
        id={ id }
        disabled={ disabled }
        theme={ theme }
        style={ style }
        a11y={ a11y }
        testID={ testID }
        ref={ ref }
      >
        { renderChildren(children) }
      </Pressable>
    </span>
  );
}


/**
 * I'm only writing a bunch of comments above the functions to make it easy to mentally
 * demarcate whatever is going on in this file.
 */
export const Button = ({ variant, ...rest }: ButtonProps) => (
  <ButtonBase
    { ...rest }
    className={ resolveBaseVariants(variant) }
  />
);


/**
 * And now I feel like I'm going to do this for all the other files that separate the
 * regular from the glass variants.
 */
export const GlassButton = ({ variant, ...rest }: GlassButtonProps) => (
  <ButtonBase
    { ...rest }
    className={ resolveGlassVariants(variant) }
  />
);


Button.Icon = ButtonIcon;
Button.Badge = ButtonBadge;
Button.Slot = ButtonSlot;
GlassButton.Icon = ButtonIcon;
GlassButton.Badge = ButtonBadge;
GlassButton.Slot = ButtonSlot;
