# Evergreen UI

The home of [Spruce](/apps/spruce) and [Parsley](/apps/parsley).

## Getting Started

To use this repo, you'll need to:

1. [Install pnpm](https://pnpm.io/installation) Installing [via `npm`](https://pnpm.io/installation#using-npm) is recommended.
2. Install dependencies: `pnpm install` from anywhere in this repo.

Each application's README has instructions for running that app.

## Analytics

Read more about our analytics practices [here](ANALYTICS.md).

## Monorepo Tips & Tricks

Learn about our monorepo shared library [here](packages/lib/README.md).

Check out the
[pnpm Workspaces documentation](https://pnpm.io/workspaces)
for more.

### Dependencies

To upgrade a dependency across workspaces:

```bash
pnpm update [package-name] --latest --recursive
```

To remove all installed dependencies:

```bash
pnpm clean
```

You can then rerun `pnpm install`.

### Scripts

To run a script in all wokspaces from root:

```bash
pnpm -r run [script-name]
```

The `-r` flag is shorthand for `--recursive`, and `run` is optional. For example, `pnpm -r codegen` is quite handy to update all packages' generated GraphQL files.

If you'd like to run script in one workspace from root:

```bash
pnpm --filter [workspace-name] run [script-name]
```

For example, `pnpm --filter spruce run storybook`.

### Testing

To run all unit tests across the repository, from root:

```bash
pnpm test
```

To run a particular workspace's unit tests from root:

```bash
pnpm test --project [workspace-name]
```

### Storybook

Spruce, Parsley, and @evg-ui/lib all have their own storybooks, but there's also
a shared storybook that combines them into one interface. From root, just run:

```bash
pnpm storybook
```
