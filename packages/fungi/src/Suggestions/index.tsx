import { useMemo } from "react";
import { MessagePrompt, MessagePrompts } from "@lg-chat/message-prompts";

interface Props {
  handleSend: (message: string) => void;
  suggestions: string[];
}

export const Suggestions: React.FC<Props> = ({ handleSend, suggestions }) => {
  const chosenSuggestions = useMemo(
    () => getNRandom(suggestions, 3),
    [suggestions],
  );

  return (
    <MessagePrompts label="Suggested Prompts">
      {chosenSuggestions.map((s: string) => (
        <MessagePrompt key={s} onClick={() => handleSend(s)}>
          {s}
        </MessagePrompt>
      ))}
    </MessagePrompts>
  );
};

const getNRandom = (items: any[], n: number) => {
  if (items.length <= n) return items;
  // Fisher-Yates shuffle
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
};
