import { useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Variant } from "@leafygreen-ui/badge";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { Version } from "../types";
import { InactiveVersionsModal } from "./InactiveVersionsModal";

const { blue, gray } = palette;

interface Props {
  containerHeight: number | undefined;
  highlightedIndex: number | undefined;
  versions: Version[];
}

export const InactiveVersionsButton: React.FC<Props> = ({
  containerHeight,
  highlightedIndex,
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
        highlightedIndex={highlightedIndex}
        open={modalOpen}
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
        variant={highlightedIndex !== undefined ? "primary" : "default"}
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
  animation: glow 1s ease-in-out 5 alternate;
  box-shadow: 0 0 10px ${blue.light1};
  @keyframes glow {
    from {
      box-shadow: 0 0 0px ${blue.light1};
    }
    to {
      box-shadow: 0 0 10px ${blue.light1};
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
