import { Body } from "@leafygreen-ui/typography";
import { BlockerFunction, useBlocker } from "react-router-dom";
import { ConfirmationModal } from "components/ConfirmationModal";

export type NavigationModalProps = {
  shouldBlock: boolean | BlockerFunction;
  unsavedTabs: Array<{
    title: string;
    value: string;
  }>;
};

// @ts-expect-error: FIXME. This comment was added by an automated script.
export const NavigationWarningModal: React.FC<NavigationModalProps> = ({
  shouldBlock,
  unsavedTabs,
}) => {
  const blocker = useBlocker(shouldBlock);

  return (
    blocker.state === "blocked" && (
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
        title="You have unsaved changes that will be discarded. Are you sure you want to leave?"
        variant="danger"
      >
        <Body>Unsaved changes are present on the following pages:</Body>
        <ol data-cy="unsaved-pages">
          {unsavedTabs.map(({ title, value }) => (
            <li key={value}>{title}</li>
          ))}
        </ol>
      </ConfirmationModal>
    )
  );
};
