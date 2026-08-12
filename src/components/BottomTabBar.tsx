"use no memo";
import { Text } from "@mantine/core";
import {
  IconChess,
  IconCpu,
  IconDatabase,
  IconFiles,
  type Icon as TablerIcon,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { Link, useMatchRoute } from "@tanstack/react-router";
import cx from "clsx";
import { useTranslation } from "react-i18next";
import classes from "./BottomTabBar.module.css";

interface TabLinkProps {
  icon: TablerIcon;
  label: string;
  url: string;
}

function TabLink({ url, icon: Icon, label }: TabLinkProps) {
  const match = useMatchRoute();
  // "/" is a prefix of every route, so it must match exactly or the Board tab
  // would light up on every screen.
  const active = match({ to: url, fuzzy: url !== "/" }) !== false;
  return (
    <Link
      to={url}
      className={cx(classes.tab, { [classes.active]: active })}
      aria-current={active ? "page" : undefined}
    >
      <Icon size="1.4rem" stroke={1.5} />
      <Text className={classes.label} size="0.625rem">
        {label}
      </Text>
    </Link>
  );
}

const tabsData: { icon: TablerIcon; label: string; url: string }[] = [
  { icon: IconChess, label: "Board", url: "/" },
  { icon: IconUser, label: "User", url: "/accounts" },
  { icon: IconFiles, label: "Files", url: "/files" },
  { icon: IconDatabase, label: "Databases", url: "/databases" },
  { icon: IconCpu, label: "Engines", url: "/engines" },
  { icon: IconSettings, label: "Settings", url: "/settings" },
];

export function BottomTabBar() {
  const { t } = useTranslation();

  return (
    <nav className={classes.bar}>
      {tabsData.map((tab) => (
        <TabLink {...tab} label={t(`SideBar.${tab.label}`)} key={tab.label} />
      ))}
    </nav>
  );
}
