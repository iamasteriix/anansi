import type { A11yProps } from "./types";


export const resolveA11y = (props?: A11yProps): object => {
  if (!props) return {};
  return Object.fromEntries(
    Object.entries({
      'aria-label': props.label,
      'role': props.role,
      'aria-disabled': props.state?.disabled,
      'aria-selected': props.state?.selected,
      'aria-checked': props.state?.checked,
      'aria-valuenow': props.value?.now,
      'aria-valuemax': props.value?.max,
      'aria-valuemin': props.value?.min,
      'aria-valuetext': props.value?.text,
      'aria-busy': props.state?.busy,
      'aria-expanded': props.state?.expanded,
      'aria-describedby': props.hint,
      'aria-hidden': props.hidden,
    }).filter(([_, value]) => value !== null && value !== undefined));
}
