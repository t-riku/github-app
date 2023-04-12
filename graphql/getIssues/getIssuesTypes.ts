import { gql } from "@apollo/client";

// export interface GetIssuesResult {
//   node: {
//     issues: {
//       totalCount: number;
//       pageInfo: {
//         hasNextPage: boolean;
//         endCursor: string | null;
//       };
//       edges: {
//         node: {
//           id: string;
//           title: string;
//           url: string;
//           updatedAt: string;
//           state: string;
//           author: {
//             login: string;
//           };
//           comments: {
//             totalCount: number;
//           };
//         };
//       }[];
//     } | null;
//   } | null;
// }

export interface GetIssuesVariables {
  id: string;
  cursor?: string;
}

export interface IssueNode {
  id: string;
  title: string;
  url: string;
  updatedAt: string;
  state: string;
  author: {
    login: string;
  };
  comments: {
    totalCount: number;
  };
}

export interface IssueEdge {
  node: IssueNode;
}

export interface IssuesData {
  totalCount: number;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
  edges: IssueEdge[];
}

export interface GetIssuesResult {
  node: {
    issues: IssuesData;
  } | null;
}

const GET_ISSUES = gql`
  ${require("./getIssues.graphql").default}
`;

export default GET_ISSUES;
