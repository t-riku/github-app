import Head from "next/head";
import Image from "next/image";
import { gql, useLazyQuery } from "@apollo/client";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { DiGithubFull } from "react-icons/di";
import { MdClear } from "react-icons/md";
import ReactLoading from "react-loading";
import { format } from "timeago.js";
import RepositoryIssues from "../components/Repositoryissues/RepositoryIssues";

const SEARCH_REPOSITORIES = gql`
  query SearchRepositories($query: String!, $cursor: String) {
    search(query: $query, type: REPOSITORY, last: 10, after: $cursor) {
      repositoryCount
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          ... on Repository {
            id
            name
            url
            description
            stargazerCount
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export default function Home() {
  // クエリを保持する環境変数
  const [query, setQuery] = useState("");
  // ボタンで発火させるためにuseLazyQueryを使う
  const [searchRepositories, { loading, error, data, fetchMore }] =
    useLazyQuery(SEARCH_REPOSITORIES);

  // 選択したリポジトリを保持する環境変数
  const [selectedRepo, setSelectedRepo] = useState(null);

  // const { loading, error, data } = useLazyQuery(SEARCH_REPOSITORIES);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // コンポーネントの切り替えをするために
    setSelectedRepo(null);
    // searchRepositories 関数を呼び出すと、クエリが実行されます。クエリの変数は、 variables オブジェクトを渡して渡される
    searchRepositories({ variables: { query } });
  };

  const handleLoadMore = () => {
    fetchMore({
      variables: { cursor: data.search.pageInfo.endCursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newRepositories = fetchMoreResult.search.edges;
        const pageInfo = fetchMoreResult.search.pageInfo;

        return newRepositories.length
          ? {
              search: {
                __typename: previousResult.search.__typename,
                repositoryCount: previousResult.search.repositoryCount,
                pageInfo: pageInfo,
                edges: [...previousResult.search.edges, ...newRepositories],
              },
            }
          : previousResult;
      },
    });
  };

  const handleClearBtn = () => {
    setQuery("");
  };

  const handleRepoClick = (id: any) => {
    setSelectedRepo(id);
  };

  return (
    <div className={styles.home}>
      <Head>
        <title>Github App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1 className={styles.title}>Github Repository Viewer!</h1>
        <Link
          href="https://github.com/t-riku/github-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.animateGithub}>
            <DiGithubFull className={styles.textGithub} />
            <div className={styles.circle01}></div>
            <div className={styles.circle02}></div>
            <div className={styles.circle03}></div>
          </div>
        </Link>
      </header>

      <main className={styles.main}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.searchFrame}>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={styles.input}
            />
            <MdClear className={styles.clearBtn} onClick={handleClearBtn} />
          </div>

          <button
            type="submit"
            className={styles.searchBtn}
            // onClick={handleClearBtn}
          >
            Search
          </button>
        </form>
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
          <p className={styles.errorTxt}>
            Sorry, there&apos;s been an error...
          </p>
        )}
        {data && selectedRepo === null && (
          <div>
            <p className={styles.hitNum}>
              <span>{data.search.repositoryCount}</span>件ヒットしました！
            </p>
            <ul className={styles.viewer}>
              {data.search.edges.map(({ node }: any) => (
                <li key={node.id}>
                  <div
                    onClick={() => handleRepoClick(node.id)}
                    className={styles.viewer_flex}
                  >
                    <div className={styles.data_left}>
                      <p className={styles.name}> {node.name}</p>
                      {node.description ? (
                        <p className={styles.desc}>📄 : {node.description}</p>
                      ) : (
                        <p className={styles.noDesc}>
                          📄 : descriptionは設定されていません。
                        </p>
                      )}
                      <p className={styles.stargazer}>
                        ⭐️ : {node.stargazerCount}
                      </p>
                      {/* <Link href={node.url}>
                        <DiGithubFull className={styles.githubUrl} />
                      </Link> */}
                    </div>

                    <div className={styles.data_right}>
                      <p className={styles.updatedDay}>
                        {format(node.updatedAt)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {/* {selectedRepo && <RepositoryIssues id={selectedRepo} />} */}

            {data && data.search.pageInfo.hasNextPage && (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={styles.loadBtn}
              >
                Load More
              </button>
            )}
          </div>
        )}

        {selectedRepo && (
          <RepositoryIssues
            id={selectedRepo}
            setSelectedRepo={setSelectedRepo}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
        <p>created with Nextjs, Typescript and GitHub GraphQL API</p>
      </footer>
    </div>
  );
}
