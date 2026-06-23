import { MessageRatingValue } from "@lg-chat/message-rating";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | {
      name: "Clicked suggestion";
      suggestion: string;
    }
  | {
      name: "Created Parsley AI session";
      "conversation.id": string;
    }
  | {
      name: "Interacted with Parsley AI";
      message: string;
      "conversation.id": string;
      "message.index": number;
    }
  | {
      name: "Toggled AI agent panel";
      open: boolean;
    }
  | {
      name: "Clicked submit feedback button";
      feedback: string;
      spanId: string;
    }
  | {
      name: "Clicked submit rating button";
      rating: MessageRatingValue;
      spanId: string;
    }
  | {
      name: "Clicked copy response button";
    }
  | {
      name: "System Event AI tool result";
      "tool.name": string;
      "tool.is_error": boolean;
    };

export const useAIAgentAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("AIAgent");
