import { useQuery } from "@apollo/client";
import ReactLoading from "react-loading";
import { format } from "timeago.js";
import styles from "./RepositoryIssues.module.css";
import Link from "next/link";
import {
  GET_ISSUES,
  IssuesQuery,
  IssuesQueryVariables,
} from "../../graphql/getIssues/getIssuesTypes";

export default function RepositoryIssues({ id, setSelectedRepo }: any) {
  const { loading, error, data, fetchMore } = useQuery(GET_ISSUES, {
    variables: { id },
  });

  const handleClick = () => {
    setSelectedRepo(null);
  };

  const handleLoadMore = () => {
    fetchMore<IssuesQuery, IssuesQueryVariables>({
      variables: { cursor: data?.node?.issues?.pageInfo?.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (!previousResult || !fetchMoreResult?.node?.issues?.edges) {
          return {};
        }

        const newIssues = fetchMoreResult?.node?.issues?.edges;
        const pageInfo = fetchMoreResult?.node?.issues?.pageInfo;

        return newIssues?.length
          ? {
              node: {
                __typename: previousResult.node?.__typename,
                issues: {
                  __typename: previousResult.node?.issues?.__typename,
                  totalCount: fetchMoreResult.node.issues.totalCount,
                  pageInfo: pageInfo,
                  edges: [
                    ...(previousResult?.node?.issues?.edges ?? []),
                    ...(newIssues ?? []),
                  ],
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
          <div>
            <div>
              {data.node.issues.totalCount === 0 ? (
                <div>
                  <button onClick={handleClick} className={styles.backBtn}>
                    {"<"} Back
                  </button>
                  <p className={styles.hitNum}>
                    issueがみつかりませんでした。
                    <br />
                    左上のBackボタンからrepository一覧ページに戻れます。
                    <br />
                    参考 : ⭐️数が多いrepositoryは比較的issue数が多いです!
                  </p>
                </div>
              ) : (
                <div>
                  <div className={styles.issuesFlex}>
                    <button onClick={handleClick} className={styles.backBtn}>
                      {"<"} Back
                    </button>
                    <p className={styles.hitNum}>
                      <span>{data.node.issues.totalCount}</span>
                      件のissueが見つかりました!
                    </p>
                    <p className={styles.clickDesc}>
                      ↓下記のissueをクリックするとGithubの詳しいissueページにリンクします
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
                            <p className={styles.name}>{issue.node.title}</p>
                            {issue.node.author ? (
                              <p className={styles.desc}>
                                👤 : {issue.node.author.login}
                              </p>
                            ) : (
                              ""
                            )}
                            {issue.node.state === "OPEN" ? (
                              <p className={styles.state}>
                                🟢 : {issue.node.state}
                              </p>
                            ) : (
                              <p className={styles.state}>
                                🔴 : {issue.node.state}
                              </p>
                            )}

                            <p className={styles.stargazer}>
                              💬 : {issue.node.comments.totalCount}
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
                </div>
              )}
            </div>
          </div>

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
