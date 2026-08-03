import { Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const LICHESS_TIME_CONTROLS = [
  "ultra_bullet",
  "bullet",
  "blitz",
  "rapid",
  "classical",
  "correspondence",
] as const;

const CHESSCOM_TIME_CONTROLS = ["bullet", "blitz", "rapid", "daily"] as const;

/** `ultra_bullet` → `UltraBullet`, matching the `TimeControl.*` key names. */
function timeControlKey(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

interface TimeControlSelectorProps {
  onTimeControlChange: (value: string | null) => void;
  website: string | null;
  allowAll: boolean;
}

const TimeControlSelector = ({
  onTimeControlChange,
  website,
  allowAll,
}: TimeControlSelectorProps) => {
  const { t } = useTranslation();
  const timeControls = [
    ...(allowAll ? [{ value: "any", label: t("Common.Any") }] : []),
    ...(website === "Chess.com" ? CHESSCOM_TIME_CONTROLS : LICHESS_TIME_CONTROLS).map((value) => ({
      value,
      label: t(`TimeControl.${timeControlKey(value)}`),
    })),
  ];

  const defaultTimeControl = allowAll ? "any" : "rapid";
  const [timeControl, setTimeControl] = useState<string | null>(defaultTimeControl);

  useEffect(() => {
    onTimeControlChange(timeControl);
  }, [timeControl]);

  useEffect(() => {
    if (!timeControls.some((control) => control.value === timeControl)) {
      setTimeControl(defaultTimeControl);
    }
  }, [website, timeControls]);

  return (
    <Select
      pt="lg"
      label={t("Board.Database.TimeControl")}
      value={timeControl}
      onChange={(value) => setTimeControl(value)}
      data={timeControls}
      allowDeselect={false}
    />
  );
};

export default TimeControlSelector;
