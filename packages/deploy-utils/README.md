## Environment Variables

[env-cmd](https://github.com/toddbluhm/env-cmd#readme) is used to configure build environments for production, staging, and development. We use `.env-cmdrc.json` to represent these various environments. `.env-cmdrc.json` does not contain any sensitive information and can be used for local builds or manual builds deployed to S3.

Please note that since `.env-cmdrc.json` lacks secrets for Sentry and Honeycomb, manual deploys to S3 will not be able to utilize those services.


## Deployment
### Requirements

You must be on the `main` branch if deploying to prod.

### How to Deploy:

For production, use `yarn deploy:prod` to push a git tag and trigger a new build. In case of emergency (i.e. Evergreen, GitHub, or other systems are down), a production build can be pushed directly to S3 with `yarn deploy:prod --force`.

For staging and beta environments, run the corresponding deploy task in an Evergreen patch.
