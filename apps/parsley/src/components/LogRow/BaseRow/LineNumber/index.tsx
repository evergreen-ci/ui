import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";

const LineNumber: React.FC<{ lineNumber: number }> = ({ lineNumber }) => {
  const { handleSelectLine } = useMultiLineSelectContext();
  const handleClick = (e: React.MouseEvent) => {
    handleSelectLine(lineNumber, e.shiftKey);
  };
  return (
    <Index
      data-cy={`line-index-${lineNumber}`}
      lineNumber={lineNumber}
      onClick={handleClick}
      title="Use shift+click to select multiple lines"
    />
  );
};
const Index = styled.pre<{ lineNumber: number }>`
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
    ${({ lineNumber }) => `content: "${lineNumber}";`}
  }
`;

export default LineNumber;
