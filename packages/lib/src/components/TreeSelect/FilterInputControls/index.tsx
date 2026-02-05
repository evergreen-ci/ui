import styled from "@emotion/styled";
import { Button } from "@leafygreen-ui/button";
import { size } from "../../../constants/tokens";

interface Props {
  onClickReset: () => void;
  onClickSubmit: () => void;
  submitButtonCopy?: string;
}

export const FilterInputControls: React.FC<Props> = ({
  onClickReset,
  onClickSubmit,
  submitButtonCopy = "Filter",
}) => (
  <ButtonsWrapper data-cy="filter-input-controls">
    <ButtonWrapper>
      <Button data-cy="reset-button" onClick={onClickReset} size="small">
        Reset
      </Button>
    </ButtonWrapper>
    <Button
      data-cy="filter-button"
      onClick={onClickSubmit}
      size="small"
      variant="primary"
    >
      {submitButtonCopy}
    </Button>
  </ButtonsWrapper>
);

const ButtonsWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  margin-top: ${size.l};
`;
const ButtonWrapper = styled.div`
  margin-right: ${size.xs};
`;
