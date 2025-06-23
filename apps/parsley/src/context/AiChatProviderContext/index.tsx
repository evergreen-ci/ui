import React, { createContext, useCallback, useContext, useState } from "react";
import { Link } from "@leafygreen-ui/typography";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useLogContext } from "context/LogContext";
import { AiChatMessage } from "./types";

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
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      content: ` **Welcome to Parsley AI!**
 I'm here to help you debug your Evergreen task using the log file and other available data sources.
 Try asking things like:

 • *Where did the failure happen, and why?*
 • *Was this failure caused by my code?*
 • *What was running when the timeout occurred?*`,
      role: "assistant",
    },
  ]);

  const dispatchToast = useToastContext();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { logMetadata } = useLogContext();
  // The AI service URL will be provided later
  const AI_SERVICE_URL =
    "https://evergreen-ai-service.staging.corp.mongodb.com/parsley_ai";
  const sendMessage = useCallback(
    async (message: string) => {
      setLoading(true);
      setError(null);
      setMessages((prev) => [
        ...prev,
        {
          content: message,
          role: "user",
        },
      ]);
      try {
        // Always send the full conversation history for context
        const response = await fetch(AI_SERVICE_URL, {
          body: JSON.stringify({
            execution: Number.parseInt(logMetadata?.execution || "0", 10),
            message: message,
            session: sessionId,
            task_id: logMetadata?.taskID,
          }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });
        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText);
          setLoading(false);
          console.error(errorText);
          dispatchToast.error(
            <>
              An error occurred while fetching AI response. Please try again.
            </>,
          );
          throw new Error("Failed to fetch AI response");
        }
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            content: data.response,
            links: data?.links,
            role: "assistant",
          },
        ]);
        setSessionId(data.session);
        setLoading(false);
        return data;
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setLoading(false);
        dispatchToast.error(
          <>
            An error occurred while fetching AI response{" "}
            <Link href="https://login.corp.mongodb.com/login" target="_blank">
              You may need to login to continue.
            </Link>
            . Please click the link to login and try again.
          </>,
        );
        throw err;
      }
    },
    [AI_SERVICE_URL],
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
