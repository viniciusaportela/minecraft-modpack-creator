import { CSSProperties, PropsWithChildren } from 'react';
import clsx from 'clsx';

export default function Label({
  children,
  className,
  style,
  nestLevel,
  path,
}: PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
  nestLevel?: number;
  path: string[];
}>) {
  const calculateLabelColorFromNestedLevel = () => {
    const BASE_PATH_LENGTH = 7;

    if (!nestLevel || nestLevel - BASE_PATH_LENGTH == 0) {
      return 'white';
    }

    const baseColorHue = 17;
    const baseColorSaturation = 63;
    const baseColorLightness = 51;

    const hue = baseColorHue + (nestLevel - BASE_PATH_LENGTH) * 12;

    return `hsl(${hue}, ${baseColorSaturation}%, ${baseColorLightness}%)`;
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
      {children}({path.slice(6).join(',')})
    </span>
  );
}
