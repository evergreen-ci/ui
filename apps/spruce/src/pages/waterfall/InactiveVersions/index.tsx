import { useState } from "react";
import { Badge, BadgeVariant, Button } from "@via-ds/components";
import Icon from "@evg-ui/lib/components/Icon";
import { Version } from "../types";
import { InactiveVersionsModal } from "./InactiveVersionsModal";
import styles from "./index.module.css";

interface Props {
  highlightedIndex: number | undefined;
  versions: Version[];
}

export const InactiveVersionsButton: React.FC<Props> = ({
  highlightedIndex,
  versions,
}) => {
  const brokenVersionsCount =
    versions?.reduce(
      (accum, { errors }) => (errors.length ? accum + 1 : accum),
      0,
    ) ?? 0;
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <InactiveVersionsModal
        highlightedIndex={highlightedIndex}
        open={modalOpen}
        setOpen={setModalOpen}
        versions={versions}
      />
      {brokenVersionsCount > 0 && (
        <Badge
          className={styles.badge}
          data-testid="broken-versions-badge"
          variant={BadgeVariant.Error}
        >
          {brokenVersionsCount} broken
        </Badge>
      )}
      <Button
        aria-label="Open inactive versions modal"
        className={styles.button}
        data-highlighted={highlightedIndex !== undefined}
        data-testid="inactive-versions-button"
        onPress={() => {
          setModalOpen(true);
        }}
        size="small"
        variant={highlightedIndex !== undefined ? "primary" : "default"}
      >
        <Icon glyph="List" />
        {versions?.length}
        <div className={styles.inactiveVersionLine} />
      </Button>
    </>
  );
};
