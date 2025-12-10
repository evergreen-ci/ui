# Evergreen UI

The new home of [Spruce](/apps/spruce) and [Parsley](/apps/parsley).

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

To run a script in a workspace from root:

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
