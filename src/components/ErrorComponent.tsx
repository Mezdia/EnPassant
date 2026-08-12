import { Anchor, Button, Code, CopyButton, Group, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { Trans, useTranslation } from "react-i18next";
import { APP_DISCORD_URL, APP_ISSUES_URL } from "@/utils/branding";

export default function ErrorComponent({ error }: { error: unknown }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack p="md">
      <Title>{t("Error.Title")}</Title>
      {error instanceof Error ? (
        <>
          <Text>
            <b>{error.name}:</b> {error.message}
          </Text>
          <Code>{error.stack}</Code>
          {error.cause}
        </>
      ) : (
        <Text>
          <b>{t("Error.Unexpected")}:</b> {JSON.stringify(error)}
        </Text>
      )}
      <Group>
        {error instanceof Error && (
          <CopyButton value={`${error.message}\n${error.stack}`}>
            {({ copied, copy }) => (
              <Button color={copied ? "teal" : undefined} onClick={copy}>
                {copied ? t("Common.Copied") : t("Error.CopyStackTrace")}
              </Button>
            )}
          </CopyButton>
        )}
        <Button onClick={() => navigate({ to: "/" }).then(() => window.location.reload())}>
          {t("Menu.View.Reload")}
        </Button>
      </Group>

      <Text>
        <Trans
          i18nKey="Error.ReportIssue"
          components={{
            github: <Anchor href={APP_ISSUES_URL} target="_blank" />,
            discord: <Anchor href={APP_DISCORD_URL} target="_blank" />,
          }}
        />
      </Text>
    </Stack>
  );
}
