import { useState } from "react";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import Dropdown from "components/Dropdown";
import { TreeSelect, TreeSelectProps } from "components/TreeSelect";

export default {
  component: TreeSelect,
} satisfies CustomMeta<typeof TreeSelect>;

export const Default: CustomStoryObj<typeof TreeSelect> = {
  render: (args) => <BaseTreeSelect {...args} />,
};

export const WithDropdown: CustomStoryObj<typeof TreeSelect> = {
  render: (args) => (
    <Dropdown buttonText="Select">
      <BaseTreeSelect isDropdown {...args} />
    </Dropdown>
  ),
};

const BaseTreeSelect = (props: TreeSelectProps) => {
  const [value, setValue] = useState([]);
  return (
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    <TreeSelect onChange={setValue} state={value} tData={treeData} {...props} />
  );
};

const treeData = [
  {
    title: "All",
    value: "all",
    key: "all",
  },
  {
    title: "Shapes",
    value: "shapes",
    key: "shapes",
    children: [
      {
        title: "rectangle",
        value: "rectangle",
        key: "rectangle",
      },
      {
        title: "circle",
        value: "circle",
        key: "circle",
      },
      {
        title: "rhombus",
        value: "rhombus",
        key: "rhombus",
      },
    ],
  },
  {
    title: "Pass",
    value: "pass",
    key: "pass",
  },
  {
    title:
      "REALLY LONG TITLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE!!!!!!!!!!!!!!!!!",
    value: "failed",
    key: "failed",
  },
  {
    title: "Skip",
    value: "skip",
    key: "skip",
  },
  {
    title: "Silent Fail",
    value: "silentfail",
    key: "silentfail",
  },
];
