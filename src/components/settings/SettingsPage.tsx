import {
  ActionIcon,
  Box,
  Card,
  Group,
  Paper,
  ScrollArea,
  Select,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconBook,
  IconBrush,
  IconChess,
  IconChevronRight,
  IconDeviceMobile,
  IconFlag,
  IconFolder,
  IconKeyboard,
  IconMouse,
  IconReload,
  IconSearch,
  IconShield,
  IconVolume,
} from "@tabler/icons-react";
import { useLoaderData } from "@tanstack/react-router";
import { open } from "@tauri-apps/plugin-dialog";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import posthog from "posthog-js";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  autoPromoteAtom,
  autoSaveAtom,
  enableBoardScrollAtom,
  eraseDrawablesOnClickAtom,
  flipBoardAfterMoveAtom,
  flipBoardOnDoubleTapAtom,
  forcedEnPassantAtom,
  hapticsEnabledAtom,
  materialDisplayAtom,
  moveHighlightAtom,
  moveInputAtom,
  moveMethodAtom,
  moveNotationTypeAtom,
  nativeBarAtom,
  practiceAutoDifficultyAtom,
  previewBoardOnHoverAtom,
  showArrowsAtom,
  showConsecutiveArrowsAtom,
  showCoordinatesAtom,
  showDestsAtom,
  showVariationArrowsAtom,
  snapArrowsAtom,
  spellCheckAtom,
  storedDatabasesDirAtom,
  storedDocumentDirAtom,
  storedEnginesDirAtom,
  storedPuzzlesDirAtom,
  telemetryEnabledAtom,
} from "@/state/atoms";
import { keyMapAtom } from "@/state/keybinds";
import { isAndroid, isMobile } from "@/utils/platform";
import { useIsMobilePortrait } from "@/utils/useIsLandscape";
import FileInput from "../common/FileInput";
import BoardSelect from "./BoardSelect";
import ColorControl from "./ColorControl";
import FontSizeSlider from "./FontSizeSlider";
import KeybindInput from "./KeybindInput";
import PiecesSelect from "./PiecesSelect";
import RepertoireMinGamesSetting from "./RepertoireMinGamesSetting";
import classes from "./SettingsPage.module.css";
import SettingsSwitch from "./SettingsSwitch";
import SoundSelect from "./SoundSelect";
import ThemeButton from "./ThemeButton";
import VolumeSlider from "./VolumeSlider";

type SettingCategory =
  | "board"
  | "inputs"
  | "mobile"
  | "anarchy"
  | "appearance"
  | "sound"
  | "keybinds"
  | "directories"
  | "repertoire"
  | "privacy";

interface SettingItem {
  id: string;
  category: SettingCategory;
  title: string;
  description: string;
  keywords?: string[];
  /** Shown only on mobile; hidden on desktop. */
  mobileOnly?: boolean;
  render: () => React.ReactNode;
}

function SettingRow({
  title,
  description,
  children,
  highlight,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      gap="xl"
      className={classes.item}
      style={highlight ? { backgroundColor: "var(--mantine-color-yellow-light)" } : undefined}
    >
      <div>
        <Text>{title}</Text>
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      </div>
      {children}
    </Group>
  );
}

function TelemetrySwitch() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useAtom(telemetryEnabledAtom);
  return (
    <Switch
      onLabel={t("Common.On")}
      offLabel={t("Common.Off")}
      size="lg"
      checked={enabled}
      onChange={(event) => {
        const newValue = event.currentTarget.checked;
        setEnabled(newValue);
        if (newValue) {
          posthog.opt_in_capturing();
        } else {
          posthog.opt_out_capturing();
        }
      }}
      styles={{
        track: { cursor: "pointer" },
      }}
    />
  );
}

