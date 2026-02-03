import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";
import { SpruceFormProps } from "components/SpruceForm/types";

export const CommandRow: SpruceFormProps["ObjectFieldTemplate"] = ({
  properties,
}) => {
  const [command, directory] = properties;

  return (
    <RowContainer data-cy="command-row">
      <LeftColumn>{command.content}</LeftColumn>
      <div>{directory.content}</div>
    </RowContainer>
  );
};

const LeftColumn = styled.div`
  padding-right: ${size.s};
  flex-grow: 1;
`;

const RowContainer = styled.div`
  display: flex;
`;
