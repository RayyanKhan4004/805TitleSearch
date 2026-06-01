"use client";

import { useMemo } from "react";
import { SCHEMES, type EntityScheme } from "./schemes";

/**
 * useScheme — custom hook that returns the full EntityScheme
 * for a given entity type, plus helper booleans.
 *
 * @param entity — one of "XFER" | "DOT" | "LIEN" | "EASE" | "BANKR" | "MISC"
 * @returns { scheme, isDefault, entityKeys }
 *
 * Usage:
 *   const { scheme, isDefault } = useScheme(row.entity);
 *   // scheme.bg, scheme.border, scheme.hover, etc.
 */
export function useScheme(entity: string) {
  const isDefault = !entity || !SCHEMES[entity];

  return useMemo(() => {
    const scheme_: EntityScheme = SCHEMES[entity] || SCHEMES.MISC;
    const entityKeys = Object.keys(SCHEMES);

    return {
      scheme: scheme_,
      isDefault,
      entityKeys,
    };
  }, [entity, isDefault]);
}
