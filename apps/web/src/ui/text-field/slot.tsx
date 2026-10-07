import type { SlotProps, } from '../slot/types';
import type { GlassTextFieldGroupProps, TextFieldGroupProps, TextFieldIconSlot, TextFieldLabelProps } from './types';
import { createSlot } from '../slot';
import { resolveA11y, useMediaQuery } from '../@core';
import { View } from '../view';
import { Icon } from '../icon';


const MakeLeading = createSlot<SlotProps>({ displayName: 'TextField.Leading' });
const MakeTrailing = createSlot<SlotProps>({ displayName: 'TextField.Trailing' });
const MakeLabel = createSlot<TextFieldLabelProps>({ displayName: 'TextField.Label' });
const MakeIcon = createSlot({ displayName: 'TextField.Icon', });


export const TextFieldIcon = ({
  icon, variant, ref,
  position = 'leading',
  ...rest
}: TextFieldIconSlot) => {
  return (
    <MakeIcon position={ position }>
      <Icon
        icon={ icon }
        variant={ variant }
        ref={ ref }
        { ...rest }
      />
    </MakeIcon>
  );
}


export const TextFieldLeading = ({
  children,
  ...rest
}: SlotProps) => {
  return (
    <MakeLeading {...rest}>
      {children}
    </MakeLeading>
  );
};


export const TextFieldTrailing = ({
  children,
  ...rest
}: SlotProps) => {
  return (
    <MakeTrailing {...rest}>
      {children}
    </MakeTrailing>
  );
};


export const TextFieldLabel = ({ children, }: TextFieldLabelProps) => <MakeLabel>{children}</MakeLabel>;


const TextFieldGroupBase = ({
  children, id, theme, style, a11y, testID, ref,
}: (TextFieldGroupProps | GlassTextFieldGroupProps)) => {

  const { cssProperties } = useMediaQuery(theme, style);
  const accessibility = resolveA11y(a11y);

  return (
    <View
      id={id}
      style={cssProperties}
      a11y={accessibility}
      testID={testID}
      ref={ref}
    >
      {children}
    </View>
  );
};


export const TextFieldGroup = (props: TextFieldGroupProps) => <TextFieldGroupBase {...props} />;


export const GlassTextFieldGroup = (props: GlassTextFieldGroupProps) => <TextFieldGroupBase {...props} />
