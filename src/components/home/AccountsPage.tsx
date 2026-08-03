import { Box, Group, ScrollArea, Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import { sessionsAtom } from "@/state/atoms";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import Accounts from "./Accounts";
import Databases from "./Databases";

/**
 * Height the analytics card gets in portrait. The card is tab-based and its
 * panels size themselves to their container, so it needs a concrete height
 * once it lives inside a scrolling page instead of a full-height column.
 */
const PORTRAIT_ANALYTICS_HEIGHT = "28rem";

function AccountsPage() {
  const sessions = useAtomValue(sessionsAtom);
  const portrait = useIsMobilePortrait();

  // Portrait has no room for the two columns: the account cards stack
  // single-column and the charts sit full-width underneath, all on one
  // scrolling page. Landscape and desktop keep the side-by-side layout.
  if (portrait) {
    // Nothing to scroll before the first account is added — the empty state
    // wants the whole viewport so its call to action stays centered.
    if (sessions.length === 0) {
      return (
        <Box h="100%" px="sm" pb="sm">
          <Accounts />
        </Box>
      );
    }
    return (
      <ScrollArea h="100%" px="sm" pb="sm" offsetScrollbars>
        <Stack gap="sm">
          <Accounts />
          <Box h={PORTRAIT_ANALYTICS_HEIGHT}>
            <Databases />
          </Box>
        </Stack>
      </ScrollArea>
    );
  }

  return (
    <Group grow px="lg" pb="lg" h="100%" style={{ overflow: "hidden" }}>
      <Stack h="100%">
        <Accounts />
      </Stack>

      {sessions.length > 0 && (
        <Box h="100%" pt="md" style={{ overflow: "hidden" }}>
          <Databases />
        </Box>
      )}
    </Group>
  );
}

export default AccountsPage;
