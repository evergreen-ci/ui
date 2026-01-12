import { ServerError } from "@apollo/client/errors";
import { RetryLink } from "@apollo/client/link/retry";
import { logGQLErrorsLink } from "./logGQLErrorsLink";

const retryLink = new RetryLink({
  attempts: {
    max: 5,
    retryIf: (error): boolean => {
      if (ServerError.is(error)) {
        // Retry for server errors (5xx).
        return error.response && error.response.status >= 500;
      }
      return false;
    },
  },
  delay: {
    initial: 300,
    jitter: true,
    max: 3000,
  },
});

export { retryLink, logGQLErrorsLink };
