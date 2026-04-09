# Parsley 🌿

Parsley is the UI for Evergreen's log viewer. It is the replacement for
[Lobster](https://github.com/evergreen-ci/lobster).

## Table of Contents

- [Getting Started](#getting-started)

## Getting Started

### Running Locally

1. Clone this GitHub repository.
2. Ensure you have Node.js v22+ and
   [pnpm](https://pnpm.io/installation) installed.
3. Run `pnpm install`.
4. Run `pnpm run dev`. This will launch the app.

### Running against a remote Evergreen server

If you want to run Parsley against a remote Evergreen server, you can do so by
taking the following steps.

1. Generate a self signed certificate and add it to your keychain. This will
   allow you to run Parsley against a remote Evergreen server that uses HTTPS.
   Run the below command in the root of the Parsley repository.

```sh
brew install mkcert nss
mkcert -install
mkcert -key-file localhost-key.pem -cert-file localhost-cert.pem parsley-local.corp.mongodb.com
```

2. Update your `/etc/hosts` file and add the following entry

```sh
127.0.0.1  parsley-local.corp.mongodb.com
```

3. Run the following command to start the local UI server with the remote
   Evergreen server.

```sh
pnpm <env_name>  # where env_name is the name of the environment you want to run staging or prod
```

4. Navigate to `https://parsley-local.corp.mongodb.com:8444` in your browser to
   view the Spruce UI.

### Starting supporting services

Parsley fetches logs from
[Evergreen](https://github.com/evergreen-ci/evergreen). To develop locally:

1. Clone the [Evergreen Repository](https://github.com/evergreen-ci/evergreen)
2. Follow the setup instructions in the README to set up your environment.
3. Run `pnpm bootstrap-s3-logs` to download sample test log data from S3.
4. Create a symlink from your Evergreen repo to the downloaded bucket data:
   ```bash
   ln -s <path_to_parsley>/bin/_bucketdata _bucketdata
   ```
5. Run `make local-evergreen` to start the local Evergreen server.

### GraphQL Type Generation

To be able to use code generation, you'll need to create a symlink to the
`schema` folder in Evergreen. This folder contains the definitions for our
GraphQL queries, mutations, and types.

To create a symlink, run the following command:

```
ln -s <path_to_evergreen_repo>/graphql/schema sdlschema
```

### Environment Variables

Read more about environment variables
[here](../../packages/deploy-utils/README.md#environment-variables).

### Common errors

- Sometimes you may run into an error where a dependency is out of date or in a
  broken state. If you run into this issue try running `pnpm install` to
  reinstall all dependencies. If that does not work try deleting your
  `node_modules` folder and running `pnpm install` again. You can use the
  `pnpm clean` command to do this for you.

## Deployment

Read more about deployment
[here](../../packages/deploy-utils/README.md#deployment).
