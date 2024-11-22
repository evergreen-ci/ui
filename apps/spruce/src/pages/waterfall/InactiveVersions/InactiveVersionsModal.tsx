import styled from "@emotion/styled";
import pluralize from "pluralize";
import { size } from "@evg-ui/lib/constants/tokens";
import { DisplayModal } from "components/DisplayModal";
import { WaterfallVersionFragment } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "../types";
import { VersionLabel, VersionLabelView } from "../VersionLabel";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  versions: WaterfallVersionFragment[];
};

export const InactiveVersionsModal: React.FC<Props> = ({
  open,
  setOpen,
  versions,
}) => {
  const hasUnmatchingVersions =
    versions?.some(({ activated }) => activated) ?? false;
  const [revision] = useQueryParam<string | null>(
    WaterfallFilterOptions.Revision,
    null,
  );
  return (
    <DisplayModal
      data-cy="inactive-versions-modal"
      open={open}
      setOpen={setOpen}
      title={`${versions?.length} ${hasUnmatchingVersions ? "Unmatching" : "Inactive"} ${pluralize("Version", versions?.length)}`}
    >
      {versions?.map((version) => (
        <StyledVersionLabel
          key={version.id}
          highlighted={revision !== null && version.revision.includes(revision)}
          shouldDisableText={hasUnmatchingVersions}
          view={VersionLabelView.Modal}
          {...version}
        />
      ))}
    </DisplayModal>
  );
};

const StyledVersionLabel = styled(VersionLabel)`
  padding-top: ${size.xs};
`;
