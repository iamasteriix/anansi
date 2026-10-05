import type { ReactElement } from 'react';
import type {
  GlassTextFieldVariant, TextFieldGroupProps, TextFieldProps, TextFieldVariant,
} from './types';
import type { SlotProps } from '../slot/types';
import { Children, isValidElement, } from 'react';
import baseStyles from './base.module.css';
import glassStyles from './glass.module.css';
import { TextFieldIcon, TextFieldLabel, TextFieldLeading, TextFieldTrailing } from './slot';


/**
 * Resolves CSS classes for base variants
 */
export const resolveBaseVariants = (variant: TextFieldVariant | undefined): string => {
  const fill = variant?.fill ?? 'outlined';
  const size = variant?.size ?? 'md';
  const shadow = variant?.shadow === 'none' ? 'none' : (variant?.elevation ?? 'base');
  return [
    baseStyles['text-field'],
    baseStyles[`text-field--fill-${fill}`],
    variant?.outline && baseStyles[`text-field--outline-${variant.outline}`],
    variant?.elevation && baseStyles[`text-field--elevation-${variant.elevation}`],
    baseStyles[`text-field--shadow-${shadow}`],
    baseStyles[`text-field--size-${size}`],
    variant?.radius && baseStyles[`text-field--radius-${variant.radius}`],
  ].filter(Boolean).join(' ');
};


/**
 * Resolves CSS classes for glass variants
 */
export const resolveGlassVariants = (variant: GlassTextFieldVariant | undefined): string => {
  const tone = variant?.tone ?? 'neutral';
  const intensity = variant?.intensity ?? 'base';
  const blur = variant?.blur ?? 'md';
  const size = variant?.size ?? 'md';
  return [
    glassStyles[`glass-text-field`],
    glassStyles[`glass-text-field--tone-${tone}`],
    glassStyles[`glass-text-field--intensity-${intensity}`],
    glassStyles[`glass-text-field--blur-${blur}`],
    glassStyles[`glass-text-field--size-${size}`],
    variant?.radius && glassStyles[`glass-text-field--radius-${variant.radius}`],
    variant?.elevation && glassStyles[`glass-text-field--elevation-${variant.elevation}`],
  ].filter(Boolean).join(' ');
};


/**
 * Isolates text field slots per category using component reference identity
 */
export const getGroupPartitions = (children: TextFieldGroupProps['children']) => {
  const labels: ReactElement[] = [];
  const field: ReactElement[] = [];
  Children.forEach(children, child => {
    if (!isValidElement(child)) return;
    child.type === TextFieldLabel ? labels.push(child) : field.push(child);
  });
  
  return { labels, field };
};


/**
 * Resolves leading and trailing slots around the text input area
 */
export const getAnchorOrdering = (children: TextFieldProps['children']) => {
  const leading: ReactElement[] = [];
  const trailing: ReactElement[] = [];
  Children.forEach(children, child => {
    if (!isValidElement(child)) return;
    const slotProps = child.props as SlotProps;
    const resolved =
      child.type === TextFieldLeading ? 'leading' :
      child.type === TextFieldTrailing ? 'trailing' :
      slotProps.position ?? (child.type === TextFieldIcon ? 'leading' : undefined)
    if (resolved === 'leading') leading.push(child);
    else if (resolved === 'trailing') trailing.push(child);
  });

  return { leading, trailing };
};
