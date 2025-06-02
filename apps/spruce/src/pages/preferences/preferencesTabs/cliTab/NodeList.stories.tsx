import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { NodeList } from "pages/preferences/preferencesTabs/cliTab/NodeList";
import { Node } from "pages/preferences/preferencesTabs/cliTab/nodeList/Node";

export default {
  title: "Pages/Preferences/Node List",
  component: NodeList,
} satisfies CustomMeta<typeof NodeList>;

export const NodeElement: CustomStoryObj<typeof Node> = {
  render: () => (
    <Node
      child={<Child />}
      stepNumber={1}
      title="Download the Command-Line Client."
    />
  ),
};

const Child = () => (
  <div style={{ width: 500, height: 300, backgroundColor: "red" }}>Test</div>
);

const list = [
  {
    title: "Download the Command-Line Client.",
    child: <Child />,
  },
  {
    title:
      "Move the command-line client to somewhere in your PATH. On many systems this will be /usr/local/bin.",
    child: <Child />,
  },
];

export const NodeListFull: CustomStoryObj<typeof NodeList> = {
  render: () => (
    <div style={{ position: "relative" }}>
      <NodeList list={list} />
    </div>
  ),
};
