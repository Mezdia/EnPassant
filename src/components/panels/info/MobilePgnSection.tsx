import {
  Button,
  Checkbox,
  Collapse,
  CopyButton,
  Group,
  Stack,
  Text,
  Textarea,
  UnstyledButton,
} from "@mantine/core";
import { IconCheck, IconChevronDown, IconCopy } from "@tabler/icons-react";
import deepEqual from "fast-deep-equal";
import { useAtom } from "jotai";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "zustand";
import { TreeStateContext } from "@/components/common/TreeStateContext";
import { currentPgnOptionsAtom } from "@/state/atoms";
import { getPGN, parsePGN } from "@/utils/chess";

/**
 * Phone version of panels/info/PgnInput.tsx. The desktop panel keeps the
 * options row, the auto-growing textarea and its floating Copy/Update icons
 * all visible; on a portrait phone the auto-grown textarea turns the tab into
 * one giant monolith, so the editor lives behind a collapsed section, the
 * actions become full-width buttons under the textarea, and the checkboxes
 * keep their upstream state (the same `currentPgnOptionsAtom`).
 *
 * PGN generation and update logic mirror PgnInput — that file stays the
 * source of truth; the fork owns only the collapsed presentation.
 */

export default function MobilePgnSection() {
  const store = useContext(TreeStateContext)!;
  const root = useStore(store, (s) => s.root);
  const headers = useStore(store, (s) => s.headers);
  const setState = useStore(store, (s) => s.setState);
  const [options, setOptions] = useAtom(currentPgnOptionsAtom);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const realPGN = useMemo(
    () =>
      getPGN(root, {
        headers: headers,
        glyphs: true,
        comments: true,
        variations: true,
        extraMarkups: true,
      }),
    [root, headers],
  );

  const pgn = useMemo(
    () =>
      getPGN(root, {
        headers: headers,
        glyphs: options.glyphs,
        comments: options.comments,
        variations: options.variations,
        extraMarkups: options.extraMarkups,
      }),
    [root, headers, options],
  );

  const [tmp, setTmp] = useState(pgn);

  useEffect(() => {
    setTmp(pgn);
  }, [pgn]);

  async function updatePgn() {
    const tree = await parsePGN(tmp);
    tree.dirty = true;
    tree.position = [];

    if (deepEqual(tree.root, root) && deepEqual(tree.headers, headers)) {
      setTmp(pgn);
    } else {
      setState(tree);
    }
  }

  return (
    <Stack gap={0}>
      <UnstyledButton w="100%" onClick={() => setOpen(!open)} aria-expanded={open}>
        <Group justify="space-between" py="xs">
          <Text fw="bold" size="sm">
            PGN
          </Text>
          <IconChevronDown
            size="1rem"
            style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }}
          />
        </Group>
      </UnstyledButton>
      <Collapse in={open}>
        <Stack gap="sm" pb="sm">
          <Group gap="sm" wrap="wrap">
            <Checkbox
              label={t("PgnInput.Comments")}
              size="xs"
              checked={options.comments}
              onChange={() => setOptions({ ...options, comments: !options.comments })}
            />
            <Checkbox
              label={t("PgnInput.Glyphs")}
              size="xs"
              checked={options.glyphs}
              onChange={() => setOptions({ ...options, glyphs: !options.glyphs })}
            />
            <Checkbox
              label={t("PgnInput.Variations")}
              size="xs"
              checked={options.variations}
              onChange={() => setOptions({ ...options, variations: !options.variations })}
            />
            <Checkbox
              label={t("PgnInput.ExtraMarkups")}
              size="xs"
              checked={options.extraMarkups}
              onChange={() => setOptions({ ...options, extraMarkups: !options.extraMarkups })}
            />
          </Group>
          <Textarea
            autosize
            minRows={6}
            maxRows={16}
            value={tmp}
            onChange={(e) => setTmp(e.currentTarget.value)}
          />
          <CopyButton value={tmp} timeout={2000}>
            {({ copied, copy }) => (
              <Button
                fullWidth
                variant={copied ? "light" : "default"}
                leftSection={copied ? <IconCheck size="1rem" /> : <IconCopy size="1rem" />}
                onClick={copy}
              >
                {copied ? t("Board.Mobile.PgnCopied") : t("Board.Mobile.CopyPgn")}
              </Button>
            )}
          </CopyButton>
          {realPGN !== tmp && (
            <Button fullWidth onClick={() => updatePgn()}>
              Update
            </Button>
          )}
        </Stack>
      </Collapse>
    </Stack>
  );
}
