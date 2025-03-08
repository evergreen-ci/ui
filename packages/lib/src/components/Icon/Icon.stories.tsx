import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Icon, { Size, glyphs } from ".";

const { green } = palette;

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  component: Icon,
} satisfies CustomMeta<typeof Icon>;

export const Default: CustomStoryObj<typeof Icon> = {
  argTypes: {
    fill: {
      control: "color",
    },
    size: {
      control: { type: "select" },
      options: Object.values(Sizes),
    },
  },
  args: {
    fill: green.dark3,
    size: Sizes[Size.Default],
  },
  render: (args) => (
    <Container>
      {Object.keys(glyphs).map((name) => (
        <IconContainer key={name}>
          <Icon {...args} glyph={name} />
          <span>{name}</span>
        </IconContainer>
      ))}
    </Container>
  ),
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: ${size.xxs};

  width: 150px;
  height: 70px;

  border: 1px solid #babdbe;
  border-radius: ${size.xxs};
  margin: 0.5rem;

  text-align: center;
`;
