# Evergreen UI

The new home of [Spruce](/apps/spruce) and [Parsley](/apps/parsley).

## Monorepo Tips & Tricks

Check out the [Yarn Workspaces documentation](https://classic.yarnpkg.com/lang/en/docs/workspaces/) for more.

### Upgrades

To upgrade a dependency across workspaces:

```bash
yarn upgrade-interactive [--latest] [package-name]
```

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
yarn test --selectProjects [workspace-name]
```
