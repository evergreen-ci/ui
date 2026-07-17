import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { NodeList } from "pages/preferences/preferencesTabs/cliTab/NodeList";
import { Node } from "pages/preferences/preferencesTabs/cliTab/nodeList/Node";

export default {
  component: NodeList,
  title: "Pages/Preferences/Node List",
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
  <div style={{ backgroundColor: "red", height: 300, width: 500 }}>Test</div>
);

const list = [
  {
    child: <Child />,
    title: "Download the Command-Line Client.",
  },
  {
    child: <Child />,
    title:
      "Move the command-line client to somewhere in your PATH. On many systems this will be /usr/local/bin.",
  },
];

export const NodeListFull: CustomStoryObj<typeof NodeList> = {
  render: () => (
    <div style={{ position: "relative" }}>
      <NodeList list={list} />
    </div>
  ),
};
