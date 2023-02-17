import { type AppType } from "next/dist/shared/lib/utils";
import { Roboto } from "@next/font/google";

import "../styles/globals.css";
import { Footer } from "../components/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAppState } from "../state/useAppState";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

const MyApp: AppType = ({ Component, pageProps }) => {
  const [loaded, loaded_set] = useState(false);

  const connected = useAppState((s) => s.connected);
  const router = useRouter();

  useEffect(() => {
    console.log("effect...");
    if (!loaded) loaded_set(true);
    if (connected === false) {
      console.log(router.pathname);
      if (router.pathname === "/") return;
      void router.push("/");
    }
  }, [loaded, connected, router]);

  return (
    <div className={roboto.className}>
      {loaded && <Component {...pageProps} />}
    </div>
  );
};

export default MyApp;
