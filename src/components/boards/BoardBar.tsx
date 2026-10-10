import { Group, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import { MobileBoardBar } from "./MobileBoardBar";

export interface BoardBarProps {
  name: string;
  rating?: string | number | null;
  onNameClick: () => void;
  height: string;
  children?: ReactNode;
}

export function BoardBar({ name, rating, onNameClick, height, children }: BoardBarProps) {
  const mobilePortrait = useIsMobilePortrait();

  // Portrait phones hide the eval-bar column this bar otherwise indents past,
  // and the board competes with the notation strip for the screen's height, so
  // the players become small corner captions instead (see MobileBoardBar).
  if (mobilePortrait) {
    return (
      <MobileBoardBar name={name} rating={rating} onNameClick={onNameClick}>
        {children}
      </MobileBoardBar>
    );
  }

  return (
    <Group ml="2.5rem" mr="xs" h={height} justify="space-between" wrap="nowrap" align="flex-end">
      <Group gap={6} align="baseline">
        <Text fw="bold" size="md" style={{ cursor: "pointer" }} onClick={onNameClick}>
          {name !== "?" && name}
        </Text>
        {rating && (
          <Text size="xs" c="dimmed">
            ({rating})
          </Text>
        )}
      </Group>

      <Group align="flex-end" wrap="nowrap">
        {children}
      </Group>
    </Group>
  );
}
