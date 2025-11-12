# Evergreen UI

The new home of [Spruce](/apps/spruce) and [Parsley](/apps/parsley).

## Analytics

Read more about our analytics practices [here](ANALYTICS.md).

## Monorepo Tips & Tricks

Learn about our monorepo shared library [here](packages/lib/README.md).

Check out the
[Yarn Workspaces documentation](https://classic.yarnpkg.com/lang/en/docs/workspaces/)
for more.

### Dependencies

To upgrade a dependency across workspaces:

```bash
yarn upgrade-interactive [--latest] [package-name]
```

To remove all installed dependencies:

```bash
yarn clean
```

You can then rerun `yarn install`.

### Scripts

To run a script in a workspace from root:

```bash
yarn workspace [workspace-name] run [script-name]
```

For example, `yarn workspace spruce run storybook`.

### Testing

To run all unit tests across the repository, from root:

```bash
yarn test
```

To run a particular workspace's unit tests from root:

```bash
yarn test --project [workspace-name]
```

### Storybook

Spruce, Parsley, Fungi, and @evg-ui/lib all have their own storybooks, but there's also
a shared storybook that combines them into one interface. From root, just run:

```bash
yarn storybook
```
