import type { ReactNode } from 'react';
import type { ButtonVariant, GlassButtonVariant, } from './types';
import type { SlotProps } from '../slot/types';
import { Children, isValidElement } from 'react';
import baseStyles from './base.module.css';
import glassStyles from './glass.module.css';


/**
 * Resolves CSS module styling: base
 */
export const resolveBaseVariants = (variant: ButtonVariant | undefined): string => {
  const fill = variant?.fill ?? 'filled';
  const intent = variant?.intent ?? 'primary';
  const fit = variant?.fit ?? 'content';
  const size = variant?.size ?? 'md';
  const justify = variant?.justify ?? 'center';

  return [
    baseStyles.button,
    baseStyles[`button--fill-${fill}`],
    baseStyles[`button--intent-${intent}`],
    baseStyles[`button--fit-${fit}`],
    variant?.elevation && baseStyles[`button--elevation-${variant.elevation}`],
    baseStyles[`button--size-${size}`],
    variant?.radius && baseStyles[`button--radius-${variant.radius}`],
    baseStyles[`button--justify-${justify}`],
  ].filter(Boolean).join(' ');
};


/**
 * Resolves CSS module styling: glass
 */
export const resolveGlassVariants = (variant: GlassButtonVariant | undefined): string => {
  const fill = variant?.fill ?? 'tonal';
  const intent = variant?.intent ?? 'primary';
  const fit = variant?.fit ?? 'content';
  const size = variant?.size ?? 'md';
  const tone = variant?.tone ?? 'neutral';
  const intensity = variant?.intensity ?? 'base';
  const blur = variant?.blur ?? 'md';
  const justify = variant?.justify ?? 'center';

  return [
    glassStyles['glass-button'],
    glassStyles[`glass-button--fill-${fill}`],
    glassStyles[`glass-button--intent-${intent}`],
    glassStyles[`glass-button--fit-${fit}`],
    glassStyles[`glass-button--size-${size}`],
    glassStyles[`glass-button--tone-${tone}`],
    glassStyles[`glass-button--intensity-${intensity}`],
    glassStyles[`glass-button--blur-${blur}`],
    variant?.elevation && glassStyles[`glass-button--elevation-${variant.elevation}`],
    variant?.radius && glassStyles[`glass-button--radius-${variant.radius}`],
    glassStyles[`glass-button--justify-${justify}`],
  ].filter(Boolean).join(' ');
};


/**
 * Facilitates distinguishing button slot and content ordering safely across evaluated trees
 */
export const getContentOrdering = (children: ReactNode) => {
  const leading: ReactNode[] = [];
  const trailing: ReactNode[] = [];
  const content: ReactNode[] = [];
  Children.forEach(children, child => {
    if (!isValidElement(child)) return;
    const slotProps = child.props as SlotProps;
    if (slotProps?.position === 'leading') leading.push(child);
    else if (slotProps?.position === 'trailing') trailing.push(child);
    else content.push(child);
  });

  return { leading, trailing, content };
};
