import { useState } from "react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { Description } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";
import { useWaterfallAnalytics } from "analytics/waterfall/useWaterfallAnalytics";
import { DropdownItem } from "components/ButtonDropdown";
import { ConfirmationModal } from "components/ConfirmationModal";
import { useQueryParams } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "../types";

interface GitCommitSearchProps {
  setMenuOpen: (open: boolean) => void;
}

export const GitCommitSearch: React.FC<GitCommitSearchProps> = ({
  setMenuOpen,
}) => {
  const { sendEvent } = useWaterfallAnalytics();
  const [, setQueryParams] = useQueryParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [commitHash, setCommitHash] = useState("");

  const onCancel = () => {
    setModalOpen(false);
    setMenuOpen(false);
  };

  const onConfirm = () => {
    sendEvent({ name: "Filtered by git commit" });
    setQueryParams({
      [WaterfallFilterOptions.Revision]: commitHash,
    });
    onCancel();
  };

  return (
    <>
      <DropdownItem
        data-cy="git-commit-search"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Search by git hash
      </DropdownItem>
      <ConfirmationModal
        cancelButtonProps={{
          children: "Cancel",
          onClick: onCancel,
        }}
        confirmButtonProps={{
          children: "Submit",
          onClick: onConfirm,
          disabled: commitHash.trim().length < 7,
        }}
        data-cy="git-commit-search-modal"
        open={modalOpen}
        title="Search by Git Commit Hash"
      >
        <StyledDescription>
          Searching for a git hash will jump to the commit in the waterfall. If
          the commit is not found, the waterfall will be reset.
        </StyledDescription>
        <TextInput
          label="Git Commit Hash"
          onChange={(e) => setCommitHash(e.target.value.trim())}
          onKeyDown={(e) => e.key === "Enter" && onConfirm()}
          value={commitHash}
        />
      </ConfirmationModal>
    </>
  );
};

const StyledDescription = styled(Description)`
  margin-bottom: ${size.xs};
`;
