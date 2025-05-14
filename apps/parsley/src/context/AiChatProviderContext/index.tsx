import React, { createContext, useCallback, useContext, useState } from "react";

interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AiChatProviderContextType {
  sendMessage: (message: string) => Promise<any>;
  loading: boolean;
  error: string | null;
  messages: AiChatMessage[];
}

const AiChatProviderContext = createContext<
  AiChatProviderContextType | undefined
>(undefined);

export const AiChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  // The AI service URL will be provided later
  const AI_SERVICE_URL =
    "https://parsley-ai-agent-skunkworks.skunkworks.staging.corp.mongodb.comr/parsley_ai";

  const sendMessage = useCallback(
    async (message: string) => {
      setLoading(true);
      setError(null);
      setMessages((prev) => [...prev, { content: message, role: "user" }]);
      try {
        // Always send the full conversation history for context
        const response = await fetch(AI_SERVICE_URL, {
          body: JSON.stringify({
            message: message,
          }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch AI response");
        }
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { content: data.response, role: "assistant" },
        ]);
        setLoading(false);
        return data;
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLoading(false);
        throw err;
      }
    },
    [AI_SERVICE_URL, messages],
  );

  const contextValue = React.useMemo(
    () => ({ error, loading, messages, sendMessage }),
    [error, loading, sendMessage, messages],
  );

  return (
    <AiChatProviderContext.Provider value={contextValue}>
      {children}
    </AiChatProviderContext.Provider>
  );
};

export const useAiChat = () => {
  const context = useContext(AiChatProviderContext);
  if (!context) {
    throw new Error("useAiChat must be used within an AiChatProvider");
  }
  return context;
};
