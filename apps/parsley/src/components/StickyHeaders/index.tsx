import { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "@evg-ui/lib/constants";
import SectionHeader from "components/LogRow/SectionHeader";
import SubsectionHeader from "components/LogRow/SubsectionHeader";
import { useLogContext } from "context/LogContext";
import { StickyHeaders as StickyHeadersType } from "hooks/useStickyHeaders";
import { isSectionHeaderRow, isSubsectionHeaderRow } from "utils/logRowTypes";

interface StickyHeaderProps {
  onHeightChange: (height: number) => void;
  stickyHeaders: StickyHeadersType;
}

const StickyHeaders: React.FC<StickyHeaderProps> = ({
  onHeightChange,
  stickyHeaders,
}) => {
  const { failingLine, processedLogLines } = useLogContext();

  const { sectionHeader, subsectionHeader } = stickyHeaders;
  const containerRef = useRef<HTMLDivElement>(null);

  const sectionHeaderLine =
    sectionHeader !== null ? processedLogLines[sectionHeader] : null;
  const subsectionHeaderLine =
    subsectionHeader !== null ? processedLogLines[subsectionHeader] : null;

  // Measure and report the height of sticky headers whenever they change.
  useEffect(() => {
    if (containerRef.current && onHeightChange) {
      const height = containerRef.current.offsetHeight;
      onHeightChange(height);
    }
  }, [sectionHeader, subsectionHeader, onHeightChange]);

  return (
    <StickyHeaderContainer ref={containerRef} data-cy="sticky-headers">
      {isNumber(sectionHeader) &&
        sectionHeaderLine &&
        isSectionHeaderRow(sectionHeaderLine) && (
          <StickySectionWrapper>
            <SectionHeader
              failingLine={failingLine}
              lineIndex={sectionHeader}
              sectionHeaderLine={sectionHeaderLine}
            />
          </StickySectionWrapper>
        )}
      {isNumber(subsectionHeader) &&
        subsectionHeaderLine &&
        isSubsectionHeaderRow(subsectionHeaderLine) && (
          <StickySubsectionWrapper
            hasParentSection={sectionHeaderLine !== null}
          >
            <SubsectionHeader
              failingLine={failingLine}
              lineIndex={subsectionHeader}
              subsectionHeaderLine={subsectionHeaderLine}
            />
          </StickySubsectionWrapper>
        )}
    </StickyHeaderContainer>
  );
};

const isNumber = (index: number | null): index is number =>
  typeof index === "number";

const stickyHeaderZIndex = 1;

const StickyHeaderContainer = styled.div``;

const StickySectionWrapper = styled.div`
  position: sticky;
  top: 0;
  background-color: ${palette.white};
  z-index: ${stickyHeaderZIndex};
`;

const StickySubsectionWrapper = styled.div<{ hasParentSection: boolean }>`
  position: sticky;
  top: ${({ hasParentSection }) => (hasParentSection ? size.l : "0")};
  background-color: ${palette.white};
  z-index: ${stickyHeaderZIndex};
`;

export default StickyHeaders;
