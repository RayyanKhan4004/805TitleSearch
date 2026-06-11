"use client";

import { ICONS } from "@/components/icons";
import type { IconProps } from "@/app/components/feature/tables/types";

export default function Icon({ name, size = 13, style = {}, className }: IconProps) {
  const SvgIcon = ICONS[name];

  if (!SvgIcon) return null;

  return (
    <SvgIcon
      width={size}
      height={size}
      className={className}
      style={{ flexShrink: 0, ...style }}
    />
  );
}
