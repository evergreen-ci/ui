# Evergreen UI

The new home of [Spruce](/apps/spruce) and [Parsley](/apps/parsley).

## Monorepo Tips & Tricks

To upgrade a dependency:

```bash
yarn upgrade-interactive [--latest] [package-name]
```

To run a script in a workspace from root:

```bash
yarn workspace [workspace-name] run [script-name]
```

Check out the [Yarn Workspaces documentation](https://classic.yarnpkg.com/lang/en/docs/workspaces/) for more.
