import { useState } from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { WaterfallVersionFragment } from "gql/generated/types";
import { InactiveVersionsModal } from "./InactiveVersionsModal";

const { gray } = palette;

interface Props {
  versions: WaterfallVersionFragment[];
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
      <InactiveVersionsModal
        open={modalOpen}
        setOpen={setModalOpen}
        versions={versions}
      />
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
        {versions?.length}
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

const StyledBadge = styled(Badge)`
  margin-bottom: ${size.xs};
`;
