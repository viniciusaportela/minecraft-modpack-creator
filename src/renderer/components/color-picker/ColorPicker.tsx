interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="relative mt-0.5 w-[25px] h-[25px]">
      <div
        className="absolute inset-0 rounded-full border-1"
        style={{ backgroundColor: value }}
      />
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none opacity-0 w-[25px] h-[25px]"
      />
    </div>
  );
}
