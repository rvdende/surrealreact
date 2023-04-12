import Link from "next/link";
import { useRouter } from "next/router";
import { HiXMark } from "react-icons/hi2";
import { getSurreal, useAppState } from "../../state/useAppState";

import DialogModal from "../DialogModal";
import { DefineLogin } from "./DefineLogin";
import { DefineScopes } from "./DefineScopes";
import { DefineTable } from "./DefineTable";
import { dbSlugs, TreeItemContent } from "./TreeStructure";
import { User } from "./User";

export function DBView() {
  const appstate = useAppState();
  const router = useRouter();
  const slugs = dbSlugs(router.query.slug);

  // const nsinfo = appstate.info_ns.find((i) => i.ns === slugs.ns)?.nsinfo;

  if (!slugs.ns || !slugs.db) return null;

  const dbinfo = appstate.info_db.find(
    (i) => i.ns === slugs.ns && i.db === slugs.db
  )?.dbinfo;

  return (
    <div className="paper ml-0 flex flex-col gap-4 md:ml-3">
      <section className="mb-0 flex flex-row gap-4 pb-0">
        <Link href={`/ns/${slugs.ns}`}>
          <button>
            <TreeItemContent
              text={slugs.ns}
              type="ns"
              className="flex-0 pl-1"
            />
          </button>
        </Link>
        <TreeItemContent text={slugs.db} type="db" className="flex-0 pl-1" />
        <div className="flex-1" />

        <DialogModal
          buttonContents={
            <>
              <HiXMark className="icon" />
              Delete
            </>
          }
        >
          <div className=" p-4 text-lg font-bold ">
            Are you sure you want to delete this Data Base
          </div>
          <button
            className="inline-flex rounded border border-transparent bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 hover:text-red-500"
            onClick={() => {
              if (!slugs.ns) return;
              if (!slugs.db) return;

              getSurreal()
                .use(slugs.ns, slugs.db)
                .querySimple(`REMOVE DATABASE ${slugs.db} `)
                .catch((err) => {
                  console.log(err);
                })
                .finally(() => {
                  if (!slugs.ns) return;
                  router.push(`/ns/${slugs.ns}`).catch(console.error);
                  appstate.update().catch(console.error);
                });
            }}
          >
            Confirm
          </button>
        </DialogModal>
      </section>

      <DefineTable ns={slugs.ns} db={slugs.db} />

      <DefineScopes ns={slugs.ns} db={slugs.db} />

      <section className="paper ">
        <h3>Users</h3>
        <DefineLogin ns={slugs.ns} db={slugs.db} />
        <div className="flex flex-col gap-1 ">
          {dbinfo &&
            Object.entries(dbinfo.dl).map(([username]) => {
              if (!slugs.ns || !slugs.db) return;
              return (
                <User
                  key={username}
                  username={username}
                  ns={slugs.ns}
                  db={slugs.db}
                  className="text-sky-400"
                />
              );
            })}
        </div>
      </section>

      <section className="paper p-0">
        <pre>{JSON.stringify(dbinfo, null, 2)}</pre>
      </section>
    </div>
  );
}
