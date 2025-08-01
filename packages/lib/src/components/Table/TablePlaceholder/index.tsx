import styled from "@emotion/styled";
import { size } from "../../../constants/tokens";
import Icon, { glyphs } from "../../Icon";

interface Props {
  message: string | React.ReactNode;
  glyph?: keyof typeof glyphs;
  spin?: boolean;
}

export const TablePlaceholder: React.FC<Props> = ({
  glyph = "CurlyBraces",
  message,
  spin = false,
  ...props
}) => (
  <PlaceholderWrapper {...props}>
    <SpinningIcon glyph={glyph} size="large" spin={spin ? "spin" : "no-spin"} />
    <div>{message}</div>
  </PlaceholderWrapper>
);

const PlaceholderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${size.xs};
  padding: ${size.l} 0;
  opacity: 50%;
`;

const SpinningIcon = styled(Icon)<{ spin: string }>`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  ${({ spin }) => spin === "spin" && `animation: spin 1s linear infinite`};
`;
