import { useCallback, useMemo } from "react";
import type { Properties, ActionType } from "@evg-ui/lib/analytics/types";
import { sendEventTrace } from "@evg-ui/lib/src/analytics/utils";
import { Analytics, AnalyticsObject } from "analytics/addPageAction";

export const useAnalyticsRoot = <Action extends ActionType>(
  object: AnalyticsObject,
  attributes: Properties = {},
): Analytics<Action> => {
  const sendEvent = useCallback(
    (action: Action) => {
      const userId = localStorage.getItem("userId") || "";
      sendEventTrace<AnalyticsObject>(action, {
        object,
        "user.id": userId,
        ...attributes,
      });
    },
    [object, attributes],
  );

  return useMemo(() => ({ sendEvent }), [sendEvent]);
};
