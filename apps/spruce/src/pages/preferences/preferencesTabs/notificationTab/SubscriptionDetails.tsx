import { BottomPanelCloseButton } from "@via-ds/components/bottom-panel";
import { Content, Header } from "@via-ds/components/structure";
import type { TableDetailsRenderProps } from "@via-ds/components/table";
import { H6, Text } from "@via-ds/components/typography";
import { GeneralSubscription, Selector } from "gql/generated/types";
import { getSubscriptionLabel } from "./utils";

export const renderSubscriptionDetails = ({
  rows,
}: TableDetailsRenderProps<GeneralSubscription>) => (
  <>
    <Header>
      <Text slot="title">Subscription details</Text>
      <BottomPanelCloseButton />
    </Header>
    <Content isScrollable>
      {rows.length === 0
        ? "No subscriptions selected."
        : rows.map(({ id, original }) => {
            const label = getSubscriptionLabel(original);
            const { regexSelectors, triggerData } = original;
            return (
              <section
                key={id}
                aria-label={label}
                data-testid="subscription-details"
              >
                <H6 elementType="h3">{label}</H6>
                <pre>
                  {Object.keys(triggerData ?? {}).length > 0 && (
                    <div data-testid="trigger-data">
                      {JSON.stringify(triggerData, null, 2)}
                    </div>
                  )}
                  {regexSelectors.length > 0 && (
                    <div data-testid="regex-selectors">
                      {JSON.stringify(
                        formatRegexSelectors(regexSelectors),
                        null,
                        2,
                      )}
                    </div>
                  )}
                </pre>
              </section>
            );
          })}
    </Content>
  </>
);

const formatRegexSelectors = (regexSelectors: Selector[]) => ({
  "regex-selectors": regexSelectors.reduce<Record<string, string>>(
    (obj, { data, type }) => ({
      ...obj,
      [type]: data,
    }),
    {},
  ),
});
