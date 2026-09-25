export const resolveIconColor = (
  fill: string | string[] = '#f0fefe',
  variant: 'monochrome' | 'duotone' = 'monochrome',
  index: number = 0,
): string => {
  const isFillArray = Array.isArray(fill);
  const idx = isFillArray && index >= fill.length ? 1 : index;  // duotone icons only require 2 colors
  return (
      isFillArray && variant === 'monochrome' ? fill[0]
    : isFillArray ? fill[idx]
    : fill
  );
}