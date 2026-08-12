import { Anchor, Group, Modal, Stack, Text } from "@mantine/core";
import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { arch, version as OSVersion, type } from "@tauri-apps/plugin-os";
import { useEffect, useState } from "react";
import {
  APP_AUTHOR,
  APP_AUTHOR_URL,
  APP_COPYRIGHT_YEAR,
  APP_NAME,
  APP_REPOSITORY,
  APP_WEBSITE,
} from "@/utils/branding";

/** Strips the scheme so links read as bare domains, matching the desktop About dialog. */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "");
}

function AboutModal({
  opened,
  setOpened,
}: {
  opened: boolean;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [info, setInfo] = useState<{
    version: string;
    tauri: string;
    os: string;
    architecture: string;
    osVersion: string;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const os = await type();
      const version = await getVersion();
      const tauri = await getTauriVersion();
      const architecture = await arch();
      const osVersion = await OSVersion();
      setInfo({ version, tauri, os, architecture, osVersion });
    }
    load();
  }, []);
  return (
    <Modal
      centered
      size="md"
      opened={opened}
      onClose={() => setOpened(false)}
      title={`About ${APP_NAME}`}
    >
      <Stack gap="xs">
        <Group gap="xs">
          <Text fw="bold">Version:</Text>
          <Text>{info?.version}</Text>
        </Group>
        <Group gap="xs">
          <Text fw="bold">Tauri version:</Text>
          <Text>{info?.tauri}</Text>
        </Group>
        <Group gap="xs">
          <Text fw="bold">Operating system:</Text>
          <Text>
            {info?.os} {info?.architecture} {info?.osVersion}
          </Text>
        </Group>

        <Text fw="bold" size="lg" mt="sm">
          Credits
        </Text>
        <Text>Made by {APP_AUTHOR}</Text>
        <Text>All rights belong to {APP_AUTHOR}</Text>

        <Group gap="xs">
          <Text fw="bold">Developer:</Text>
          <Anchor href={APP_AUTHOR_URL} target="_blank" rel="noreferrer">
            {displayUrl(APP_AUTHOR_URL)}
          </Anchor>
        </Group>
        <Group gap="xs">
          <Text fw="bold">Repository:</Text>
          <Anchor href={APP_REPOSITORY} target="_blank" rel="noreferrer">
            {displayUrl(APP_REPOSITORY)}
          </Anchor>
        </Group>
        <Group gap="xs">
          <Text fw="bold">Website:</Text>
          <Anchor href={APP_WEBSITE} target="_blank" rel="noreferrer">
            {displayUrl(APP_WEBSITE)}
          </Anchor>
        </Group>

        <Text size="sm" c="dimmed" mt="sm">
          Copyright © {APP_COPYRIGHT_YEAR} {APP_AUTHOR}. All rights reserved.
        </Text>
      </Stack>
    </Modal>
  );
}

export default AboutModal;
