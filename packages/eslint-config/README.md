# About ESLint

Our ESLint configuration uses the flat config system. Currently, this is the recommended way to use ESLint.

## Reviewing ESLint Changes

When making a change to the ESLint configuration, we recommend using the following command from within a directory that has ESLint installed (such as `apps/spruce` or `apps/parsley`):

```bash
pnpm eslint --inspect-config
```

This will open the [Config Inspector](https://eslint.org/blog/2024/04/eslint-config-inspector/), a tool that allows you to review active plugins and rules. You can use this tool to confirm that whatever ESLint changes you've made have been properly registered.

Note that different directories can have different ESLint configurations. If you run this command from the Spruce and Parsley directories, you'll find that they have slightly different plugins and rules.
