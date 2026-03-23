interface HamburgerIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function HamburgerIcon({
  size = 40,
  color = "white",
  strokeWidth = 4,
}: HamburgerIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.75}
      viewBox="0 0 40 30"
      aria-label="Menu"
      role="img"
    >
      <line x1="4" y1="5"  x2="36" y2="5"  stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="15" x2="36" y2="15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="4" y1="25" x2="36" y2="25" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}