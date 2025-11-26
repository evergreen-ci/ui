import styled from "@emotion/styled";
import { Toggle, Size as ToggleSize, ToggleProps } from "@leafygreen-ui/toggle";
import { Label, Description } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants/tokens";

interface Props {
  checked: boolean;
  description?: string;
  disabled?: boolean;
  id: string;
  label: string;
  onChange: ToggleProps["onChange"];
}

export const ToggleWithLabel: React.FC<Props> = ({
  checked,
  description,
  disabled,
  id,
  label,
  onChange,
}) => (
  <ToggleContainer>
    <Toggle
      aria-labelledby={`${id}-label`}
      checked={checked}
      disabled={disabled}
      id={id}
      onChange={onChange}
      size={ToggleSize.Small}
    />
    <div>
      <Label htmlFor={id} id={`${id}-label`}>
        {label}
      </Label>
      <Description>{description}</Description>
    </div>
  </ToggleContainer>
);

const ToggleContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${size.xs};

  :not(:last-of-type) {
    margin-bottom: ${size.s};
  }
`;
