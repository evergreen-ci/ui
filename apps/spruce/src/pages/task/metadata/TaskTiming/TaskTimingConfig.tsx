import { Dispatch } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Menu, FocusableMenuItem } from "@leafygreen-ui/menu";
import { Action, TaskTimingConfig } from "./state";

interface Props {
  state: TaskTimingConfig;
  dispatch: Dispatch<Action<TaskTimingConfig>>;
}

export const TaskTimingConfigMenu: React.FC<Props> = ({ dispatch, state }) => {
  const handleCheckboxChange =
    (field: keyof TaskTimingConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "updateField",
        field,
        value: e.target.checked,
      });
    };

  return (
    <Menu
      justify="start"
      renderDarkMenu={false}
      trigger={<Button size={Size.XSmall}>Config</Button>}
    >
      <FocusableMenuItem>
        <Checkbox
          checked={state.onlySuccessful}
          label="Only include successful runs"
          onChange={handleCheckboxChange("onlySuccessful")}
        />
      </FocusableMenuItem>
      <FocusableMenuItem>
        <Checkbox
          checked={state.onlyCommits}
          label="Only include waterfall commits"
          onChange={handleCheckboxChange("onlyCommits")}
        />
      </FocusableMenuItem>
    </Menu>
  );
};
