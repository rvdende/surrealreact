import clsx from "clsx";
import { useRouter } from "next/router";
import { useAppState } from "../../state/useAppState";
import { DBView } from "./DBView";
import { NSView } from "./NSView";
import { Table } from "./Table";
import { Toolbar } from "./Toolbar";
import { TreeStructure } from "./TreeStructure";

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

  return (
    <>
      <Toolbar />

      <section className="mx-4 grid grid-cols-12">
        {!appstate.treeHidden && (
          <TreeStructure
            className={clsx(
              "col-span:6 md:col-span-4 lg:col-span-3 xl:col-span-2"
            )}
          />
        )}

        <div
          className={clsx(
            appstate.treeHidden
              ? "col-span-full"
              : "col-span-6 md:col-span-8 lg:col-span-9 xl:col-span-10"
          )}
        >
          {showNS && <NSView />}

          {showDB && <DBView />}

          {showTable && <Table />}
        </div>
      </section>
    </>
  );
}
