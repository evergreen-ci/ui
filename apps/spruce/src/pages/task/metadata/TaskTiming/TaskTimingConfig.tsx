import { Dispatch, SetStateAction } from "react";
import Button, { Size } from "@leafygreen-ui/button";
import { Checkbox } from "@leafygreen-ui/checkbox";
import { Menu, FocusableMenuItem } from "@leafygreen-ui/menu";
import { TaskTimingConfig } from "./state";

interface Props {
  configState: TaskTimingConfig;
  setConfigState: Dispatch<SetStateAction<TaskTimingConfig>>;
}

export const TaskTimingConfigMenu: React.FC<Props> = ({
  configState,
  setConfigState,
}) => {
  const handleCheckboxChange =
    (field: keyof TaskTimingConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setConfigState((c: TaskTimingConfig) => ({
        ...c,
        [field]: e.target.checked,
      }));
    };

  return (
    <Menu
      justify="start"
      renderDarkMenu={false}
      trigger={<Button size={Size.XSmall}>Config</Button>}
    >
      <FocusableMenuItem>
        <Checkbox
          checked={configState.onlySuccessful}
          label="Only include successful runs"
          onChange={handleCheckboxChange("onlySuccessful")}
        />
      </FocusableMenuItem>
      <FocusableMenuItem>
        <Checkbox
          checked={configState.onlyCommits}
          label="Only include waterfall commits"
          onChange={handleCheckboxChange("onlyCommits")}
        />
      </FocusableMenuItem>
    </Menu>
  );
};
