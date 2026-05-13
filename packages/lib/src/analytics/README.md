# Analytics Module

Type-safe event tracking for user interactions. Built on the [Observability Package](../utils/observability/README.md).

> [!TIP]
> A static analytics site is built each time the app is deployed. Find them here:
> - [Spruce](https://spruce.mongodb.com/analytics.html)
> - [Parsley](https://parsley.mongodb.com/analytics.html)

> **Note:** The observability package handles infrastructure telemetry (page loads, API calls). Use analytics for **business-specific user actions** (button clicks, feature usage).

## Quick Start

### 1. Create an analytics hook

```typescript
// apps/spruce/src/analytics/task/useTaskAnalytics.ts
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";

type Action =
  | { name: "Clicked restart button" }
  | { name: "Changed task priority"; "task.priority": number }
  | { name: "Filtered tests table"; "filter.by": string };

export const useTaskAnalytics = () => {
  const { taskId } = useParams();

  return useAnalyticsRoot<Action, string>("Task", {
    "task.id": taskId,
  });
};
```

### 2. Use in your component

```typescript
import { useTaskAnalytics } from "analytics/task/useTaskAnalytics";

const TaskPage = () => {
  const { sendEvent } = useTaskAnalytics();

  const handleRestart = () => {
    sendEvent({ name: "Clicked restart button" });
    // ... restart logic
  };

  return <Button onClick={handleRestart}>Restart</Button>;
};
```

## Action Type Requirements

Event names must start with one of these prefixes:

- `Clicked` - Button/link clicks
- `Changed` - Value/state changes
- `Filtered` - Filtering operations
- `Sorted` - Sorting operations
- `Toggled` - Toggle actions
- `Viewed` - Page/modal views
- `Created` - Resource creation
- `Deleted` - Resource deletion
- `Saved` - Save operations
- `Used` - Feature usage

## What Gets Tracked

Each analytics event automatically includes:

**From your action:**
- Event name and custom properties
- Analytics identifier (e.g., "Task")
- Default properties from `useAnalyticsRoot()`

**From observability (automatic):**
- User ID, environment, app version
- Current route and route parameters
- Trace ID and span ID

## API Reference

### `useAnalyticsRoot<Action, Identifier>(identifier, attributes?)`

Creates an analytics hook for a feature/page.

**Parameters:**
- `identifier` - Feature name (e.g., "Task", "Navbar")
- `attributes` - Optional default properties for all events

**Returns:**
- `{ sendEvent }` - Function to send analytics events

### `sendEvent(action)`

Sends an analytics event.

**Example:**
```typescript
sendEvent({
  name: "Filtered tests table",
  "filter.by": "failed"
});
```

## Best Practices

### One hook per feature/page
```
analytics/
  ├── task/useTaskAnalytics.ts
  ├── navbar/useNavbarAnalytics.ts
  └── preferences/usePreferencesAnalytics.ts
```

### Type your actions
```typescript
type Action =
  | { name: "Clicked save button" }
  | { name: "Changed priority"; priority: number };
```

### Use descriptive names
- ✅ "Clicked restart task button"
- ❌ "Button clicked"

### Add relevant context
```typescript
sendEvent({
  name: "Filtered tests table",
  "filter.by": "failed",
  "test.count": 42
});
```

### Never sample analytics events
Unlike infrastructure traces, analytics events are:
- Low volume (you choose what to track)
- High value (direct user actions)
- Essential for product insights

If you have too many analytics events, track fewer types - don't sample.

## Span Attribute Naming

We utilize [Honeycomb for web](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/) to track analytic events. Using span attributes in OpenTelemetry, we can provide additional context to our analytics data. Below are best practices for defining span attributes.

### Use Namespaces for Context

When defining span attributes, it's essential to provide context by using namespaces. This helps to clarify the origin and purpose of the attribute, making it easier to interpret in analytics. Read more about Namespaces [here](https://docs.honeycomb.io/get-started/best-practices/organizing-data/#namespace-custom-fields).

**Bad Examples:**
- `status`
- `identifier`
- `function.name`
- `function.status`

**Good Examples:**
- `task.status`
- `version.status`
- `project.identifier`
- `section.function.name`
- `section.function.status`

By including a namespace (e.g., `task`, `version`, `project`, `section`), the attribute is contextualized, making it clear where it fits within the larger system. It also allows for more straightforward data filtering and analysis (e.g., `task.status=success` or `project.identifier=evergreen`).

### Avoid Excessive Dot Nesting

While namespaces are useful, over-nesting with too many dots can lead to overly complex attribute names. This not only makes them harder to read but can also complicate data queries and analysis.

**Bad Examples:**
- `host.is.volume.migration`
- `host.is.unexpirable`

**Good Examples:**
- `host.is_volume_migration`
- `host.is_unexpirable`

In these examples, using underscores instead of excessive dot nesting keeps the attribute names concise and easier to manage.

### Use Snake Case

When defining multi-word attributes, use `snake_case` to separate words. This ensures that the attribute is readable and easy to understand.

### Strive for Balance

When creating span attributes, aim to balance the need for context with simplicity. Use namespaces thoughtfully to provide clarity without overcomplicating the attribute structure. This approach will help maintain both readability and utility in our analytics. Read more about OpenTelemetry attribute naming [here](https://opentelemetry.io/docs/specs/semconv/general/attribute-naming/).

## Querying and Analyzing Data in Honeycomb

To begin querying and analyzing data in Honeycomb, follow these steps:

### 1. Select the Correct Dataset and Environment

Ensure you have selected the appropriate dataset and environment before proceeding.

### 2. Querying Analytics Events

- All analytics events are stored in the `library.name = analytics` namespace.
- To query analytics events, use the `WHERE` clause to filter by specific attributes. Including `library.name = analytics` ensures that only analytics events are queried.
- Each event has a `name` attribute, which can be used to filter for a specific event.
- The production environment is further divided into `production` and `beta` environment events. Use the `environment` attribute to filter for events in a specific environment.

### Grouping Data

Use the `GROUP BY` clause to organize data by a specific attribute, providing a clearer overview of the data.

#### Example Query: Grouping by `name` Attribute

[Example Query](https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/spruce/result/5digXmz9RyA)

This query groups data by the `name` attribute, showing how often each event has been triggered. To find a specific name attribute or to find which ones exist, reference the analytics sites linked at the top of this file.

---

### Grouping Data by Custom Attributes

You can also group data by other custom event-specific attributes, such as `status` or `log.type`, to see the data organized by custom attributes in the analytics event.

#### Example Query: Grouping by `log.viewer`

[Example Query](https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/spruce/result/gqxr5j4CrDh)

This query groups `Clicked log link` events by the `log.viewer` attribute, showing how often a specific log viewer was chosen when viewing a task log.

---

### Grouping Data by `analytics.identifier`

Analytics events in our apps are split by the specific page or component where the event is triggered, using the `analytics.identifier` attribute. You can use this attribute to group data by the page or component where the event occurred.

For example, if you want to see how many times a user clicked a button on a specific page, group the data by `analytics.identifier` to get detailed insights.

#### Example Query: Grouping by `analytics.identifier`

[Example Query](https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/spruce/result/9geStAzEFQb?hideCompare)

This query searches for the `Click patch link` event, which exists on multiple pages. It then groups the data by `analytics.identifier` to show how often each event was triggered on specific pages.

---

### Default Attributes

All analytics events have several default attributes that can be used for querying:

- `analytics.identifier`
- `name`
- `browser.name`
- `url.path`
- `user.id`
- `environment`

## Troubleshooting

### Events not appearing
1. Verify [observability package](../utils/observability/README.md) is initialized
2. Check `window.AttributeStore` exists
3. Look for errors in browser console
4. Search Honeycomb for `analytics.identifier` attribute

### TypeScript errors
- Ensure action names start with required prefixes
- Verify all action properties are in your `Action` type

## Examples

### Simple hook
```typescript
type Action =
  | { name: "Clicked logo" }
  | { name: "Clicked settings" };

export const useNavbarAnalytics = () =>
  useAnalyticsRoot<Action, string>("Navbar");
```

### Hook with context
```typescript
type Action =
  | { name: "Clicked restart" }
  | { name: "Changed priority"; priority: number };

export const useTaskAnalytics = () => {
  const { taskId } = useParams();
  const { data } = useQuery(TASK_QUERY);

  return useAnalyticsRoot<Action, string>("Task", {
    "task.id": taskId,
    "task.status": data?.task?.status,
  });
};
```

### Usage in component
```typescript
const TaskActions = () => {
  const { sendEvent } = useTaskAnalytics();

  return (
    <>
      <Button onClick={() => sendEvent({ name: "Clicked restart" })}>
        Restart
      </Button>
      <Select onChange={(priority) =>
        sendEvent({ name: "Changed priority", priority })
      } />
    </>
  );
};
```

## Additional Resources

- [Observability Package](../utils/observability/README.md) - Infrastructure telemetry
- [Honeycomb Query And Visualizing](https://docs.honeycomb.io/investigate/debug/application-data-in-honeycomb/#query-and-visualize)
- [Honeycomb Best Practices](https://docs.honeycomb.io/get-started/best-practices/)
- [OpenTelemetry Attribute Naming](https://opentelemetry.io/docs/specs/semconv/general/attribute-naming/)
- [Honeycomb for Web](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/)
