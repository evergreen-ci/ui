import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Cookie from "js-cookie";
import { actions } from "storybook/actions";
import { useQueryParams } from "@evg-ui/lib/hooks";
import {
  CustomMeta,
  CustomStoryObj,
  MockedProvider,
} from "@evg-ui/lib/test_utils";
import { DRAWER_OPENED } from "constants/cookies";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { projectFiltersMock } from "test_data/projectFilters";
import { evergreenTaskMock } from "test_data/task";
import SidePanel from ".";

export default {
  component: SidePanel,
  decorators: [
    (Story: () => React.JSX.Element) => (
      <MockedProvider mocks={[projectFiltersMock, evergreenTaskMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
} satisfies CustomMeta<typeof SidePanel>;

const Story = ({ ...args }) => {
  const [, setSearchParams] = useQueryParams();
  const { setLogMetadata } = useLogContext();

  useEffect(() => {
    setSearchParams({
      filters: ["100active%20filter"],
      highlights: ["highlight", "highlight2"],
    });
    setLogMetadata({
      execution: "0",
      logType: LogTypes.EVERGREEN_TASK_LOGS,
      taskID:
        "spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const clearExpandedLines = () => actions("clearExpandedLines");
  const collapseLines = () => actions("collapseLines");
  const [collapsed, setCollapsed] = useState<boolean>(
    Cookie.get(DRAWER_OPENED) === "true",
  );
  return (
    <Container>
      <SidePanel
        {...args}
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={[[1, 10]]}
        panelCollapsed={collapsed}
        setPanelCollapsed={setCollapsed}
      />
    </Container>
  );
};
export const Default: CustomStoryObj<typeof SidePanel> = {
  play: async ({ userEvent }) => {
    await userEvent.keyboard("[[");
  },
  render: (args) => <Story {...args} />,
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;
