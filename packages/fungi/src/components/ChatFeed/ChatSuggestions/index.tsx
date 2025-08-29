import { useState } from "react";
import styled from "@emotion/styled";
import { Disclaimer } from "@leafygreen-ui/typography";
import { MessagePrompt, MessagePrompts } from "@lg-chat/message-prompts";
import { size } from "@evg-ui/lib/constants/tokens";

interface ChatSuggestionsProps {
  chatSuggestions: string[];
  handleSend: (message: string) => void;
}

const getRandomSuggestions = (
  suggestions: string[],
  count: number,
): string[] => {
  if (suggestions.length <= count) return suggestions;
  // Fisher-Yates shuffle
  const arr = [...suggestions];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
};

const ChatSuggestions: React.FC<ChatSuggestionsProps> = ({
  chatSuggestions,
  handleSend,
}) => {
  const [chosenSuggestions] = useState<string[]>(() =>
    getRandomSuggestions(chatSuggestions, 3),
  );

  return (
    <Container>
      <Disclaimer>Suggested Prompts </Disclaimer>
      <MessagePrompts>
        {chosenSuggestions.map((suggestion) => (
          <MessagePrompt
            key={suggestion}
            onClick={() => handleSend(suggestion)}
          >
            {suggestion}
          </MessagePrompt>
        ))}
      </MessagePrompts>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.xs};
  width: 100%;
`;

export default ChatSuggestions;
