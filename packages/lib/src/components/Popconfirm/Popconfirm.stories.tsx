import { size } from "../../constants/tokens";
import { CustomMeta, CustomStoryObj } from "../../test_utils/types";
import Popconfirm from ".";

export default {
  component: Popconfirm,
} satisfies CustomMeta<typeof Popconfirm>;

const triggerButtonStyle = {
  padding: `${size.xs} ${size.s}`,
  backgroundColor: "#f5f6f7",
  border: "1px solid #babdbe",
  borderRadius: size.xxs,
  cursor: "pointer",
};

export const Default: CustomStoryObj<typeof Popconfirm> = {
  argTypes: {
    confirmText: {
      control: { type: "text" },
    },
    confirmDisabled: {
      control: { type: "boolean" },
    },
    align: {
      control: { type: "select" },
      options: ["top", "bottom", "left", "right"],
    },
    justify: {
      control: { type: "select" },
      options: ["start", "middle", "end"],
    },
  },
  args: {
    confirmText: "Confirm",
    confirmDisabled: false,
    align: "top",
    justify: "middle",
    children: "Are you sure you want to perform this action?",
    trigger: <button style={triggerButtonStyle}>Click to open popconfirm</button>,
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
          align="top"
          justify="middle"
          trigger={<button style={triggerButtonStyle}>Top Middle</button>}
        >
          Confirmation message
        </Popconfirm>
      </div>
      <div style={positionWrapperStyle}>
        <Popconfirm
          align="bottom"
          justify="middle"
          trigger={<button style={triggerButtonStyle}>Bottom Middle</button>}
        >
          Confirmation message
        </Popconfirm>
      </div>
      <div style={positionWrapperStyle}>
        <Popconfirm
          align="left"
          justify="middle"
          trigger={<button style={triggerButtonStyle}>Left Middle</button>}
        >
          Confirmation message
        </Popconfirm>
      </div>
      <div style={positionWrapperStyle}>
        <Popconfirm
          align="right"
          justify="middle"
          trigger={<button style={triggerButtonStyle}>Right Middle</button>}
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
