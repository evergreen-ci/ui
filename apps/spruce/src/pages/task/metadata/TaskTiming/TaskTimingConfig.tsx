import Button, { Size } from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Menu, MenuItem, FocusableMenuItem } from "@leafygreen-ui/menu";

export const TaskTimingConfig: React.FC = () => (
  <Menu
    renderDarkMenu={false}
    trigger={<Button size={Size.XSmall}>Config</Button>}
  >
    <MenuItem>Hi</MenuItem>
    <FocusableMenuItem>
      <Checkbox label="Hello checkbox" />
    </FocusableMenuItem>
  </Menu>
);
