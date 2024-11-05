import { RetryLink } from "@apollo/client/link/retry";
import { logGQLErrorsLink } from "./logGQLErrorsLink";

const retryLink = new RetryLink({
  attempts: {
    max: 5,
    retryIf: (error): boolean =>
      error && error.response && error.response.status >= 500,
  },
  delay: {
    initial: 300,
    jitter: true,
    max: 3000,
  },
});

export { retryLink, logGQLErrorsLink };
