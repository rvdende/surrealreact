import { useRouter } from "next/router";
import {
  authtype_calc,
  getSurreal,
  useAppState,
} from "../../state/useAppState";
import { DefineDatabase } from "./DefineDatabase";
import { DefineLogin } from "./DefineLogin";
import { dbSlugs, TreeItemContent } from "./TreeStructure";
import { User } from "./User";
import DialogModal from "../DialogModal";
import { HiXMark } from "react-icons/hi2";

export function NSView() {
  const appstate = useAppState();
  const router = useRouter();
  const slugs = dbSlugs(router.query.slug);
  const nsinfo = appstate.info_ns.find((i) => i.ns === slugs.ns)?.nsinfo;
  if (!slugs.ns) return <span>ns error</span>;

  return (
    <div className="paper ml-0 flex flex-col gap-4 md:ml-3">
      <section className="mb-0 flex flex-row gap-4 pb-0">
        <TreeItemContent text={slugs.ns} type="ns" className="pl-1" />

        <div className="flex-1" />

        <DialogModal
          buttonContents={
            <>
              <HiXMark className="icon" />
              Delete
            </>
          }
        >
          <button
            className="inline-flex rounded border border-transparent bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 hover:text-red-500"
            onClick={() => {
              if (!slugs.ns) return;

              getSurreal()
                .use(slugs.ns)
                .querySimple(`REMOVE NAMESPACE ${slugs.ns} `)
                .catch((err) => {
                  console.log(err);
                })
                .finally(() => {
                  if (!slugs.ns) return;
                  router.push(`/`).catch(console.error);
                  appstate.update().catch(console.error);
                });
            }}
          >
            Confirm
          </button>
        </DialogModal>
      </section>

      <hr />

      <section className="px-4">
        {authtype_calc(appstate.credentials) === "root" && (
          <DefineLogin ns={slugs.ns} />
        )}

        <div className="grid grid-flow-row grid-cols-4 gap-4 pt-4">
          {nsinfo &&
            Object.entries(nsinfo.nl).map(([username, definition]) => {
              if (!slugs.ns) return;
              return (
                <User
                  key={username}
                  username={username}
                  ns={slugs.ns}
                  className="text-green-400"
                />
              );
            })}
        </div>
      </section>

      <hr />

      <DefineDatabase ns={slugs.ns} />

      <section className="">
        <pre>{JSON.stringify(nsinfo, null, 2)}</pre>
      </section>
    </div>
  );
}
