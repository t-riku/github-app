import { useQuery } from "@apollo/client";
import ReactLoading from "react-loading";
import { format } from "timeago.js";
import styles from "./RepositoryIssues.module.scss";
import Link from "next/link";
import { GetIssuesQuery, GetIssuesDocument } from "../../generated/graphql";

type RepositoryIssuesProps = {
  id: string;
  setSelectedRepo: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function RepositoryIssues({
  id,
  setSelectedRepo,
}: RepositoryIssuesProps) {
  const { loading, error, data, fetchMore } = useQuery<GetIssuesQuery>(
    GetIssuesDocument,
    {
      variables: { id },
    }
  );

  const handleClick = () => {
    setSelectedRepo(null);
  };

  type GetIssuesQueryResult = {
    node: {
      __typename: "Repository";
      issues: {
        totalCount: number;
        edges: Array<{
          node: {
            id: string;
            title: string;
            url: string;
            updatedAt: string;
            state: string;
            author: { login: string };
            comments: { totalCount: number };
          };
        }>;
        pageInfo: {
          endCursor: string;
          hasNextPage: boolean;
        };
      };
    } | null;
  };

  function isRepository(
    node: GetIssuesQueryResult["node"]
  ): node is GetIssuesQueryResult["node"] & {
    issues: {
      totalCount: number;
      edges: Array<{
        node: {
          id: string;
          title: string;
          url: string;
          updatedAt: string;
          state: string;
          author: { login: string };
          comments: { totalCount: number };
        };
      }>;
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  } {
    if (node?.__typename === "Repository" && !!node.issues) {
      node.issues;
    }
    return node?.__typename === "Repository" && !!node.issues;
  }

  const pickIssues = (issue: GetIssuesQuery | undefined) => {
    if (issue?.node?.__typename === "Repository") {
      return issue.node.issues;
    }
    return undefined;
  };

  const handleLoadMore = () => {
    const node = data?.node;

    const issues = pickIssues(data);
    console.log("issues", issues);

    if (true) {
      fetchMore({
        variables: { cursor: issues?.pageInfo?.endCursor },
        updateQuery: (previousResult: GetIssuesQuery, { fetchMoreResult }) => {
          if (!fetchMoreResult?.node) {
            return previousResult;
          }

          console.log("fetchMoreResult", fetchMoreResult);

          const newIssues = pickIssues(fetchMoreResult)?.edges ?? [];
          const pageInfo = pickIssues(fetchMoreResult)?.pageInfo;

          return {
            node: {
              ...previousResult.node,
              issues: {
                ...pickIssues(previousResult),
                totalCount: pickIssues(fetchMoreResult)?.totalCount ?? 0,
                pageInfo: pageInfo,
                edges: [
                  ...(pickIssues(previousResult)?.edges ?? []),
                  ...(newIssues ?? []),
                ],
              },
            },
          };
        },
      });
    }
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
        <p className="errorTxt">Sorry, there&apos;s been an error...</p>
      )}
      {data && (
        <>
          <div>
            {/* {data?.node?.filter(isRepository) && data.node?.issues.totalCount === 0 ? ( */}
            {data?.node?.__typename === "Repository" &&
            data.node?.issues.totalCount === 0 ? (
              <div>
                <button onClick={handleClick} className={styles.backBtn}>
                  {"<"} Back
                </button>
                <div className={styles.noHitTxt}>
                  <p>
                    issueがみつかりませんでした。
                    <br />
                    左上のBackボタンからrepository一覧ページに戻れます。
                  </p>

                  <br />
                  <p>参考 : ⭐️数が多いrepositoryは比較的issue数が多いです!</p>
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.issuesFlex}>
                  <button onClick={handleClick} className={styles.backBtn}>
                    {"<"} Back
                  </button>
                  <p className={styles.hitNum}>
                    <span>{data.node?.issues.totalCount}</span>
                    件のissueが見つかりました!
                  </p>
                  <p className={styles.clickDesc}>
                    ↓下記のissueをクリックするとGithubの詳しいissueページにリンクします
                  </p>
                </div>

                <ul className={styles.viewer}>
                  {data?.node?.__typename === "Repository" &&
                    data.node.issues.edges?.map((issue) => (
                      <>
                        {issue?.node && (
                          <Link
                            href={issue.node.url}
                            key={issue.node.id}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <li className={styles.viewer_flex}>
                              <div className={styles.data_left}>
                                <p className={styles.name}>
                                  {issue.node.title}
                                </p>
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
                        )}
                      </>
                    ))}
                </ul>
              </div>
            )}
          </div>

          {data &&
            data?.node?.__typename === "Repository" &&
            data.node.issues.pageInfo.hasNextPage && (
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
