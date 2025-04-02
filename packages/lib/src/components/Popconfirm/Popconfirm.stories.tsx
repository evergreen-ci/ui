import styled from "@emotion/styled";
import { size } from "../../constants/tokens";
import { CustomMeta, CustomStoryObj } from "../../test_utils/types";
import Popconfirm from ".";

export default {
  component: Popconfirm,
} satisfies CustomMeta<typeof Popconfirm>;

const TriggerButton = styled.button`
  padding: ${size.xs} ${size.s};
  background-color: #f5f6f7;
  border: 1px solid #babdbe;
  border-radius: ${size.xxs};
  cursor: pointer;

  &:hover {
    background-color: #e8e9ea;
  }
`;

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
    trigger: <TriggerButton>Click to open popconfirm</TriggerButton>,
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
    <PositionsContainer>
      <PositionWrapper>
        <Popconfirm
          align="top"
          justify="middle"
          trigger={<TriggerButton>Top Middle</TriggerButton>}
        >
          Confirmation message
        </Popconfirm>
      </PositionWrapper>
      <PositionWrapper>
        <Popconfirm
          align="bottom"
          justify="middle"
          trigger={<TriggerButton>Bottom Middle</TriggerButton>}
        >
          Confirmation message
        </Popconfirm>
      </PositionWrapper>
      <PositionWrapper>
        <Popconfirm
          align="left"
          justify="middle"
          trigger={<TriggerButton>Left Middle</TriggerButton>}
        >
          Confirmation message
        </Popconfirm>
      </PositionWrapper>
      <PositionWrapper>
        <Popconfirm
          align="right"
          justify="middle"
          trigger={<TriggerButton>Right Middle</TriggerButton>}
        >
          Confirmation message
        </Popconfirm>
      </PositionWrapper>
    </PositionsContainer>
  ),
};

const PositionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${size.l};
`;

const PositionWrapper = styled.div`
  margin: ${size.m};
`;
