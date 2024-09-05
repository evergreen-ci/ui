import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { TreeDataEntry } from "components/TreeSelect";
import { size } from "constants/tokens";

interface CheckboxesProps {
  data: TreeDataEntry[];
  value: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: string) => void;
}

export const CheckboxGroup: React.FC<CheckboxesProps> = ({
  data,
  onChange = () => undefined,
  value,
}) => (
  <CheckboxesWrapper>
    {data.map(({ key, title, value: checkboxValue }) => (
      <StyledCheckbox
        key={key}
        bold={false}
        checked={value.includes(checkboxValue)}
        className="cy-checkbox"
        data-cy={title}
        label={title}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e, key)}
      />
    ))}
  </CheckboxesWrapper>
);

const CheckboxesWrapper = styled.div`
  padding: ${size.xxs};
`;

/* @ts-expect-error */
const StyledCheckbox = styled(Checkbox)`
  margin-bottom: ${size.xs};

  :last-of-type {
    margin-bottom: 0;
  }
`;
