import styled from "@emotion/styled";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants";
import { DisplayModal } from "components/DisplayModal";
import { Version } from "../types";
import { VersionLabel, VersionLabelView } from "../VersionLabel";

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
    <StyledDisplayModal
      data-cy="inactive-versions-modal"
      open={open}
      setOpen={setOpen}
      title={`${versions?.length} ${hasUnmatchingVersions ? "Unmatching" : "Inactive"} ${pluralize("Version", versions?.length)}`}
    >
      {versions?.map((version, i) => (
        <StyledVersionLabel
          key={version.id}
          highlighted={highlightedIndex === i}
          isFirstVersion={false}
          shouldDisableText={hasUnmatchingVersions}
          view={VersionLabelView.Modal}
          {...version}
        />
      ))}
    </StyledDisplayModal>
  );
};

const StyledDisplayModal = styled(DisplayModal)`
  text-align: left;
`;

const StyledVersionLabel = styled(VersionLabel)`
  padding-top: ${size.xs};
`;
