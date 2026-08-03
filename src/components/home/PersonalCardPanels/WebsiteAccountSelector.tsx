import { Group, Select } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { sessionsAtom } from "@/state/atoms";

/** Sentinel values; only their labels are translated. */
const ALL_WEBSITES = "All websites";
const ALL_ACCOUNTS = "All accounts";

interface WebsiteAccountSelectorProps {
  playerName: string;
  onWebsiteChange: (website: string | null) => void;
  onAccountChange: (account: string | null) => void;
  allowAll: boolean;
}

const WebsiteAccountSelector = ({
  playerName,
  onWebsiteChange,
  onAccountChange,
  allowAll,
}: WebsiteAccountSelectorProps) => {
  const { t } = useTranslation();
  const sessions = useAtomValue(sessionsAtom);

  const websites = [];
  if (sessions.some((s) => s.player === playerName && s.chessCom?.username)) {
    websites.push({ value: "Chess.com", label: "Chess.com" });
  }
  if (sessions.some((s) => s.player === playerName && s.lichess?.username)) {
    websites.push({ value: "Lichess", label: "Lichess" });
  }

  if (allowAll) {
    websites.unshift({ value: ALL_WEBSITES, label: t("Home.Personal.AllWebsites") });
  }

  const [website, setWebsite] = useState<string | null>(websites[0]?.value);
  const [account, setAccount] = useState<string | null>(ALL_ACCOUNTS);

  useEffect(() => {
    onWebsiteChange(website);
  }, [website]);

  useEffect(() => {
    onAccountChange(account);
  }, [account]);

  const usernames = sessions
    .filter(
      (s) =>
        s.player === playerName &&
        ((website === "Chess.com" && s.chessCom?.username) ||
          (website === "Lichess" && s.lichess?.username)),
    )
    .map((s) => s.chessCom?.username || s.lichess?.username)
    .filter((username): username is string => username !== undefined && username !== null);

  const accounts = [
    { value: ALL_ACCOUNTS, label: t("Home.Personal.AllAccounts") },
    ...usernames.map((username) => ({ value: username, label: username })),
  ];

  return (
    <Group grow>
      <Select
        pt="lg"
        label={t("Home.Accounts.Website")}
        value={website}
        onChange={(value) => {
          setWebsite(value);
          setAccount(ALL_ACCOUNTS);
        }}
        data={websites}
        allowDeselect={false}
      />
      {website !== ALL_WEBSITES && usernames.length > 1 && (
        <Select
          pt="lg"
          label={t("Home.Personal.Account")}
          value={account}
          onChange={(value) => setAccount(value)}
          data={accounts}
          allowDeselect={false}
        />
      )}
    </Group>
  );
};

export default WebsiteAccountSelector;
