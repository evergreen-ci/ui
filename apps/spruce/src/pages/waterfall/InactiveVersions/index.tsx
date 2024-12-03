import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Badge, { Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants/tokens";
import Icon from "components/Icon";
import { WaterfallVersionFragment } from "gql/generated/types";
import { useQueryParam } from "hooks/useQueryParam";
import { WaterfallFilterOptions } from "../types";
import { InactiveVersionsModal } from "./InactiveVersionsModal";

const { gray, green } = palette;

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
  const [revisionFilter] = useQueryParam<string | null>(
    WaterfallFilterOptions.Revision,
    null,
  );
  const hasMatchingVersion =
    revisionFilter &&
    versions?.some(({ revision }) => revision.includes(revisionFilter ?? ""));

  return (
    <>
      <InactiveVersionsModal
        open={modalOpen}
        revisionFilter={revisionFilter}
        setOpen={setModalOpen}
        versions={versions}
      />
      {brokenVersionsCount > 0 && (
        <StyledBadge data-cy="broken-versions-badge" variant={Variant.Red}>
          {brokenVersionsCount} broken
        </StyledBadge>
      )}
      <StyledButton
        aria-label="Open inactive versions modal"
        data-cy="inactive-versions-button"
        leftGlyph={<Icon fill={gray.base} glyph="List" />}
        onClick={() => {
          setModalOpen(true);
        }}
        size="xsmall"
        variant={hasMatchingVersion ? "primary" : "default"}
      >
        {versions?.length}
        <InactiveVersionLine containerHeight={containerHeight ?? 0} />
      </StyledButton>
    </>
  );
};

const StyledButton = styled(Button)`
  ${({ variant }) => variant === "primary" && glowButtonStyle}
`;

const glowButtonStyle = css`
  animation: glow 1s ease-in-out infinite alternate;
  @keyframes glow {
    from {
      box-shadow: 0 0 0px ${green.base};
    }
    to {
      box-shadow: 0 0 20px ${green.base};
    }
  }
`;

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
