import "../styles/globals.css";
import type { AppProps } from "next/app";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const GITHUB_BASE_URL = "https://api.github.com/graphql";

function App({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    uri: GITHUB_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_GITHUB_ACCESS_TOKEN}`,
    },
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;
