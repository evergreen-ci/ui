import { Content, Dialog, DialogRoot, Header, Text } from "@via-ds/components";
import pluralize from "pluralize";
import { Version } from "../types";
import { VersionLabel, VersionLabelView } from "../VersionLabel";
import styles from "./InactiveVersionsModal.module.css";
import { ModuleCommitsAccordion } from "./ModuleCommitsAccordion";
import { groupModules } from "./utils";

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

  const groupedVersions = groupModules(versions ?? []);
  const highlightedId =
    highlightedIndex === undefined ? undefined : versions[highlightedIndex]?.id;

  return (
    <DialogRoot isOpen={open} onOpenChange={setOpen}>
      <Dialog className={styles.dialog} data-testid="inactive-versions-modal">
        <Header>
          <Text slot="title">
            {`${versions?.length} ${hasUnmatchingVersions ? "Unmatching" : "Inactive"} ${pluralize("Version", versions?.length)}`}
          </Text>
        </Header>
        <Content className={styles.content} isScrollable>
          {groupedVersions.map((group) =>
            group.isModule ? (
              <ModuleCommitsAccordion
                key={group.versions[0].id}
                group={group}
                highlightedId={highlightedId}
                shouldDisableText={hasUnmatchingVersions}
              />
            ) : (
              <VersionLabel
                key={group.versions[0].id}
                className={styles.versionLabel}
                highlighted={highlightedId === group.versions[0].id}
                isFirstVersion={false}
                shouldDisableText={hasUnmatchingVersions}
                view={VersionLabelView.Modal}
                {...group.versions[0]}
              />
            ),
          )}
        </Content>
      </Dialog>
    </DialogRoot>
  );
};
