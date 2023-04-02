import clsx from "clsx";
import { useRouter } from "next/router";
import { useAppState } from "../../state/useAppState";
import { DBView } from "./DBView";
import { NSView } from "./NSView";
import { Table } from "./Table";
import { TreeStructure } from "./TreeStructure";
import { ViewTB } from "./ViewTB";

export function Explorer() {
  const router = useRouter();

  const appstate = useAppState();

  // const [hideTree, setHideTree] = useState<boolean>(false);

  const [ns, db, tb] = Array.isArray(router.query.slug)
    ? router.query.slug
    : [];

  const showTable = ns && db && tb;
  const showNS = ns && !db && !tb;
  const showDB = ns && db && !tb;

  const onLandingPage = router.pathname === "/";

  return (
    <>
      <section className="grid grid-cols-12 px-3">
        {!appstate.treeHidden && (
          <TreeStructure
            className={clsx(
              !onLandingPage && "hidden md:block", //hidden on mobile on sub pages
              "col-span-full md:col-span-4 lg:col-span-3 xl:col-span-2"
            )}
          />
        )}

        <div
          className={clsx(
            appstate.treeHidden
              ? "col-span-full"
              : "col-span-full md:col-span-8 lg:col-span-9 xl:col-span-10"
          )}
        >
          {onLandingPage && (
            <div className="paper ml-0 flex flex-col gap-3 md:ml-3">
              <h1>Hi there!</h1>
              <hr />
              <p>Thank you for using SurrealReact</p>
            </div>
          )}

          {showNS && <NSView />}

          {showDB && <DBView />}

          {showTable && <ViewTB />}
        </div>
      </section>
    </>
  );
}
