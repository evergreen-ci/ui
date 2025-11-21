import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants/tokens";

export const Diff: React.FC<{ diff: string }> = ({ diff }) => {
  const lines = diff.split("\n");
  return (
    <DiffContainer>
      <Pre>
        <code>
          {lines.map((line, i) => {
            let Tag = BaseTag;
            if (line.substring(0, 3) === "+++") {
              Tag = Filestat;
            } else if (line.substring(0, 3) === "---") {
              Tag = Filestat;
            } else if (line[0] === "+") {
              Tag = Addition;
            } else if (line[0] === "-") {
              Tag = Deletion;
            }

            return (
              // eslint-disable-next-line react/no-array-index-key
              <Tag key={i}>
                {line}
                <br />
              </Tag>
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

const BaseTag = styled.span``;

const Filestat = styled(BaseTag)`
  font-weight: bold;
`;

const Addition = styled(BaseTag)`
  background-color: #9fa;
`;

const Deletion = styled(BaseTag)`
  background-color: #faa;
`;
