import styled from "@emotion/styled";
import Button, { Size } from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Menu, FocusableMenuItem } from "@leafygreen-ui/menu";

interface Props {
  handleOnlySuccessfulChange: React.ChangeEventHandler<HTMLInputElement>;
  onlySuccessful: boolean;
}

export const TaskTimingConfig: React.FC<Props> = ({
  handleOnlySuccessfulChange,
  onlySuccessful,
}) => (
  <StyledMenu
    justify="start"
    renderDarkMenu={false}
    trigger={<Button size={Size.XSmall}>Config</Button>}
  >
    <FocusableMenuItem>
      <Checkbox
        checked={onlySuccessful}
        label="Only include successful runs"
        onChange={handleOnlySuccessfulChange}
      />
    </FocusableMenuItem>
  </StyledMenu>
);

// Fix incorrect height causing scroll bar in menu item
const StyledMenu = styled(Menu)`
  ul {
    div {
      height: fit-content;
    }
  }
`;
