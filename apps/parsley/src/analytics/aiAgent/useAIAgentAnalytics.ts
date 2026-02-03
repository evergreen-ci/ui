import { MessageRatingValue } from "@lg-chat/message-rating";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";

type Action =
  | {
      name: "Viewed Parsley AI beta modal";
      "beta_features.parsley_ai_enabled": boolean;
    }
  | {
      name: "Clicked suggestion";
      suggestion: string;
    }
  | {
      name: "Interacted with Parsley AI";
      message: string;
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
    };

export const useAIAgentAnalytics = () =>
  useAnalyticsRoot<Action, AnalyticsIdentifier>("AIAgent");
