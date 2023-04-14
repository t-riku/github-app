import { gql } from "@apollo/client";

// 型のまとめ（見やすく）
// export interface SearchRepositoriesResult {
//   search: {
//     __typename: string;
//     repositoryCount: number;
//     pageInfo: {
//       endCursor: string | null;
//       hasNextPage: boolean;
//       __typename: string;
//     };
//     edges: {
//       node: {
//         id: string;
//         name: string;
//         url: string;
//         description: string | null;
//         updatedAt: string;
//         stargazers: {
//           totalCount: number;
//           __typename: string;
//         };
//         __typename: string;
//       };
//       cursor: string;
//       __typename: string;
//     }[];
//   };
// }

// export interface SearchRepositoriesVariables {
//   query: string;
//   cursor?: string;
// }

interface RepositoryInfo {
  id: string;
  name: string;
  url: string;
  description: string | null;
  updatedAt: string;
  stargazerCount: number;
  stargazers: {
    totalCount: number;
    __typename: string;
  };
  __typename: string;
}

interface PageInfo {
  endCursor: string | null;
  hasNextPage: boolean;
  __typename: string;
}

export interface RepositoryEdge {
  node: RepositoryInfo;
  cursor: string;
  __typename: string;
}

interface SearchRepositoriesData {
  __typename: string;
  repositoryCount: number;
  pageInfo: PageInfo;
  edges: RepositoryEdge[];
}

export interface SearchRepositoriesResult {
  search: SearchRepositoriesData;
}

export interface SearchRepositoriesVariables {
  query: string;
  cursor?: string;
}

export const SEARCH_REPOSITORIES = gql`
  ${require("./searchRepositories.graphql").default}
`;
