import { useMediaQuery } from "@mantine/hooks";
import { isDesktop } from "@/utils/platform";

/**
 * Returns true when the viewport is in landscape orientation (wider than tall).
 * Falls back to landscape=false (portrait) when matchMedia is unavailable.
 */
export function useIsLandscape(): boolean {
  return useMediaQuery("(orientation: landscape)", false) ?? false;
}

/**
 * True on a phone/tablet held in portrait — the one layout with no room for a
 * second column, so master/detail has to become a drill-in.
 */
export function useIsMobilePortrait(): boolean {
  const landscape = useIsLandscape();
  return !isDesktop() && !landscape;
}
