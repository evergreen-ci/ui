import { ConfirmationModal } from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import {
  unstable_BlockerFunction as BlockerFunction,
  unstable_useBlocker as useBlocker,
} from "react-router-dom";

export type NavigationWarningModalProps = {
  shouldBlock: boolean | BlockerFunction;
};

export const NavigationWarningModal: React.FC<NavigationWarningModalProps> = ({
  shouldBlock,
}) => {
  const blocker = useBlocker(shouldBlock);

  return blocker.state === "blocked" ? (
    <ConfirmationModal
      cancelButtonProps={{
        onClick: () => blocker.reset?.(),
      }}
      confirmButtonProps={{
        children: "Leave",
        onClick: () => blocker.proceed?.(),
      }}
      data-cy="navigation-warning-modal"
      open
      title="Are you sure you want to leave?"
      variant="danger"
    >
      <Body>
        You have an uploaded log open. If you navigate away, you will need to
        upload it again to view it.
      </Body>
    </ConfirmationModal>
  ) : null;
};
