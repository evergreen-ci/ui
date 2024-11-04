import { ApolloProvider } from "@apollo/client";
import { FullPageLoad } from "components/Loading/FullPageLoad";
import { useCreateGQLClient } from "hooks/useCreateGQLClient";

const GQLWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const client = useCreateGQLClient();
  if (!client) {
    return <FullPageLoad />;
  }
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GQLWrapper;
