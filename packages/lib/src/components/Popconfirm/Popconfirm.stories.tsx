import { Button } from "@via-ds/components";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { size } from "../../constants/tokens";
import Popconfirm from ".";

export default {
  component: Popconfirm,
} satisfies CustomMeta<typeof Popconfirm>;

export const Default: CustomStoryObj<typeof Popconfirm> = {
  argTypes: {
    confirmText: {
      control: { type: "text" },
    },
    confirmDisabled: {
      control: { type: "boolean" },
    },
    side: {
      control: { type: "select" },
      options: ["top", "bottom", "left", "right"],
    },
    align: {
      control: { type: "select" },
      options: ["start", "center", "end"],
    },
  },
  args: {
    confirmText: "Confirm",
    confirmDisabled: false,
    side: "top",
    align: "center",
    children: "Are you sure you want to perform this action?",
    trigger: <Button size="small">Click to open popconfirm</Button>,
  },
};

export const ConfirmDisabled: CustomStoryObj<typeof Popconfirm> = {
  args: {
    ...Default.args,
    confirmDisabled: true,
  },
};

export const CustomConfirmText: CustomStoryObj<typeof Popconfirm> = {
  args: {
    ...Default.args,
    confirmText: "Yes, I'm sure",
  },
};

export const DifferentPositions: CustomStoryObj<typeof Popconfirm> = {
  render: () => (
    <div style={positionsContainerStyle}>
      <div style={positionWrapperStyle}>
        <Popconfirm
          align="center"
          side="top"
          trigger={<Button size="small">Top Middle</Button>}
        >
          Confirmation message
        </Popconfirm>
      </div>
      <div style={positionWrapperStyle}>
        <Popconfirm
          align="center"
          side="bottom"
          trigger={<Button size="small">Bottom Middle</Button>}
        >
          Confirmation message
        </Popconfirm>
      </div>
      <div style={positionWrapperStyle}>
        <Popconfirm
          align="center"
          side="left"
          trigger={<Button size="small">Left Middle</Button>}
        >
          Confirmation message
        </Popconfirm>
      </div>
      <div style={positionWrapperStyle}>
        <Popconfirm
          align="center"
          side="right"
          trigger={<Button size="small">Right Middle</Button>}
        >
          Confirmation message
        </Popconfirm>
      </div>
    </div>
  ),
};

const positionsContainerStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: size.l,
};

const positionWrapperStyle = {
  margin: size.m,
};
