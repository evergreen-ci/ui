import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import EventDiffTable from "components/Settings/EventLog/EventDiffTable";
import { getEventDiffLines } from "components/Settings/EventLog/EventDiffTable/utils";
import { JSONObject } from "utils/object/types";

interface Props {
  after: JSONObject | null;
  before: JSONObject | null;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
}

export const NotificationsSaveModal: React.FC<Props> = ({
  after,
  before,
  onCancel,
  onConfirm,
  open,
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
      data-cy="notifications-save-modal"
      open={open}
      title="Review notification changes"
    >
      <Body>
        Review the changes below before saving. Each row shows the property that
        changed along with its previous and new values.
      </Body>
      {hasDiff ? (
        <EventDiffTable after={after} before={before} />
      ) : (
        <Body>No changes detected.</Body>
      )}
    </ConfirmationModal>
  );
};
