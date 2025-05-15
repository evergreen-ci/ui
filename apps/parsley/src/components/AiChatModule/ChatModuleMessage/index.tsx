import { Message } from "@lg-chat/message";
import { AiChatMessage } from "context/AiChatProviderContext/types";

const ChatModuleMessage: React.FC<AiChatMessage> = ({
  content,
  links,
  role,
}: AiChatMessage) => (
  <Message
    key={content}
    isSender={role === "user"}
    links={links ? transformLinks(links) : undefined}
    messageBody={content}
    sourceType="markdown"
  />
);

const transformLinks = (links: { title: string; url: string }[]) =>
  links.map((link) => ({
    children: link.title,
    href: link.url,
  }));

export default ChatModuleMessage;
