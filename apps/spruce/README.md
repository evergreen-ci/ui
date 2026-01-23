# [Spruce](https://spruce.mongodb.com) &middot; [![GitHub license](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://github.com/evergreen-ci/spruce/main/LICENSE)

Spruce is the React UI for MongoDB's continuous integration software.

## Getting Started

### Running Locally

1. Clone the Spruce GitHub repository
2. Ensure you have Node.js v22+ and MongoDB Command Line Database Tools
   v100.8.0+ installed
3. Run `pnpm install`
4. Start a local Evergreen server by doing the following:
   - Clone the [Evergreen repo](https://github.com/evergreen-ci/evergreen)
   - From the Evergreen directory, run `make local-evergreen`
5. Run `pnpm run dev`. This will launch the app and point it at the local
   Evergreen server you just started.

### Running against a remote Evergreen server

If you want to run Spruce against a remote Evergreen server, you can do so by
taking the following steps.

1. Generate a self signed certificate and add it to your keychain. This will
   allow you to run Spruce against a remote Evergreen server that uses HTTPS.
   Run the below command in the root of the Spruce repository.

```sh
brew install mkcert
mkcert -install
mkcert -key-file localhost-key.pem -cert-file localhost-cert.pem spruce-local.corp.mongodb.com
```

2. Update your `/etc/hosts` file and add the following entry

```sh
127.0.0.1  spruce-local.corp.mongodb.com
```

3. Run the following command to start the local UI server with the remote
   Evergreen server.

```sh
pnpm <env_name>  # where env_name is the name of the environment you want to run (staging or prod)
```

4. Navigate to `https://spruce-local.corp.mongodb.com:8443` in your browser to
   view the Spruce UI.

### Storybook

Run `pnpm run storybook` to launch storybook and view our shared components.

### Code Formatting

Install the Prettier code formatting plugin in your code editor if you don't
have it already. The plugin will use the .prettierrc settings file found at the
root of Spruce to format your code.

### GQL Query Linting

Follow these directions to enable query linting during local development so your
Evergreen GraphQL schema changes are reflected in your Spruce query linting
results.

1. Symlink the standard definition language GraphQL schema used in your backend
   to a file named sdlschema in the root of the Spruce directory to enable query
   linting with ESLint like so
   `ln -s <path_to_evergreen_repo>/graphql/schema sdlschema`
2. Run `pnpm run eslint:strict` to see the results of query linting in your terminal or
   install a plugin to integrate ESlint into your editor. If you are using VS
   Code, we recommend ESLint by Dirk Baeumer.

### Environment Variables

Read more about environment variables
[here](../../packages/deploy-utils/README.md#environment-variables).

## GraphQL Type Generation

We use code generation to generate our types for our GraphQL queries and
mutations. When you create a query or mutation you can run the code generation
script with the steps below. The types for your query/mutation response and
variables will be generated and saved to `gql/generated/types.ts`. Much of the
underlying types for subfields in your queries will likely be generated there as
well and you can refer to those before creating your own.

### Setting up code generation

- Create a symlink from the `schema` folder from Evergreen to Spruce using

```bash
ln -s <path_to_evergreen_repo>/graphql/schema sdlschema
```

### Using code generation

- From within the Spruce folder run `pnpm codegen`
- As long as your queries are declared correctly the types should generate

### Code generation troubleshooting and tips

- Queries should be declared with a query name so the code generation knows what
  to name the corresponding type.
- Each query and mutation should have a unique name.
- Since query analysis for type generation occurs statically we can't place
  dynamic variables with in query strings. We instead have to hard code the
  variable in the query or pass it in as query variable.

### Common errors

- Sometimes you may run into an error where a dependency is out of date or in a
  broken state. If you run into this issue try running `pnpm install` to
  reinstall all dependencies. If that does not work try deleting your
  `node_modules` folder and running `pnpm install` again. You can use the
  `pnpm clean` command to do this for you.

## Testing

Spruce has a combination of unit tests using Vitest and integration tests using
Cypress.

### Unit tests

Unit tests are used to test individual features in isolation. We utilize
[Vitest](https://vitest.dev) to execute our unit tests and generate reports.

There are 3 types of unit tests you may encounter in this codebase.

#### Component Tests

These test React components. We utilize
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
to help us write our component tests. React Testing Library provides several
utilities that are useful for making assertions on React Componenents. When
writing component tests you should import
[test_utils](https://github.com/evergreen-ci/spruce/blob/main/src/test_utils/index.tsx)
instead of React Testing Library; `test_utils` is a wrapper around React Testing
Library which provides a series of helpful utilities for common testing
scenarios such as `queryByDataCy`, which is a helper for selecting `data-cy`
attributes, or `renderWithRouterMatch`, which is helpful for testing components
that rely on React Router.

#### Hook Tests

Often times you may find yourself writing
[custom React hooks](https://reactjs.org/docs/hooks-custom.html). The best way
to test these is using React Testing Library's
[`renderHook`](https://testing-library.com/docs/react-testing-library/api#renderhook)
utility. This allows you to test your custom hooks in isolation without needing
to wrap them in a component. It provides several methods that make it easy to
assert and test different behaviors in your hooks. Such as
[`waitFor`](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor),
which will wait for your hook to rerender before allowing a test to proceed.

#### Standard utility tests

These are the most basic of tests. They do not require any special libraries to
run and often just test standard JavaScript functions.

- You can run all unit tests once using `pnpm test run`
- You can run a specific unit test using `pnpm test run <test_name>`
- You can run Vitest in watch mode using `pnpm test`. This will open an
  interactive CLI that can be used to automatically run tests as you update
  them.

### E2E tests

At a high level, we use [Cypress](https://www.cypress.io/) to start a virtual
browser that is running Spruce. Cypress then is able to run our test specs,
which tell it to interact with the browser in certain ways and makes assertions
about what happens in the UI. Note that you must be running the Evergreen server
on http://localhost:9090 for the front-end to work.

In order to run the Cypress tests, do the following, assuming you have this repo
checked out and all the dependencies installed by pnpm:

1. Increase the limit on open files by running `ulimit -n 64000` before running
   mongod in the same shell.
2. Start the evergreen back-end with the sample local test data. You can do this
   by typing `make local-evergreen` in your evergreen folder.
3. Start the Spruce local server by typing `pnpm build:local && pnpm serve` in
   this repo.
4. Run Cypress by typing one of the following:
   - `pnpm cy:open` - opens the Cypress app in interactive mode. You can select
     tests to run from here in the Cypress browser.
   - `pnpm cy:run` - runs all the Cypress tests at the command-line and reports
     the results
   - `pnpm cy:test cypress/integration/hosts/hosts-filtering.ts` - runs tests in
     a specific file at the command-line. Replace the final argument with the
     relative path to your test file

### Snapshot Tests

Snapshot tests are automatically generated when we create Storybook stories.
These tests create a snapshot of the UI and compare them to previous snapshots
which are stored as files along side your Storybook stories in a `__snapshots__`
directory. They try to catch unexpected UI regressions. Read more about them
[here](https://vitest.dev/guide/snapshot.html#snapshot).

## How to get data for your feature

If you need more data to be able to test out your feature locally, the easiest
way to do so is to populate the local db using real data from the staging or
production environments.

1. You should identify if the data you need is located in the staging or prod db
   and connect to them using the instructions in the Evergreen Operations Guide
2. Identify the query you need to fetch the data you are looking for.

   ```sh
   Atlas atlas-mxabkq-shard-0 [primary] mci> db.distro.find({_id: "archlinux-small"}) // the full query
   ```

3. Write the file to your local system using the following command

   ```sh
   Atlas atlas-mxabkq-shard-0 [primary] mci> fs.writeFileSync('output.json', JSON.stringify(db.distro.find({_id: "archlinux-small"})))
   ```

   A file will be saved to your filesystem with the results of the query.

4. Exit the ssh session using `exit` or `Ctrl + D`
5. You should ensure this file does not contain any sensitive information before
   committing it to the repository.
6. Once you have this file you can copy the contents of it to the relevant
   `testdata/local/<collection>.json` file with in the evergreen folder
7. You can then run `pnpm evg-db-ops --reseed` to repopulate the local database
   with your new data.

**Notes**

When creating your queries you should be sure to limit the amount of documents
so you don't accidentally export an entire collection. You can do this by
passing a limit to the query.

### Logkeeper

Spruce has a minimal dependency on Logkeeper: it is used by Cypress tests on the
Job Logs page. If you'd like to get set up to develop these tests, complete the
following:

1. Clone the [Logkeeper Repository](https://github.com/evergreen-ci/logkeeper)
2. Run `pnpm bootstrap-s3-logs` to download some sample resmoke logs from s3.
3. Run the command outputted by the previous step to seed the env variables and
   start the local logkeeper server with the following command:

   ```bash
   LK_CORS_ORIGINS=http:\/\/localhost:\\d+ LK_EVERGREEN_ORIGIN=http://localhost:8080 LK_PARSLEY_ORIGIN=http://localhost:5173 go run main/logkeeper.go --localPath {abs_path_to_spruce}/bin/_bucketdata
   ```

## Deployment

Read more about deployment
[here](../../packages/deploy-utils/README.md#deployment).

## Advanced Debugging

### Inspecting the State of the Application

If debugging a feature requires you to inspect the application's state, tools
like [React DevTools](https://react.dev/learn/react-developer-tools) can be very
helpful. React DevTools is a browser extension available in Chrome, Firefox, and
Edge that allows you to inspect the React component tree, view the state of
components, and profile performance.

#### Debugging in Safari

Safari does not support React DevTools directly. To inspect the application
state in Safari, you can follow the steps below. Note: steps 1-3 only need to be
done your first time setting up React DevTools.

1. **Install React DevTools CLI**:
   ```bash
   npm install -g react-devtools
   ```

2. **Create a Self-Signed Certificate**: Generate a certificate to enable secure
   communication. The certificate will be valid for 365 days, after which you
   must generate a new certificate:
   ```bash
   openssl req -x509 -noenc -days 365 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -subj "/CN=localhost"
   ```

3. **Trust the Certificate**:
   1. Open the certificate in Finder:
      ```bash
      open localhost.crt
      ```
   2. Add it to your Keychain and mark it as trusted:
      - Drag the file into Keychain Access.
      - Double-click the certificate, expand **Trust**, and set **Always Trust**
        for SSL.

4. **Run React DevTools**:

   Start the CLI with the certificate and key:
   ```bash
   CERT=/path_to_cert/localhost.crt KEY=/path_to_cert/localhost.key react-devtools
   ```

5. **Prepare a Profiler-Ready Build**:

   Deploy a build with profiling enabled to the environment of your choice. For
   more details, refer to
   [React's Profiling Documentation](https://react.dev/docs/profiler). See the
   commands labeled **Profiling Builds** in the
   [Deployment](../../packages/deploy-utils/README.md#how-to-deploy-a-profiling-build)
   section.

6. **Connect via Safari**:

   Open the target domain in Safari and inspect the application state using
   React DevTools.

#### Troubleshooting

- If the certificate is not trusted, double-check the Keychain settings to
  ensure "Always Trust" is selected.
- Verify that the `react-devtools` CLI is running. Look for logs or error
  messages in the terminal for further insights.
