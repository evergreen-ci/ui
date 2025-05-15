import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Message } from "@lg-chat/message";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";

const { black } = palette;
const ChatModuleMessageLoading: React.FC = () => (
  <div style={{ marginBottom: "16px", width: "100%" }}>
    <LabelHeader>
      <StyledIcon glyph="ParsleyLogo" />
      <Body weight="medium">Parsley AI</Body>
    </LabelHeader>

    <StyledMessage
      key="loading_1"
      isSender={false}
      messageBody="Thinking ..."
      sourceType="markdown"
    />
  </div>
);

const StyledIcon = styled(Icon)`
  width: ${size.m};
  height: ${size.m};
  padding: ${size.xxs};
  background-color: ${black};
  border-radius: 50%;
`;
const LabelHeader = styled.div<{ isSender?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  /* if isSender float right */
  float: ${(props) => (props.isSender ? "right" : "left")};
`;

const StyledMessage = styled(Message)`
  width: 100%;
`;
export default ChatModuleMessageLoading;
