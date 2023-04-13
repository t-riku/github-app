import { gql } from "@apollo/client";

export interface SearchRepositoriesResult {
  search: {
    __typename: string;
    repositoryCount: number;
    pageInfo: {
      endCursor: string | null;
      hasNextPage: boolean;
      __typename: string;
    };
    edges: {
      node: {
        id: string;
        name: string;
        url: string;
        description: string | null;
        updatedAt: string;
        stargazers: {
          totalCount: number;
          __typename: string;
        };
        __typename: string;
      };
      cursor: string;
      __typename: string;
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
