"use client";

import { PATHS } from "@/app/components/feature/tables/components/consts";
import type { IconProps } from "@/app/components/feature/tables/types";

export default function Icon({ name, size = 13, style = {}, className }: IconProps) {
  const paths = Array.isArray(PATHS[name]) ? PATHS[name] : [PATHS[name]];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
