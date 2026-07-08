import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import EventDiffTable from "components/Settings/EventLog/EventDiffTable";
import { getEventDiffLines } from "components/Settings/EventLog/EventDiffTable/utils";
import { CustomKeyValueRenderConfig } from "components/Settings/EventLog/EventDiffTable/utils/keyRenderer";
import { ProjectSettingsInput, RepoSettingsInput } from "gql/generated/types";

interface Props {
  after: ProjectSettingsInput | RepoSettingsInput | null;
  before: ProjectSettingsInput | RepoSettingsInput | null;
  customKeyValueRenderConfig?: CustomKeyValueRenderConfig;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  tabTitle: string;
}

export const SaveChangesModal: React.FC<Props> = ({
  after,
  before,
  customKeyValueRenderConfig,
  onCancel,
  onConfirm,
  open,
  tabTitle,
}) => {
  const hasDiff = getEventDiffLines(before, after).length > 0;

  return (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: onCancel,
      }}
      confirmButtonProps={{
        children: "Save changes",
        onClick: onConfirm,
      }}
      data-cy="save-changes-modal"
      open={open}
      title={`Review changes to ${tabTitle}`}
    >
      <Body>
        Review the changes below before saving. Each row shows the property that
        changed along with its previous and new values.
      </Body>
      {hasDiff ? (
        <EventDiffTable
          after={after}
          before={before}
          customKeyValueRenderConfig={customKeyValueRenderConfig}
        />
      ) : (
        <Body>No changes detected.</Body>
      )}
    </ConfirmationModal>
  );
};
