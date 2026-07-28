import { useMediaQuery } from "@mantine/hooks";

/**
 * Returns true when the viewport is in landscape orientation (wider than tall).
 * Falls back to landscape=false (portrait) when matchMedia is unavailable.
 */
export function useIsLandscape(): boolean {
  return useMediaQuery("(orientation: landscape)", false) ?? false;
}
