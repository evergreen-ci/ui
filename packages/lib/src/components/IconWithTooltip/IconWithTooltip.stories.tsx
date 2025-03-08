import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Size, glyphs } from "components/Icon";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import IconWithTooltip from ".";

const { green } = palette;

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  component: IconWithTooltip,
} satisfies CustomMeta<typeof IconWithTooltip>;

export const Default: CustomStoryObj<typeof IconWithTooltip> = {
  argTypes: {
    fill: {
      control: "color",
    },
    size: {
      control: { type: "select" },
      options: Object.values(Sizes),
    },
    children: {
      control: { type: "text" },
    },
  },
  args: {
    fill: green.dark3,
    size: Sizes[Size.Default],
    children: "Tooltip Text",
  },
  render: ({ children, ...rest }) => (
    <Container>
      {Object.keys(glyphs).map((name) => (
        <IconContainer key={name}>
          <IconWithTooltip {...rest} glyph={name}>
            {children}
          </IconWithTooltip>
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
