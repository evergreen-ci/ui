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
