import { gql } from "@apollo/client";

export interface SearchRepositoriesResult {
  search: {
    repositoryCount: number;
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
    };
    edges: {
      node: {
        id: string;
        name: string;
        url: string;
        description: string | null;
        stargazerCount: number;
        createdAt: string;
        updatedAt: string;
      };
    }[];
  };
}

export interface SearchRepositoriesVariables {
  query: string;
  cursor?: string;
}

export const SEARCH_REPOSITORIES = gql`
  ${require("./searchRepositories.graphql").default}
`;
