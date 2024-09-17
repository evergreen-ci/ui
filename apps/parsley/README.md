# Parsley 🌿

Parsley is the UI for Evergreen's log viewer. It is the replacement for
[Lobster](https://github.com/evergreen-ci/lobster).

## Table of Contents

- [Getting Started](#getting-started)

## Getting Started

### Running Locally

1. Clone this GitHub repository.
2. Ensure you have Node.js 16.13+ and
   [Yarn](https://yarnpkg.com/getting-started/install) installed.
3. Run `yarn`.
4. Run `yarn run dev`. This will launch the app.

### Starting supporting services

Parsley is capable of fetching logs from both
[evergreen](https://github.com/evergreen-ci/evergreen) and
[logkeeper](https://github.com/evergreen-ci/logkeeper). If you would like to
develop against them you will need to run both of the servers locally.

**Evergreen**

1. Clone the [Evergreen Repository](https://github.com/evergreen-ci/evergreen)
2. Follow the setup instructions in the README to set up your environment.
3. Run `make local-evergreen` to start the local evergreen server

**Logkeeper**

1. Clone the [Logkeeper Repository](https://github.com/evergreen-ci/logkeeper)
2. Run `yarn bootstrap-s3-logs` to download some sample resmoke logs from s3.
3. Run the command outputted by the previous step to seed the env variables and
   start the local logkeeper server with the following command:

   ```bash
   LK_CORS_ORIGINS=http:\/\/localhost:\\d+ LK_EVERGREEN_ORIGIN=http://localhost:8080 LK_PARSLEY_ORIGIN=http://localhost:5173 go run main/logkeeper.go --localPath {abs_path_to_parsley}/bin/_bucketdata
   ```

### GraphQL Type Generation

To be able to use code generation, you'll need to create a symlink to the
`schema` folder in Evergreen. This folder contains the definitions for our
GraphQL queries, mutations, and types.

To create a symlink, run the following command:

```
ln -s <path_to_evergreen_repo>/graphql/schema sdlschema
```

### Environment Variables

[env-cmd](https://github.com/toddbluhm/env-cmd#readme) is used to configure build environments for production, staging, and development. We use `.env-cmdrc.json` to represent these various environments. `.env-cmdrc.json` does not contain any sensitive information and can be used for local builds or manual builds deployed to S3.

Please note that since `.env-cmdrc.json` lacks secrets for Sentry and Honeycomb, manual builds to S3 will not be able to utilize those services.

### Common errors

- Sometimes you may run into an error where a dependency is out of date or in a
  broken state. If you run into this issue try running `yarn install` to
  reinstall all dependencies. If that does not work try deleting your
  `node_modules` folder and running `yarn install` again. You can use the
  `yarn clean` command to do this for you.

## Deployment

### Requirements

You must be on the `main` Branch if deploying to prod.

### How to Deploy:

For production, use `yarn deploy:prod` to push a git tag and trigger a new build. In case of emergency (i.e. Evergreen, GitHub, or other systems are down), a production build can be pushed directly to S3 with `BUCKET=<production_bucket> yarn deploy:prod --force`.

For staging and beta environments, run the corresponding deploy task in an Evergreen patch.
