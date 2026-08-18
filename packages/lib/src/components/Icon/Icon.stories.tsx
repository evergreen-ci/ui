import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Icon, { glyphs } from ".";

const { green } = palette;

const Sizes = {
  small: 14,
  medium: 16,
  large: 20,
  xlarge: 24,
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
    size: Sizes.medium,
  },
  render: (args) => (
    <Container>
      {(Object.keys(glyphs) as Array<keyof typeof glyphs>).map((name) => (
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
