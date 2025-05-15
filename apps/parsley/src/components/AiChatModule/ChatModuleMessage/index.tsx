import styled from "@emotion/styled";
import { Avatar } from "@leafygreen-ui/avatar";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { Message } from "@lg-chat/message";
import Icon from "@evg-ui/lib/components/Icon";
import { size } from "@evg-ui/lib/constants/tokens";
import { AiChatMessage } from "context/AiChatProviderContext/types";

const { black } = palette;

const ChatModuleMessage: React.FC<AiChatMessage> = ({
  content,
  links,
  role,
}: AiChatMessage) => (
  <div style={{ marginBottom: "16px", width: "100%" }}>
    {role === "assistant" ? (
      <LabelHeader>
        <StyledIcon glyph="ParsleyLogo" />
        <Body weight="medium">Parsley AI</Body>
      </LabelHeader>
    ) : (
      <LabelHeader isSender>
        <Avatar data-cy="user-avatar" format="icon" glyph="Person" />
        <Body weight="medium">You</Body>
      </LabelHeader>
    )}
    <StyledMessage
      key={content}
      isSender={role === "user"}
      links={links ? transformLinks(links) : undefined}
      messageBody={content}
      sourceType="markdown"
    />
  </div>
);

const transformLinks = (links: { title: string; url: string }[]) =>
  links.map((link) => ({
    children: link.title,
    href: link.url,
  }));

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
export default ChatModuleMessage;
