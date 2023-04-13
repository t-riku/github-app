import { gql } from "@apollo/client";

export interface IssuesQuery {
  node: {
    __typename: "Repository";
    issues: {
      __typename: "IssueConnection";
      totalCount: number;
      pageInfo: {
        __typename: "PageInfo";
        hasNextPage: boolean;
        endCursor: string | null;
      };
      edges: Array<{
        __typename: "IssueEdge";
        node: {
          __typename: "Issue";
          id: string;
          title: string;
          url: string;
          updatedAt: string;
          state: "OPEN" | "CLOSED";
          author: {
            __typename: "User";
            login: string;
          } | null;
          comments: {
            __typename: "IssueCommentConnection";
            totalCount: number;
          };
        };
      }>;
    };
  } | null;
}

export interface IssuesQueryVariables {
  id: string;
  cursor?: string | null;
}

export const GET_ISSUES = gql`
  ${require("./getIssues.graphql").default}
`;
