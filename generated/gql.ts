/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "query GetIssues($id: ID!, $cursor: String) {\n  node(id: $id) {\n    ... on Repository {\n      issues(first: 10, after: $cursor) {\n        totalCount\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        edges {\n          node {\n            id\n            title\n            url\n            updatedAt\n            state\n            author {\n              login\n            }\n            comments {\n              totalCount\n            }\n          }\n        }\n      }\n    }\n  }\n}": types.GetIssuesDocument,
    "query SearchRepositories($query: String!, $cursor: String) {\n  search(query: $query, type: REPOSITORY, last: 10, after: $cursor) {\n    repositoryCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      node {\n        ... on Repository {\n          id\n          name\n          url\n          description\n          stargazerCount\n          updatedAt\n        }\n      }\n    }\n  }\n}": types.SearchRepositoriesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetIssues($id: ID!, $cursor: String) {\n  node(id: $id) {\n    ... on Repository {\n      issues(first: 10, after: $cursor) {\n        totalCount\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        edges {\n          node {\n            id\n            title\n            url\n            updatedAt\n            state\n            author {\n              login\n            }\n            comments {\n              totalCount\n            }\n          }\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query GetIssues($id: ID!, $cursor: String) {\n  node(id: $id) {\n    ... on Repository {\n      issues(first: 10, after: $cursor) {\n        totalCount\n        pageInfo {\n          hasNextPage\n          endCursor\n        }\n        edges {\n          node {\n            id\n            title\n            url\n            updatedAt\n            state\n            author {\n              login\n            }\n            comments {\n              totalCount\n            }\n          }\n        }\n      }\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query SearchRepositories($query: String!, $cursor: String) {\n  search(query: $query, type: REPOSITORY, last: 10, after: $cursor) {\n    repositoryCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      node {\n        ... on Repository {\n          id\n          name\n          url\n          description\n          stargazerCount\n          updatedAt\n        }\n      }\n    }\n  }\n}"): (typeof documents)["query SearchRepositories($query: String!, $cursor: String) {\n  search(query: $query, type: REPOSITORY, last: 10, after: $cursor) {\n    repositoryCount\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      node {\n        ... on Repository {\n          id\n          name\n          url\n          description\n          stargazerCount\n          updatedAt\n        }\n      }\n    }\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;