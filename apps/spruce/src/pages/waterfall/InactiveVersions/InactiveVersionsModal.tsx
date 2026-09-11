import { Content, Dialog, DialogRoot, Header, Text } from "@via-ds/components";
import pluralize from "pluralize";
import { Version } from "../types";
import { VersionLabel, VersionLabelView } from "../VersionLabel";
import styles from "./InactiveVersionsModal.module.css";

type Props = {
  highlightedIndex: number | undefined;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  versions: Version[];
};

export const InactiveVersionsModal: React.FC<Props> = ({
  highlightedIndex,
  open,
  setOpen,
  versions,
}) => {
  const hasUnmatchingVersions =
    versions?.some(({ activated }) => activated) ?? false;

  return (
    <DialogRoot isOpen={open} onOpenChange={setOpen}>
      <Dialog className={styles.dialog} data-testid="inactive-versions-modal">
        <Header>
          <Text slot="title">
            {`${versions?.length} ${hasUnmatchingVersions ? "Unmatching" : "Inactive"} ${pluralize("Version", versions?.length)}`}
          </Text>
        </Header>
        <Content className={styles.content}>
          {versions?.map((version, i) => (
            <VersionLabel
              key={version.id}
              className={styles.versionLabel}
              highlighted={highlightedIndex === i}
              isFirstVersion={false}
              shouldDisableText={hasUnmatchingVersions}
              view={VersionLabelView.Modal}
              {...version}
            />
          ))}
        </Content>
      </Dialog>
    </DialogRoot>
  );
};
