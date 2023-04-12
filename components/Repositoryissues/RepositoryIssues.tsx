import { useQuery } from "@apollo/client";
import ReactLoading from "react-loading";
import { format } from "timeago.js";
import styles from "./RepositoryIssues.module.css";
import Link from "next/link";
import GET_ISSUES from "../../graphql/getIssues/getIssuesTypes";
import { GetIssuesResult } from "../../graphql/getIssues/getIssuesTypes";

export default function RepositoryIssues({ id, setSelectedRepo }: any) {
  const { loading, error, data, fetchMore } = useQuery<GetIssuesResult>(
    GET_ISSUES,
    {
      variables: { id },
    }
  );

  const handleClick = () => {
    setSelectedRepo(null);
  };

  // const handleLoadMore = () => {
  //   fetchMore({
  //     variables: { cursor: data.node.issues.pageInfo.endCursor },
  //     updateQuery: (previousResult, { fetchMoreResult }) => {
  //       const newIssues = fetchMoreResult.node.issues.edges;
  //       const pageInfo = fetchMoreResult.node.issues.pageInfo;

  //       return newIssues.length
  //         ? {
  //             node: {
  //               __typename: previousResult.node.__typename,
  //               issues: {
  //                 __typename: previousResult.node.issues.__typename,
  //                 totalCount: fetchMoreResult.node.issues.totalCount,
  //                 pageInfo: pageInfo,
  //                 edges: [...previousResult.node.issues.edges, ...newIssues],
  //               },
  //             },
  //           }
  //         : previousResult;
  //     },
  //   });
  // };

  // type FetchMoreResult = {
  //   node: {
  //     issues: {
  //       pageInfo: {
  //         endCursor: string;
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
  //     };
  //   };
  // };

  type PreviousResult = {
    node: {
      __typename: string;
      issues: {
        __typename: string;
        totalCount: number;
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
        edges: {
          node: {
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
          };
        }[];
      };
    };
  };

  const handleLoadMore = () => {
    fetchMore<GetIssuesResult, { cursor: string }>({
      variables: { cursor: data?.node?.issues?.pageInfo?.endCursor },
      updateQuery: (
        previousResult: PreviousResult | null | undefined,
        { fetchMoreResult }
      ) => {
        if (!previousResult || !fetchMoreResult?.node?.issues?.edges) {
          return {};
        }

        const newIssues = fetchMoreResult?.node?.issues?.edges;
        const pageInfo = fetchMoreResult?.node?.issues?.pageInfo;

        return newIssues?.length
          ? {
              node: {
                __typename: previousResult.node.__typename,
                issues: {
                  __typename: previousResult.node.issues.__typename,
                  totalCount: fetchMoreResult.node.issues.totalCount,
                  pageInfo: pageInfo,
                  edges: [...previousResult.node.issues.edges, ...newIssues],
                },
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
              <Link
                href={issue.node.url}
                key={issue.node.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                <li className={styles.viewer_flex}>
                  <div className={styles.data_left}>
                    <p>{issue.node.title}</p>
                    {issue.node.author.login ? (
                      <p className={styles.desc}>
                        author;{issue.node.author.login}
                      </p>
                    ) : (
                      ""
                    )}
                    <p className={styles.desc}>state : {issue.node.state}</p>
                    <p className={styles.stargazer}>
                      📝 : {issue.node.comments.totalCount}
                    </p>
                  </div>
                  <div className={styles.data_right}>
                    <p className={styles.updatedDay}>
                      {format(issue.node.updatedAt)}
                    </p>
                  </div>
                </li>
              </Link>
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
