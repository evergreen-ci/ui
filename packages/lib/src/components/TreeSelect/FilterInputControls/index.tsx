import styled from "@emotion/styled";
import {
  Button,
  Size as ButtonSize,
  Variant as ButtonVariant,
} from "@leafygreen-ui/button";
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
  <ButtonsWrapper>
    <ButtonWrapper>
      <Button onClick={onClickReset} size={ButtonSize.Small}>
        Reset
      </Button>
    </ButtonWrapper>
    <Button
      onClick={onClickSubmit}
      size={ButtonSize.Small}
      variant={ButtonVariant.Primary}
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
