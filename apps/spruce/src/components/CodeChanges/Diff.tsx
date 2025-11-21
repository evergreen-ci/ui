import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";
import { getDiffLineType, getLineStyle } from "./utils";

export const Diff: React.FC<{ diff: string }> = ({ diff }) => {
  const lines = diff.split("\n");
  return (
    <DiffContainer>
      <Pre>
        <code>
          {lines.map((line, i) => {
            const lineType = getDiffLineType(line);
            const style = getLineStyle(lineType);

            return (
              // eslint-disable-next-line react/no-array-index-key
              <span key={i} style={style}>
                {line}
                <br />
              </span>
            );
          })}
        </code>
      </Pre>
    </DiffContainer>
  );
};

const DiffContainer = styled.div`
  padding: ${size.s};
  width: 100%;
`;

const Pre = styled.pre`
  max-width: 100%;
  overflow-x: scroll;
`;