export default function Page() {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Portrait drill-in: the category the user tapped, null when showing the list.
  const [drillCategory, setDrillCategory] = useState<SettingCategory | null>(null);

  const [keyMap, setKeyMap] = useAtom(keyMapAtom);
  const [isNative, setIsNative] = useAtom(nativeBarAtom);
  const {
    dirs: {
      documentDir,
      databasesDir: defaultDatabasesDir,
      enginesDir: defaultEnginesDir,
      puzzlesDir: defaultPuzzlesDir,
    },
    version,
  } = useLoaderData({ from: "/settings" });
  let [filesDirectory, setFilesDirectory] = useAtom(storedDocumentDirAtom);
  filesDirectory = filesDirectory || documentDir;
  let [databasesDirectory, setDatabasesDirectory] = useAtom(storedDatabasesDirAtom);
  databasesDirectory = databasesDirectory || defaultDatabasesDir;
  let [enginesDirectory, setEnginesDirectory] = useAtom(storedEnginesDirAtom);
  enginesDirectory = enginesDirectory || defaultEnginesDir;
  let [puzzlesDirectory, setPuzzlesDirectory] = useAtom(storedPuzzlesDirAtom);
  puzzlesDirectory = puzzlesDirectory || defaultPuzzlesDir;

  const [moveMethod, setMoveMethod] = useAtom(moveMethodAtom);
  const [moveNotationType, setMoveNotationType] = useAtom(moveNotationTypeAtom);
  const [showCoordinates, setShowCoordinates] = useAtom(showCoordinatesAtom);
  const [materialDisplay, setMaterialDisplay] = useAtom(materialDisplayAtom);
  const [practiceAutoDifficulty, setPracticeAutoDifficulty] = useAtom(practiceAutoDifficultyAtom);

  const settings: SettingItem[] = useMemo(
    () => [
      // Board settings
      {
        id: "piece-dest",
        category: "board",
        title: t("Settings.PieceDest"),
        description: t("Settings.PieceDest.Desc"),
        keywords: ["destination", "moves", "highlight"],
        render: () => <SettingsSwitch atom={showDestsAtom} />,
      },
      {
        id: "move-highlight",
        category: "board",
        title: t("Settings.MoveHighlight"),
        description: t("Settings.MoveHighlight.Desc"),
        keywords: ["highlight", "last move"],
        render: () => <SettingsSwitch atom={moveHighlightAtom} />,
      },
      {
        id: "arrows",
        category: "board",
        title: t("Settings.Arrows"),
        description: t("Settings.Arrows.Desc"),
        keywords: ["arrows", "analysis"],
        render: () => <SettingsSwitch atom={showArrowsAtom} />,
      },
      {
        id: "variation-arrows",
        category: "board",
        title: t("Settings.VariationArrows"),
        description: t("Settings.VariationArrows.Desc"),
        keywords: ["arrows", "variations", "alternative"],
        render: () => <SettingsSwitch atom={showVariationArrowsAtom} />,
      },
      {
        id: "move-notation",
        category: "board",
        title: t("Settings.MoveNotation"),
        description: t("Settings.MoveNotation.Desc"),
        keywords: ["notation", "letters", "symbols", "pieces"],
        render: () => (
          <Select
            data={[
              { label: t("Settings.MoveNotation.Letters"), value: "letters" },
              { label: t("Settings.MoveNotation.Symbols"), value: "symbols" },
            ]}
            allowDeselect={false}
            value={moveNotationType}
            onChange={(val) => setMoveNotationType(val as "letters" | "symbols")}
          />
        ),
      },
      {
        id: "move-method",
        category: "board",
        title: t("Settings.MoveMethod"),
        description: t("Settings.MoveMethod.Desc"),
        keywords: ["drag", "click", "move", "pieces"],
        render: () => (
          <Select
            data={[
              { label: t("Settings.MoveMethod.Drag"), value: "drag" },
              { label: t("Settings.MoveMethod.Click"), value: "select" },
              { label: t("Settings.MoveMethod.Both"), value: "both" },
            ]}
            allowDeselect={false}
            value={moveMethod}
            onChange={(val) => setMoveMethod(val as "drag" | "select" | "both")}
          />
        ),
      },
      {
        id: "snap-arrows",
        category: "board",
        title: t("Settings.SnapArrows"),
        description: t("Settings.SnapArrows.Desc"),
        keywords: ["arrows", "snap"],
        render: () => <SettingsSwitch atom={snapArrowsAtom} />,
      },
      {
        id: "consecutive-arrows",
        category: "board",
        title: t("Settings.ConsecutiveArrows"),
        description: t("Settings.ConsecutiveArrows.Desc"),
        keywords: ["arrows", "consecutive"],
        render: () => <SettingsSwitch atom={showConsecutiveArrowsAtom} />,
      },
      {
        id: "erase-drawables",
        category: "board",
        title: t("Settings.EraseDrawablesOnClick"),
        description: t("Settings.EraseDrawablesOnClick.Desc"),
        keywords: ["erase", "drawables", "click", "arrows"],
        render: () => <SettingsSwitch atom={eraseDrawablesOnClickAtom} />,
      },
      {
        id: "auto-promote",
        category: "board",
        title: t("Settings.AutoPromition"),
        description: t("Settings.AutoPromition.Desc"),
        keywords: ["promote", "queen", "pawn"],
        render: () => <SettingsSwitch atom={autoPromoteAtom} />,
      },
      {
        id: "coordinates",
        category: "board",
        title: t("Settings.Coordinates"),
        description: t("Settings.Coordinates.Desc"),
        keywords: ["coordinates", "a-h", "1-8"],
        render: () => (
          <Select
            data={[
              { label: t("Settings.Coordinates.None"), value: "no" },
              { label: t("Settings.Coordinates.Edge"), value: "edge" },
              { label: t("Settings.Coordinates.All"), value: "all" },
            ]}
            allowDeselect={false}
            value={showCoordinates}
            onChange={(val) => setShowCoordinates(val as "no" | "edge" | "all")}
          />
        ),
      },
      {
        id: "auto-save",
        category: "board",
        title: t("Settings.AutoSave"),
        description: t("Settings.AutoSave.Desc"),
        keywords: ["save", "auto"],
        render: () => <SettingsSwitch atom={autoSaveAtom} />,
      },
      {
        id: "preview-board",
        category: "board",
        title: t("Settings.PreviewBoard"),
        description: t("Settings.PreviewBoard.Desc"),
        keywords: ["preview", "hover"],
        render: () => <SettingsSwitch atom={previewBoardOnHoverAtom} />,
      },
      {
        id: "flip-board-after-move",
        category: "board",
        title: t("Settings.FlipBoardAfterMove"),
        description: t("Settings.FlipBoardAfterMove.Desc"),
        keywords: ["flip", "board", "move"],
        render: () => <SettingsSwitch atom={flipBoardAfterMoveAtom} />,
      },
      {
        id: "scroll-moves",
        category: "board",
        title: t("Settings.ScrollThroughMoves"),
        description: t("Settings.ScrollThroughMoves.Desc"),
        keywords: ["scroll", "moves", "wheel"],
        render: () => <SettingsSwitch atom={enableBoardScrollAtom} />,
      },
      {
        id: "material-display",
        category: "board",
        title: t("Settings.MaterialDisplay"),
        description: t("Settings.MaterialDisplay.Desc"),
        keywords: ["material", "captured", "pieces", "difference"],
        render: () => (
          <Select
            data={[
              { label: t("Settings.MaterialDisplay.Diff"), value: "diff" },
              { label: t("Settings.MaterialDisplay.All"), value: "all" },
            ]}
            allowDeselect={false}
            value={materialDisplay}
            onChange={(val) => setMaterialDisplay(val as "diff" | "all")}
          />
        ),
      },
      // Input settings
      {
        id: "text-input",
        category: "inputs",
        title: t("Settings.Inputs.TextInput"),
        description: t("Settings.Inputs.TextInput.Desc"),
        keywords: ["text", "input", "type"],
        render: () => <SettingsSwitch atom={moveInputAtom} />,
      },
      {
        id: "spell-check",
        category: "inputs",
        title: t("Settings.Inputs.SpellCheck"),
        description: t("Settings.Inputs.SpellCheck.Desc"),
        keywords: ["spell", "check", "grammar"],
        render: () => <SettingsSwitch atom={spellCheckAtom} />,
      },
      // Mobile input settings (Android-only; no pointer/keyboard on a phone)
      {
        id: "haptics",
        category: "mobile",
        mobileOnly: true,
        title: t("Settings.Mobile.Haptics"),
        description: t("Settings.Mobile.Haptics.Desc"),
        keywords: ["haptics", "vibrate", "feedback"],
        render: () => <SettingsSwitch atom={hapticsEnabledAtom} />,
      },
      {
        id: "tap-to-move",
        category: "mobile",
        mobileOnly: true,
        title: t("Settings.Mobile.TapToMove"),
        description: t("Settings.Mobile.TapToMove.Desc"),
        keywords: ["tap", "click", "drag", "move"],
        render: () => (
          <Select
            allowDeselect={false}
            data={[
              { label: t("Settings.MoveMethod.Drag"), value: "drag" },
              { label: t("Settings.MoveMethod.Click"), value: "select" },
              { label: t("Settings.MoveMethod.Both"), value: "both" },
            ]}
            value={moveMethod}
            onChange={(val) => setMoveMethod(val as "drag" | "select" | "both")}
          />
        ),
      },
      {
        id: "flip-board-double-tap",
        category: "mobile",
        mobileOnly: true,
        title: t("Settings.Mobile.FlipBoardDoubleTap"),
        description: t("Settings.Mobile.FlipBoardDoubleTap.Desc"),
        keywords: ["flip", "board", "double", "tap", "gesture"],
        render: () => <SettingsSwitch atom={flipBoardOnDoubleTapAtom} />,
      },
      // Anarchy settings
      {
        id: "forced-en-passant",
        category: "anarchy",
        title: t("Settings.Anarchy.ForcedEnCroissant"),
        description: t("Settings.Anarchy.ForcedEnCroissant.Desc"),
        keywords: ["en passant", "forced", "croissant"],
        render: () => <SettingsSwitch atom={forcedEnPassantAtom} />,
      },
      // Appearance settings
      {
        id: "theme",
        category: "appearance",
        title: t("Settings.Appearance.Theme"),
        description: t("Settings.Appearance.Theme.Desc"),
        keywords: ["theme", "dark", "light", "color"],
        render: () => <ThemeButton />,
      },
      {
        id: "language",
        category: "appearance",
        title: t("Settings.Appearance.Language"),
        description: t("Settings.Appearance.Language.Desc"),
        keywords: ["language", "locale", "translation"],
        render: () => (
          <Select
            allowDeselect={false}
            data={[
              { value: "be_BY", label: "Belarusian" },
              { value: "zh_CN", label: "Chinese (Simplified)" },
              { value: "zh_TW", label: "Chinese (Traditional)" },
              { value: "en_GB", label: "English (UK)" },
              { value: "en_US", label: "English (US)" },
              { value: "fr_FR", label: "Français" },
              { value: "pl_PL", label: "Polish" },
              { value: "nb_NO", label: "Norsk bokmål" },
              { value: "pt_PT", label: "Portuguese" },
              { value: "ru_RU", label: "Russian" },
              { value: "es_ES", label: "Spanish" },
              { value: "it_IT", label: "Italian" },
              { value: "uk_UA", label: "Ukrainian" },
              { value: "tr_TR", label: "Türkçe" },
              { value: "ko_KR", label: "한국어" },
              { value: "de_DE", label: "Deutsch" },
            ]}
            value={i18n.language.replace("-", "_")}
            onChange={(val) => {
              i18n.changeLanguage(val?.replace("_", "-") || "en-US");
            }}
          />
        ),
      },
      ...(import.meta.env.VITE_PLATFORM === "win32" || import.meta.env.VITE_PLATFORM === "linux"
        ? [
            {
              id: "title-bar",
              category: "appearance" as SettingCategory,
              title: t("Settings.Appearance.TitleBar"),
              description: t("Settings.Appearance.TitleBar.Desc"),
              keywords: ["title", "bar", "native", "custom"],
              render: () => (
                <Select
                  allowDeselect={false}
                  data={[
                    {
                      value: "Native",
                      label: t("Settings.Appearance.TitleBar.Native"),
                    },
                    {
                      value: "Custom",
                      label: t("Settings.Appearance.TitleBar.Custom"),
                    },
                  ]}
                  value={isNative ? "Native" : "Custom"}
                  onChange={(val) => setIsNative(val === "Native")}
                />
              ),
            },
          ]
        : []),
      {
        id: "font-size",
        category: "appearance",
        title: t("Settings.Appearance.FontSize"),
        description: t("Settings.Appearance.FontSize.Desc"),
        keywords: ["font", "size", "text"],
        render: () => <FontSizeSlider />,
      },
      {
        id: "piece-set",
        category: "appearance",
        title: t("Settings.Appearance.PieceSet"),
        description: t("Settings.Appearance.PieceSet.Desc"),
        keywords: ["piece", "set", "style"],
        render: () => <PiecesSelect />,
      },
      {
        id: "board-image",
        category: "appearance",
        title: t("Settings.Appearance.BoardImage"),
        description: t("Settings.Appearance.BoardImage.Desc"),
        keywords: ["board", "image", "texture"],
        render: () => <BoardSelect />,
      },
      {
        id: "accent-color",
        category: "appearance",
        title: t("Settings.Appearance.AccentColor"),
        description: t("Settings.Appearance.AccentColor.Desc"),
        keywords: ["accent", "color", "primary"],
        render: () => (
          <div style={{ width: 200 }}>
            <ColorControl />
          </div>
        ),
      },
      // Repertoire settings
      {
        id: "repertoire-depth",
        category: "repertoire",
        title: t("Settings.Repertoire.Depth"),
        description: t("Settings.Repertoire.Depth.Desc"),
        keywords: ["repertoire", "depth", "games", "min"],
        render: () => <RepertoireMinGamesSetting />,
      },
      {
        id: "repertoire-auto-difficulty",
        category: "repertoire",
        title: t("Settings.Repertoire.AutoDifficulty"),
        description: t("Settings.Repertoire.AutoDifficulty.Desc"),
        keywords: ["repertoire", "auto", "difficulty", "select", "anki"],
        render: () => (
          <Select
            allowDeselect={false}
            data={[
              { label: t("Settings.Repertoire.AutoDifficulty.None"), value: "none" },
              { label: t("Board.Practice.Again"), value: "1" },
              { label: t("Board.Practice.Hard"), value: "2" },
              { label: t("Board.Practice.Good"), value: "3" },
              { label: t("Board.Practice.Easy"), value: "4" },
            ]}
            value={practiceAutoDifficulty}
            onChange={(val) => setPracticeAutoDifficulty(val as "none" | "1" | "2" | "3" | "4")}
          />
        ),
      },
      // Sound settings
      {
        id: "volume",
        category: "sound",
        title: t("Settings.Sound.Volume"),
        description: t("Settings.Sound.Volume.Desc"),
        keywords: ["volume", "audio", "loud"],
        render: () => <VolumeSlider />,
      },
      {
        id: "sound-collection",
        category: "sound",
        title: t("Settings.Sound.Collection"),
        description: t("Settings.Sound.Collection.Desc"),
        keywords: ["sound", "collection", "audio", "effects"],
        render: () => <SoundSelect />,
      },
      // Directories settings
      {
        id: "files-directory",
        category: "directories",
        title: t("Settings.Directories.Files"),
        description: t("Settings.Directories.Files.Desc"),
        keywords: ["files", "directory", "folder", "path"],
        render: () => (
          <FileInput
            onClick={async () => {
              const selected = await open({
                multiple: false,
                directory: true,
              });
              if (!selected || typeof selected !== "string") return;
              setFilesDirectory(selected);
            }}
            filename={filesDirectory || null}
          />
        ),
      },
      {
        id: "databases-directory",
        category: "directories",
        title: t("Settings.Directories.Databases"),
        description: t("Settings.Directories.Databases.Desc"),
        keywords: ["databases", "directory", "folder", "path"],
        render: () => (
          <FileInput
            onClick={async () => {
              const selected = await open({
                multiple: false,
                directory: true,
              });
              if (!selected || typeof selected !== "string") return;
              setDatabasesDirectory(selected);
            }}
            filename={databasesDirectory || null}
          />
        ),
      },
      {
        id: "engines-directory",
        category: "directories",
        title: t("Settings.Directories.Engines"),
        description: t("Settings.Directories.Engines.Desc"),
        keywords: ["engines", "directory", "folder", "path"],
        render: () => (
          <FileInput
            onClick={async () => {
              const selected = await open({
                multiple: false,
                directory: true,
              });
              if (!selected || typeof selected !== "string") return;
              setEnginesDirectory(selected);
            }}
            filename={enginesDirectory || null}
          />
        ),
      },
      {
        id: "puzzles-directory",
        category: "directories",
        title: t("Settings.Directories.Puzzles"),
        description: t("Settings.Directories.Puzzles.Desc"),
        keywords: ["puzzles", "directory", "folder", "path"],
        render: () => (
          <FileInput
            onClick={async () => {
              const selected = await open({
                multiple: false,
                directory: true,
              });
              if (!selected || typeof selected !== "string") return;
              setPuzzlesDirectory(selected);
            }}
            filename={puzzlesDirectory || null}
          />
        ),
      },
      // Privacy settings
      {
        id: "telemetry",
        category: "privacy",
        title: t("Settings.Privacy.Telemetry"),
        description: t("Settings.Privacy.Telemetry.Desc"),
        keywords: ["telemetry", "privacy", "analytics", "tracking"],
        render: () => <TelemetrySwitch />,
      },
    ],
    [
      t,
      i18n,
      moveNotationType,
      moveMethod,
      isNative,
      showCoordinates,
      materialDisplay,
      filesDirectory,
      databasesDirectory,
      enginesDirectory,
      puzzlesDirectory,
      setMoveNotationType,
      setMoveMethod,
      setIsNative,
      setFilesDirectory,
      setDatabasesDirectory,
      setEnginesDirectory,
      setPuzzlesDirectory,
      setShowCoordinates,
      setMaterialDisplay,
      practiceAutoDifficulty,
      setPracticeAutoDifficulty,
    ],
  );

  useHotkeys([["mod+f", () => searchInputRef.current?.focus()]]);

  const categoryInfo: Record<
    SettingCategory,
    { title: string; description: string; icon: React.ReactNode }
  > = useMemo(
    () => ({
      board: {
        title: t("Settings.Board"),
        description: t("Settings.Board.Desc"),
        icon: <IconChess size="1rem" />,
      },
      inputs: {
        title: t("Settings.Inputs"),
        description: t("Settings.Inputs.Desc"),
        icon: <IconMouse size="1rem" />,
      },
      mobile: {
        title: t("Settings.Mobile"),
        description: t("Settings.Mobile.Desc"),
        icon: <IconDeviceMobile size="1rem" />,
      },
      anarchy: {
        title: t("Settings.Anarchy"),
        description: t("Settings.Anarchy.Desc"),
        icon: <IconFlag size="1rem" />,
      },
      appearance: {
        title: t("Settings.Appearance"),
        description: t("Settings.Appearance.Desc"),
        icon: <IconBrush size="1rem" />,
      },
      sound: {
        title: t("Settings.Sound"),
        description: t("Settings.Sound.Desc"),
        icon: <IconVolume size="1rem" />,
      },
      keybinds: {
        title: t("Settings.Keybinds"),
        description: t("Settings.Keybinds.Desc"),
        icon: <IconKeyboard size="1rem" />,
      },
      directories: {
        title: t("Settings.Directories"),
        description: t("Settings.Directories.Desc"),
        icon: <IconFolder size="1rem" />,
      },
      repertoire: {
        title: t("Settings.Repertoire"),
        description: t("Settings.Repertoire.Desc"),
        icon: <IconBook size="1rem" />,
      },
      privacy: {
        title: t("Settings.Privacy"),
        description: t("Settings.Privacy.Desc"),
        icon: <IconShield size="1rem" />,
      },
    }),
    [t],
  );

  const filteredSettings = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return settings.filter(
      (setting) =>
        setting.title.toLowerCase().includes(query) ||
        setting.description.toLowerCase().includes(query) ||
        categoryInfo[setting.category].title.toLowerCase().includes(query) ||
        setting.id.toLowerCase().includes(query) ||
        setting.keywords?.some((kw) => kw.toLowerCase().includes(query)),
    );
  }, [searchQuery, settings, categoryInfo]);

  const renderSearchResults = () => {
    if (!filteredSettings) return null;

    if (filteredSettings.length === 0) {
      return (
        <Card withBorder p="lg" className={classes.card} w="100%">
          <Text c="dimmed" ta="center">
            No settings found for "{searchQuery}"
          </Text>
        </Card>
      );
    }

    // Group filtered settings by category
    const groupedSettings = filteredSettings.reduce(
      (acc, setting) => {
        if (!acc[setting.category]) {
          acc[setting.category] = [];
        }
        acc[setting.category].push(setting);
        return acc;
      },
      {} as Record<SettingCategory, SettingItem[]>,
    );

    return (
      <Card withBorder p="lg" className={classes.card} w="100%">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category}>
            <Group gap="xs" mt="md" mb="xs">
              {categoryInfo[category as SettingCategory].icon}
              <Text fw={500} size="sm" c="dimmed">
                {categoryInfo[category as SettingCategory].title}
              </Text>
            </Group>
            {categorySettings.map((setting) => (
              <SettingRow key={setting.id} title={setting.title} description={setting.description}>
                {setting.render()}
              </SettingRow>
            ))}
          </div>
        ))}
      </Card>
    );
  };

  const renderCategorySettings = (category: SettingCategory) => {
    const categorySettings = settings.filter((s) => s.category === category);
    return categorySettings.map((setting) => (
      <SettingRow key={setting.id} title={setting.title} description={setting.description}>
        {setting.render()}
      </SettingRow>
    ));
  };

  const searchBox = (
    <TextInput
      ref={searchInputRef}
      placeholder={t("Common.Search")}
      leftSection={<IconSearch size="1rem" />}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.currentTarget.value)}
      onKeyDown={(e) => {
        if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
        }
        if (e.key === "Escape") {
          setSearchQuery("");
          searchInputRef.current?.blur();
        }
      }}
      style={{ flex: 1, maxWidth: 400 }}
    />
  );

  const searchResults = filteredSettings ? (
    <ScrollArea flex={1} px="md">
      {renderSearchResults()}
      <Text size="xs" c="dimmed" ta="right" py="md">
        En Croissant v{version}
      </Text>
    </ScrollArea>
  ) : null;

  const keybindsPanel = (
    <Tabs.Panel value="keybinds">
      <Group>
        <Text size="lg" fw={500} className={classes.title}>
          {t("Settings.Keybinds")}
        </Text>
        <Tooltip label={t("Common.Reset")}>
          <ActionIcon onClick={() => setKeyMap(RESET)}>
            <IconReload size="1rem" />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Text size="xs" c="dimmed" mt={3} mb="lg">
        {t("Settings.Keybinds.Desc")}
      </Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t("Common.Description")}</Table.Th>
            <Table.Th>{t("Settings.Key")}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(keyMap).map(([action, keybind]) => (
            <Table.Tr key={keybind.name}>
              <Table.Td>{keybind.name}</Table.Td>
              <Table.Td>
                <KeybindInput action={action} keybind={keybind} />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Tabs.Panel>
  );

  // Portrait (Android phone held upright) has no room for a category rail, so
  // the categories become a tappable list that drills into a category's own
  // screen behind a back button. Landscape and desktop keep the vertical rail.
  const mobilePortrait = useIsMobilePortrait();
  const isMobilePlatform = isMobile();

  // Categories in display order; keybinds and directories are desktop-only
  // (no keyboard / no free-form paths on Android), mobile is mobile-only.
  const visibleCategories: SettingCategory[] = [
    "board",
    "inputs",
    ...(isMobilePlatform ? (["mobile"] as SettingCategory[]) : []),
    "anarchy",
    "appearance",
    "sound",
    ...(isAndroid() ? [] : (["keybinds", "directories"] as SettingCategory[])),
    "repertoire",
    "privacy",
  ];

  const renderDrillPanel = (category: SettingCategory) => (
    <Stack h="100%" gap={0} style={{ overflow: "hidden" }}>
      <Group gap="xs" pt="sm" pb="sm" px="xs" wrap="nowrap">
        <ActionIcon
          variant="default"
          onClick={() => setDrillCategory(null)}
          aria-label={t("Common.Back")}
        >
          <IconArrowLeft size="1rem" />
        </ActionIcon>
        <Text fw="bold" size="md">
          {categoryInfo[category].title}
        </Text>
      </Group>
      <ScrollArea flex={1} px="md" pb="md">
        <Card withBorder p="lg" className={classes.card} w="100%">
          <Text size="lg" fw={500} className={classes.title}>
            {categoryInfo[category].title}
          </Text>
          <Text size="xs" c="dimmed" mt={3} mb="lg">
            {categoryInfo[category].description}
          </Text>
          {renderCategorySettings(category)}
        </Card>
        <Text size="xs" c="dimmed" ta="right" pt="md">
          En Croissant v{version}
        </Text>
      </ScrollArea>
    </Stack>
  );

  const renderCategoryList = () => (
    <ScrollArea flex={1} px="md" pb="md">
      <Stack gap="xs">
        {visibleCategories.map((category) => (
          <Paper
            key={category}
            withBorder
            p="sm"
            radius="md"
            style={{ cursor: "pointer" }}
            onClick={() => setDrillCategory(category)}
          >
            <Group justify="space-between" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                {categoryInfo[category].icon}
                <Stack gap={0}>
                  <Text size="sm" fw={500}>
                    {categoryInfo[category].title}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {categoryInfo[category].description}
                  </Text>
                </Stack>
              </Group>
              <IconChevronRight size="1rem" color="dimmed" />
            </Group>
          </Paper>
        ))}
      </Stack>
      <Text size="xs" c="dimmed" ta="right" py="md">
        En Croissant v{version}
      </Text>
    </ScrollArea>
  );

  if (mobilePortrait) {
    return (
      <Stack h="100%" gap="xs" px="sm" pb="sm" style={{ overflow: "hidden" }}>
        {drillCategory ? (
          renderDrillPanel(drillCategory)
        ) : (
          <>
            <Group pt="sm" gap="xs">
              <Title order={3}>{t("Settings.Title")}</Title>
              <Box style={{ flex: 1 }}>{searchBox}</Box>
            </Group>
            {searchResults ?? renderCategoryList()}
          </>
        )}
      </Stack>
    );
  }

  return (
    <Stack h="100%" gap={0}>
      <Group px="md" pt="md" pb="sm">
        {searchBox}
      </Group>
      {searchResults ?? (
        <Tabs
          defaultValue="board"
          orientation="vertical"
          flex={1}
          style={{ overflow: "hidden" }}
          styles={{
            tabLabel: {
              textAlign: "left",
            },
          }}
        >
          <Tabs.List h="100%">
            <Tabs.Tab value="board" leftSection={<IconChess size="1rem" />}>
              {t("Settings.Board")}
            </Tabs.Tab>
            <Tabs.Tab value="inputs" leftSection={<IconMouse size="1rem" />}>
              {t("Settings.Inputs")}
            </Tabs.Tab>
            {isMobilePlatform && (
              <Tabs.Tab value="mobile" leftSection={<IconDeviceMobile size="1rem" />}>
                {t("Settings.Mobile")}
              </Tabs.Tab>
            )}
            <Tabs.Tab value="anarchy" leftSection={<IconFlag size="1rem" />}>
              {t("Settings.Anarchy")}
            </Tabs.Tab>
            <Tabs.Tab value="appearance" leftSection={<IconBrush size="1rem" />}>
              {t("Settings.Appearance")}
            </Tabs.Tab>
            <Tabs.Tab value="sound" leftSection={<IconVolume size="1rem" />}>
              {t("Settings.Sound")}
            </Tabs.Tab>
            {!isAndroid() && (
              <Tabs.Tab value="keybinds" leftSection={<IconKeyboard size="1rem" />}>
                {t("Settings.Keybinds")}
              </Tabs.Tab>
            )}
            {!isAndroid() && (
              <Tabs.Tab value="directories" leftSection={<IconFolder size="1rem" />}>
                {t("Settings.Directories")}
              </Tabs.Tab>
            )}
            <Tabs.Tab value="repertoire" leftSection={<IconBook size="1rem" />}>
              {t("Settings.Repertoire")}
            </Tabs.Tab>
            <Tabs.Tab value="privacy" leftSection={<IconShield size="1rem" />}>
              {t("Settings.Privacy")}
            </Tabs.Tab>
          </Tabs.List>
          <Stack flex={1} px="md">
            <ScrollArea>
              <Card withBorder p="lg" className={classes.card} w="100%">
                <Tabs.Panel value="board">
                  <Text size="lg" fw={500} className={classes.title}>
                    {t("Settings.Board")}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3} mb="lg">
                    {t("Settings.Board.Desc")}
                  </Text>
                  {renderCategorySettings("board")}
                </Tabs.Panel>

                <Tabs.Panel value="inputs">
                  <Text size="lg" fw={500} className={classes.title}>
                    {t("Settings.Inputs")}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3} mb="lg">
                    {t("Settings.Inputs.Desc")}
                  </Text>
                  {renderCategorySettings("inputs")}
                </Tabs.Panel>

                {isMobilePlatform && (
                  <Tabs.Panel value="mobile">
                    <Text size="lg" fw={500} className={classes.title}>
                      {t("Settings.Mobile")}
                    </Text>
                    <Text size="xs" c="dimmed" mt={3} mb="lg">
                      {t("Settings.Mobile.Desc")}
                    </Text>
                    {renderCategorySettings("mobile")}
                  </Tabs.Panel>
                )}

                <Tabs.Panel value="anarchy">
                  <Text size="lg" fw={500} className={classes.title}>
                    {t("Settings.Anarchy")}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3} mb="lg">
                    {t("Settings.Anarchy.Desc")}
                  </Text>
                  {renderCategorySettings("anarchy")}
                </Tabs.Panel>

                <Tabs.Panel value="appearance">
                  <Text size="lg" fw={500} className={classes.title}>
                    {t("Settings.Appearance")}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3} mb="lg">
                    {t("Settings.Appearance.Desc")}
                  </Text>
                  {renderCategorySettings("appearance")}
                </Tabs.Panel>

                <Tabs.Panel value="sound">
                  <Text size="lg" fw={500} className={classes.title}>
                    {t("Settings.Sound")}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3} mb="lg">
                    {t("Settings.Sound.Desc")}
                  </Text>
                  {renderCategorySettings("sound")}
                </Tabs.Panel>

                {!isAndroid() && keybindsPanel}

                {!isAndroid() && (
                  <Tabs.Panel value="directories">
                    <Text size="lg" fw={500} className={classes.title}>
                      {t("Settings.Directories")}
                    </Text>
                    <Text size="xs" c="dimmed" mt={3} mb="lg">
                      {t("Settings.Directories.Desc")}
                    </Text>
                    {renderCategorySettings("directories")}
                  </Tabs.Panel>
                )}

                <Tabs.Panel value="repertoire">
                  <Text size="lg" fw={500} className={classes.title}>
                    {t("Settings.Repertoire")}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3} mb="lg">
                    {t("Settings.Repertoire.Desc")}
                  </Text>
                  {renderCategorySettings("repertoire")}
                </Tabs.Panel>

                <Tabs.Panel value="privacy">
                  <Text size="lg" fw={500} className={classes.title}>
                    {t("Settings.Privacy")}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3} mb="lg">
                    {t("Settings.Privacy.Desc")}
                  </Text>
                  {renderCategorySettings("privacy")}
                </Tabs.Panel>
              </Card>
            </ScrollArea>
            <Text size="xs" c="dimmed" ta="right">
              En Croissant v{version}
            </Text>
          </Stack>
        </Tabs>
      )}
    </Stack>
  );
}
