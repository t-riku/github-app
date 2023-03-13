import Link from "next/link";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

type Items = {
  id: string;
  __typename: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  url?: string;
};

// post：getStaticPropsから取得したデータ
export default ({ items }: any) => {
  return (
    <div>
      <div className="detail-container">
        <h3>Welcome to REST details page</h3>
        <p>id: {items.id}</p>
        <p>name: {items.name}</p>
        <p>description: {items.description}</p>
        <p>url: {items.url}</p>
        <p>createdAt: {items.createdAt}</p>
        <p>updatedAt: {items.updatedAt}</p>
      </div>
      <Link href={"/"}>Back</Link>
    </div>
  );
};

// const httpLink = createHttpLink({
//   uri: "https://api.github.com/graphql/",
// });

// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: {
//       ...headers,
//       authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
//     },
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

export const getStaticPaths = async () => {
  // 外部APIエンドポイントを呼び出しデータ取得
  const httpLink = createHttpLink({
    uri: "https://api.github.com/graphql",
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      {
        user(login: "t-riku") {
          repositories(last: 20) {
            nodes {
              id
            }
          }
        }
      }
    `,
  });

  const { user } = data;
  const items = user.repositories.nodes.map((edge: Items) => edge);

  // 事前ビルドしたいパスを指定
  const paths = items.map((item: any) => ({
    params: {
      // ファイル名と合わせる ※文字列指定
      id: item.id.toString(),
    },
  }));
  // paths：事前ビルドするパス対象を指定するパラメータ
  // fallback：事前ビルドしたパス以外にアクセスしたときのパラメータ true:カスタム404Pageを表示 false:404pageを表示
  return { paths, fallback: false };
};

// paramsには上記pathsで指定した値が入る（1itemずつ）
export const getStaticProps = async ({ params }: any) => {
  console.log(params);
  const variables = {
    id: params.id,
  };

  const httpLink = createHttpLink({
    uri: `https://api.github.com/graphql`,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      {
        user(login: "t-riku") {
          name
          url
          repositories(last: 20) {
            totalCount
            nodes {
              id
              name
              description
              createdAt
              updatedAt
              url
            }
          }
        }
      }
    `,
    variables: variables,
  });

  const { user } = data;
  const items = user.repositories.nodes.map((edge: Items) => edge);
  // const issues = user.repositories.milestone.issues.noeds.map(
  //   (edge: Items) => edge
  // );

  return {
    props: {
      items,
      // issues,
    },
  };
};
