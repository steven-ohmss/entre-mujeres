interface LeafDecorationProps {
  className?: string;
  color?: string;
}

export default function LeafDecoration({
  className = "",
  color = "#6E8B3D",
}: LeafDecorationProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M60 10C80 20 100 40 100 65C100 90 80 108 55 108C40 108 25 100 18 85C35 88 55 82 65 68C50 75 32 72 22 60C40 62 55 54 60 40C48 44 36 38 32 26C48 30 62 20 60 10Z"
        fill={color}
        opacity="0.9"
      />
      <path
        d="M60 10C58 25 55 45 40 58"
        stroke="#F7F3EB"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
