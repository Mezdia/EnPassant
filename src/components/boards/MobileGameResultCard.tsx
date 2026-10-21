import { Paper, PaperProps, Stack, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useTranslation } from "react-i18next";
import { match } from "ts-pattern";
import type { GameResult } from "@/bindings";
import { currentGameResultAtom } from "@/state/mobileAtoms";
import { MobileMoveTimes } from "./MobileMoveTimes";

/**
 * The phone's post-game card: the status the desktop shows in the headers
 * editor, phrased like the reference app's game-over state (winner by
 * reason), plus the move-times chart that used to be one of the panel's
 * buttons. The other actions — new game, analysis — stay in the action bar so
 * the card does not duplicate them.
 */
export function MobileGameResultCard(props: PaperProps) {
  const { t } = useTranslation();
  const result = useAtomValue(currentGameResultAtom);

  const headline = match(result)
    .with({ type: "whiteWins" }, () => t("Game.Mobile.WhiteWins"))
    .with({ type: "blackWins" }, () => t("Game.Mobile.BlackWins"))
    .with({ type: "draw" }, () => t("Game.Mobile.Draw"))
    .otherwise(() => t("Game.Mobile.GameOver"));

  const reason = match(result?.reason)
    .with("checkmate", () => t("Game.Mobile.ReasonCheckmate"))
    .with("timeout", () => t("Game.Mobile.ReasonTimeout"))
    .with("resignation", () => t("Game.Mobile.ReasonResignation"))
    .with("abandonment", () => t("Game.Mobile.ReasonAbandonment"))
    .with("stalemate", () => t("Game.Mobile.ReasonStalemate"))
    .with("insufficientMaterial", () => t("Game.Mobile.ReasonInsufficientMaterial"))
    .with("threefoldRepetition", () => t("Game.Mobile.ReasonThreefoldRepetition"))
    .with("fiftyMoveRule", () => t("Game.Mobile.ReasonFiftyMoveRule"))
    .with("agreement", () => t("Game.Mobile.ReasonAgreement"))
    .otherwise(() => null);

  return (
    <Paper withBorder shadow="sm" p="md" h="100%" {...props}>
      <Stack justify="center" gap="xs" h="100%">
        <Text ta="center" fz="xl" fw={700}>
          {headline}
        </Text>
        {reason && (
          <Text ta="center" fz="sm" c="dimmed">
            {reason}
          </Text>
        )}
        <MobileMoveTimes />
      </Stack>
    </Paper>
  );
}
