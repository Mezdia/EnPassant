import { ActionIcon, Tooltip } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import { openPath } from "@tauri-apps/plugin-opener";
import { useTranslation } from "react-i18next";
import { getDatabasesDir, getEnginesDir, getPuzzlesDir } from "@/utils/directories";
import { isDesktop } from "@/utils/platform";

function OpenFolderButton({
  base,
  folder,
}: {
  base?: "Database" | "Document" | "Engines" | "Puzzles";
  folder: string;
}) {
  const { t } = useTranslation();

  async function openAppDirData() {
    let dir = folder;
    if (base === "Database") {
      dir = await getDatabasesDir();
    }
    if (base === "Engines") {
      dir = await getEnginesDir();
    }
    if (base === "Puzzles") {
      dir = await getPuzzlesDir();
    }
    await openPath(dir);
  }

  // Android has no file manager that can open an app-private directory, so the
  // button would only ever fail there.
  if (!isDesktop()) return null;

  return (
    <Tooltip label={t("Common.OpenFolder")}>
      <ActionIcon onClick={() => openAppDirData()}>
        <IconFolder size="1.5rem" />
      </ActionIcon>
    </Tooltip>
  );
}

export default OpenFolderButton;
