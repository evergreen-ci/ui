import { styled } from "@linaria/react";
import { size } from "@evg-ui/lib/constants/tokens";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";

const LineNumber: React.FC<{ lineNumber: number }> = ({ lineNumber }) => {
  const { handleSelectLine } = useMultiLineSelectContext();
  const handleClick = (e: React.MouseEvent) => {
    handleSelectLine(lineNumber, e.shiftKey);
  };
  return (
    <Index
      data-line-number={lineNumber}
      data-testid={`line-index-${lineNumber}`}
      onClick={handleClick}
      title="Use shift+click to select multiple lines"
    />
  );
};
// The line number is rendered via `content: attr(data-line-number)` rather than a
// dynamic style interpolation so that no per-row style computation or class
// generation happens at runtime in this virtualized, potentially-thousands-of-rows list.
const Index = styled.pre`
  width: ${size.xl};
  margin-top: 0;
  margin-bottom: 0;
  margin-left: ${size.xs};
  margin-right: ${size.s};
  flex-shrink: 0;

  font-family: inherit;
  line-height: inherit;
  font-size: inherit;
  user-select: none;

  :hover {
    opacity: 0.5;
    cursor: pointer;
  }
  ::before {
    content: attr(data-line-number);
  }
`;

export default LineNumber;
