# `lib` Directory Readme

## Overview

The `lib` directory is designed to house shared code used across our two main
projects. This centralization of common components and utilities aims to improve
code reusability and maintainability, ensuring that updates and bug fixes can be
applied in a single location.

## Best Practices for Managing Dependencies

When moving shared code to the `lib` directory, it is essential to manage
dependencies correctly to avoid duplication and maintain consistency.

### External Dependencies:

- If the shared code in the `lib` directory has an external dependency that is
  not directly used by the individual projects, it is best practice to remove
  that dependency from the individual project folders and install it within the
  `lib` folder. This approach centralizes the dependency management and avoids
  redundancy.

### Project-Specific Dependencies:

- If the shared code depends on an external library that is also used directly
  by the individual projects, the dependency should be installed in both the
  `lib` and the respective project. This ensures that each project has the
  necessary dependencies available, and any version-specific requirements are
  respected.

### Example

Consider a scenario where both Project A and Project B utilize a utility
function from `lib/module1/file1.ts` that depends on an external library,
`external-lib`.

- If `external-lib` is used exclusively by `lib/module1/file1.ts`, it should be
  installed only in the `lib` directory.
- If `external-lib` is also used directly by Project A or Project B, it should
  be installed in both the respective project and the `lib` directory.

## Contribution Guidelines

When contributing to the `lib` directory, please ensure that:

1. All shared components and utilities are well-documented.
2. Dependencies are clearly defined and managed according to the above best
   practices.
3. Changes are tested across all projects that utilize the shared code.
