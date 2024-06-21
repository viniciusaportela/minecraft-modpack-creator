import { CSSProperties, PropsWithChildren } from 'react';
import clsx from 'clsx';

export default function Label({
  children,
  className,
  style,
  nestLevel,
}: PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
  nestLevel?: number;
}>) {
  const calculateLabelColorFromNestedLevel = () => {
    const BASE_PATH_LENGTH = 7;

    if (!nestLevel || nestLevel - BASE_PATH_LENGTH === 0) {
      return 'white';
    }

    const baseColorHue = 17;
    const baseColorSaturation = 1;
    const baseColorLightness = 51;

    const hue = baseColorHue + (nestLevel - BASE_PATH_LENGTH) * 12;
    const saturation =
      baseColorSaturation + (nestLevel - BASE_PATH_LENGTH) * 12;

    return `hsl(${hue}, ${saturation}%, ${baseColorLightness}%)`;
  };

  return (
    <span
      className={clsx('text-[14px] -mb-1', className)}
      style={{
        color: calculateLabelColorFromNestedLevel(),
        fontWeight: 'bold',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
