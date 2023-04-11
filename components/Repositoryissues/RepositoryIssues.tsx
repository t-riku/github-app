import { gql, useQuery } from "@apollo/client";
import ReactLoading from "react-loading";
import { format } from "timeago.js";
// import styles from "../../styles/Home.module.css";
import styles from "./RepositoryIssues.module.css";

const GET_ISSUES = gql`
  query GetIssues($id: ID!, $cursor: String) {
    node(id: $id) {
      ... on Repository {
        issues(last: 10, after: $cursor) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              createdAt
              updatedAt
              closedAt
              state
              author {
                login
              }
              comments {
                totalCount
              }
              labels(first: 5) {
                edges {
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// query GetIssuesWithPagination($owner: String!, $name: String!, $after: String, $first: Int!) {
//   repository(owner: $owner, name: $name) {
//     issues(first: $first, after: $after) {
//       edges {
//         cursor
//         node {
//           id
//           title
//           createdAt
//         }
//       }
//       pageInfo {
//         hasNextPage
//         endCursor
//       }
//     }
//   }
// }

export default function RepositoryIssues({ id, setSelectedRepo }: any) {
  const { loading, error, data, fetchMore } = useQuery(GET_ISSUES, {
    variables: { id },
  });

  const handleClick = () => {
    setSelectedRepo(null);
  };

  // const handleLoadMore = () => {
  //   if (!hasNextPage) return;

  //   fetchMore({
  //     variables: {
  //       after: endCursor,
  //     },
  //   });
  // };

  const handleLoadMore = () => {
    fetchMore({
      variables: { cursor: data.node.issues.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newIssues = fetchMoreResult.node.issues.edges;
        const pageInfo = fetchMoreResult.node.issues.pageInfo;

        return newIssues.length
          ? {
              search: {
                __typename: previousResult.node.edges.__typename,
                repositoryCount: previousResult.node.issues.totalCount,
                pageInfo: pageInfo,
                edges: [...previousResult.node.edges.edges, ...newIssues],
              },
            }
          : previousResult;
      },
    });
  };

  return (
    <div>
      {loading && (
        <ReactLoading
          type="bubbles"
          color="black"
          height="50px"
          width="50px"
          className="mx-auto"
        />
      )}
      {error && (
        <p className={styles.errorTxt}>Sorry, there&apos;s been an error...</p>
      )}
      {data && (
        <>
          <div className="">
            <button onClick={handleClick} className={styles.searchBtn}>
              - Back To Repository page
            </button>
            <p className={styles.hitNum}>
              <span>{data.node.issues.totalCount}</span>
              件のissueが見つかりました!
            </p>
          </div>
          <ul className={styles.viewer}>
            {data.node.issues.edges.map((issue: any) => (
              <li key={issue.node.id} className={styles.viewer_flex}>
                <div className={styles.data_left}>
                  <p>{issue.node.title}</p>
                  <p className={styles.desc}>
                    author;{issue.node.author.login}
                  </p>
                  <p className={styles.desc}>state : {issue.node.state}</p>
                  <p className={styles.stargazer}>
                    📝 : {issue.node.comments.totalCount}
                  </p>
                  {/* <p>{issue.node.labels.edges.node.name}</p> */}
                </div>
                <div className={styles.data_right}>
                  {/* <p className={styles.updatedDay}>{format(issue.createdAt)}</p> */}
                  <p className={styles.updatedDay}>{format(issue.updatedAt)}</p>
                  {/* <p className={styles.updatedDay}>{format(issue.closedAt)}</p> */}
                </div>
              </li>
            ))}
          </ul>

          {data && data.node.issues.pageInfo.hasNextPage && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className={styles.loadBtn}
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}
