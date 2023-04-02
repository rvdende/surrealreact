import { type NextPage } from "next";
import Head from "next/head";
import { Explorer } from "../components/explorer/Explorer";
import { Navbar } from "../components/navbar";
import { Signin } from "../components/signin";
import { useAppState } from "../state/useAppState";

const Home: NextPage = () => {
  const appstate = useAppState();
  return (
    <>
      <Head>
        <title>SurrealReact</title>
        <meta name="description" content="SurrealDB explorer with nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {appstate.connected ? (
          <>
            <Navbar />
            <Explorer />
          </>
        ) : (
          <Signin />
        )}
      </main>
    </>
  );
};

export default Home;
