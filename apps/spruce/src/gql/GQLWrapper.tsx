import { ApolloProvider } from "@apollo/client";
import { FullPageLoad } from "@evg-ui/lib/components/FullPageLoad";
import { useCreateGQLClient } from "gql/client/useCreateGQLClient";

const GQLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useCreateGQLClient();
  if (!client) {
    return <FullPageLoad />;
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GQLWrapper;
