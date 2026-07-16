import { useState } from "react";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { TreeSelect, TreeSelectProps } from "./TreeSelect";

export default {
  component: TreeSelect,
} satisfies CustomMeta<typeof TreeSelect>;

export const Default: CustomStoryObj<typeof TreeSelect> = {
  render: (args) => <BaseTreeSelect {...args} />,
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
    key: "all",
    title: "All",
    value: "all",
  },
  {
    children: [
      {
        key: "rectangle",
        title: "rectangle",
        value: "rectangle",
      },
      {
        key: "circle",
        title: "circle",
        value: "circle",
      },
      {
        key: "rhombus",
        title: "rhombus",
        value: "rhombus",
      },
    ],
    key: "shapes",
    title: "Shapes",
    value: "shapes",
  },
  {
    key: "pass",
    title: "Pass",
    value: "pass",
  },
  {
    key: "failed",
    title:
      "REALLY LONG TITLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE EXAMPLE!!!!!!!!!!!!!!!!!",
    value: "failed",
  },
  {
    key: "skip",
    title: "Skip",
    value: "skip",
  },
  {
    key: "silentfail",
    title: "Silent Fail",
    value: "silentfail",
  },
];
