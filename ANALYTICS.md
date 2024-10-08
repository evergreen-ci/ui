# Analytics Best Practices

Analytics are a crucial component of tracking and understanding user behavior,
system performance, and other key metrics. To ensure that our analytics are
effective and actionable, we follow a set of best practices. These practices
help us maintain consistency, accuracy, and clarity in our analytics data.

When adding or updating a new analytic event utilize the following spreadsheet
to ensure that the event is consistent with the rest of the events in the
system:
[Analytics Event Spreadsheet](https://docs.google.com/spreadsheets/d/1s4_nq8ZiphXp5Uq_-9HT6GPqz-KOyaq6HuvmXYaSNzg/edit?gid=0#gid=0)

We utilize
[Honeycomb for web](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/)
to track analytic events. Using span attributes in OpenTelemetry, we can provide
additional context to our analytics data. Below are some best practices for
defining span attributes in OpenTelemetry.

## OpenTelemetry Span Attribute Best Practices

### 1. Use Namespaces for Context

When defining span attributes, it's essential to provide context by using
namespaces. This helps to clarify the origin and purpose of the attribute,
making it easier to interpret in analytics. Read more about Namespaces
[here](https://docs.honeycomb.io/get-started/best-practices/organizing-data/#namespace-custom-fields)

#### Bad Examples:

- `status`
- `identifier`
- `function.name`
- `function.status`

#### Good Examples:

- `task.status`
- `version.status`
- `project.identifier`
- `section.function.name`
- `section.function.status`

By including a namespace (e.g., `task`, `version`, `project`, `section`), the
attribute is contextualized, making it clear where it fits within the larger
system. It also allows for more straightforward data filtering and analysis.
e.g. `task.status=success` or `project.identifier=evergreen`.

### 2. Avoid Excessive Dot Nesting

While namespaces are useful, over-nesting with too many dots can lead to overly
complex attribute names. This not only makes them harder to read but can also
complicate data queries and analysis.

#### Bad Examples:

- `host.is.volume.migration`
- `host.is.unexpirable`

#### Good Examples:

- `host.is_volume_migration`
- `host.is_unexpirable`

In these examples, using underscores instead of excessive dot nesting keeps the
attribute names concise and easier to manage.

### 3. Snake case

When defining multi word attributes, use `snake_case` to separate words. This
ensures that the attribute is readable and easy to understand.

### 4. Strive for Balance

When creating span attributes, aim to balance the need for context with
simplicity. Use namespaces thoughtfully to provide clarity without
overcomplicating the attribute structure. This approach will help maintain both
readability and utility in our analytics. Read more about OpenTelemetry
attribute naming
[here](https://opentelemetry.io/docs/specs/semconv/general/attribute-naming/).

## Querying and Analyzing Data

To begin querying and analyzing data in Honeycomb, follow these steps:

1. **Select the Correct Dataset and Environment**: Ensure you have selected the
   appropriate dataset and environment before proceeding.

2. **Querying Analytics Events**:
   - All analytics events are stored in the `library.name = analytics`
     namespace.
   - To query analytics events, use the `WHERE` clause to filter by specific
     attributes. Including `library.name = analytics` ensures that only
     analytics events are queried.
   - Each event has a `name` attribute, which can be used to filter for a
     specific event.
   - The production environment is further divided into `production` and `beta`
     environment events. Use the `environment` attribute to filter for events
     in a specific environment.

3. **Grouping Data**:
   - Use the `GROUP BY` clause to organize data by a specific attribute,
     providing a clearer overview of the data.

#### Example Query: Grouping by `name` Attribute

[Example Query](https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/spruce/result/5digXmz9RyA)

This query groups data by the `name` attribute, showing how often each event has
been triggered. To find a specific name attribute or to find which ones exist
reference the
[Analytics Event Spreadsheet](https://docs.google.com/spreadsheets/d/1s4_nq8ZiphXp5Uq_-9HT6GPqz-KOyaq6HuvmXYaSNzg/edit?gid=0#gid=0).

---

### Grouping Data by Custom Attributes

You can also group data by other custom event specific attributes, such as
`status` or `log.type`, to see the data organized by custom attributes in the
analytics event.

#### Example Query: Grouping by `log.viewer`

[Example Query](https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/spruce/result/gqxr5j4CrDh)

This query groups `Clicked log link` events by the `log.viewer` attribute,
showing how often a specific log viewer was chosen when viewing a task log.

---

### Grouping Data by `analytics.identifier`

Analytics events in our apps are split by the specific page or component where
the event is triggered, using the `analytics.identifier` attribute. You can use
this attribute to group data by the page or component where the event occurred.

For example, if you want to see how many times a user clicked a button on a
specific page, group the data by `analytics.identifier` to get detailed
insights.

#### Example Query: Grouping by `analytics.identifier`

[Example Query](https://ui.honeycomb.io/mongodb-4b/environments/production/datasets/spruce/result/9geStAzEFQb?hideCompare)

This query searches for the `Click patch link` event, which exists on multiple
pages. It then groups the data by `analytics.identifier` to show how often each
event was triggered on specific pages.

---

### Default Attributes

All analytics events have several default attributes that can be used for
querying. Here are some common default attributes:

- `analytics.identifier`
- `name`
- `browser.name`
- `url.path`
- `user.id`
- `environment`

---

### Additional Resources
- [Honeycomb Query And Visualizing](https://docs.honeycomb.io/investigate/debug/application-data-in-honeycomb/#query-and-visualize)
- [Honeycomb Best Practices](https://docs.honeycomb.io/get-started/best-practices/)
- [OpenTelemetry Attribute Naming](https://opentelemetry.io/docs/specs/semconv/general/attribute-naming/)
- [Honeycomb for Web](https://docs.honeycomb.io/send-data/javascript-browser/honeycomb-distribution/)

