import { useState } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import pluralize from "pluralize";
import { DisplayModal } from "components/DisplayModal";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { WaterfallQuery } from "gql/generated/types";
import { VersionLabel } from "../VersionLabel";

const { gray } = palette;
interface Props {
  versions: WaterfallQuery["waterfall"]["versions"][0]["inactiveVersions"];
  containerHeight: number | undefined;
}
export const InactiveVersionsButton: React.FC<Props> = ({
  containerHeight,
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
      <DisplayModal
        data-cy="inactive-versions-modal"
        open={modalOpen}
        setOpen={setModalOpen}
        title={`${versions?.length} Inactive ${pluralize("Version", versions?.length)}`}
      >
        {versions?.map((version) => (
          <StyledVersionLabel
            key={version.id}
            trimMessage={false}
            {...version}
          />
        ))}
      </DisplayModal>
      {brokenVersionsCount > 0 && (
        <StyledBadge data-cy="broken-versions-badge" variant={Variant.Red}>
          {brokenVersionsCount} broken
        </StyledBadge>
      )}
      <Button
        aria-label="Open inactive versions modal"
        data-cy="inactive-versions-button"
        onClick={() => {
          setModalOpen(true);
        }}
        size="xsmall"
      >
        <Icon fill={gray.base} glyph="List" />
        <span>{versions?.length}</span>
        <InactiveVersionLine containerHeight={containerHeight ?? 0} />
      </Button>
    </>
  );
};

const InactiveVersionLine = styled.div<{ containerHeight: number }>`
  border-left: 2px dashed ${gray.base};
  height: ${({ containerHeight }) => `${containerHeight}px`};
  position: absolute;
  margin-left: 50%;
  top: 30px;
  z-index: 1;
`;

const StyledVersionLabel = styled(VersionLabel)`
  padding-top: ${size.xs};
`;

const StyledBadge = styled(Badge)`
  margin-bottom: ${size.xs};
`;
