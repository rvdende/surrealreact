import Link from "next/link";
import { useRouter } from "next/router";
import { HiXMark } from "react-icons/hi2";
import { useAppState, getSurreal } from "../../state/useAppState";
import { Table } from "./Table";
import { dbSlugs, TreeItemContent } from "./TreeStructure";
import { editor } from "monaco-editor";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import DialogModal from "../DialogModal";

export function ViewTB() {
  const appstate = useAppState();
  const router = useRouter();
  const slugs = dbSlugs(router.query.slug);

  // const nsinfo = appstate.info_ns.find((i) => i.ns === slugs.ns)?.nsinfo;

  if (!slugs.ns || !slugs.db || !slugs.tb) return null;

  // const dbinfo = appstate.info_db.find(
  //   (i) => i.ns === slugs.ns && i.db === slugs.db
  // )?.dbinfo;

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
        <Link href={`/ns/${slugs.ns}/${slugs.db}`}>
          <button>
            <TreeItemContent
              text={slugs.db}
              type="db"
              className="flex-0 pl-1"
            />
          </button>
        </Link>
        <TreeItemContent text={slugs.tb} type="tb" className="flex-0 pl-1" />
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
            Are you shure you want to delete this Table
          </div>
          <button
            className="inline-flex rounded border border-transparent bg-red-500 px-4 py-2 text-sm font-bold text-white hover:bg-zinc-800 hover:text-red-500"
            onClick={() => {
              if (!slugs.ns) return;
              if (!slugs.db) return;
              if (!slugs.tb) return;
              getSurreal()
                .use(slugs.ns, slugs.db)
                .querySimple(`REMOVE TABLE ${slugs.tb} `)
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

      <Table />

      {appstate.activeRow &&
        appstate.activeRow.ns === slugs.ns &&
        appstate.activeRow.db === slugs.db &&
        appstate.activeRow.tb === slugs.tb && (
          <div className="h-40">
            <Editor
              // theme={props.isLight ? 'surrealist' : 'surrealist-dark'}
              value={appstate.activeRow.row}
              onChange={(e) => {
                if (!e) return;
                if (!appstate.activeRow) return;
                const updated = structuredClone(appstate.activeRow);
                updated.row = e;
                appstate.set({
                  activeRow: updated,
                });
              }}
              options={{
                // readOnly: true,
                minimap: { enabled: false },
                lineNumbers: "off",
              }}
              language="json"
            />
            <button
              className="primary"
              onClick={() => {
                if (!slugs.ns) return;
                if (!slugs.db) return;
                if (!appstate.activeRow) return;

                const parsed = JSON.parse(appstate.activeRow.row) as {
                  id: string;
                } & object;

                if (!parsed.id) return;

                getSurreal()
                  .use(slugs.ns, slugs.db)
                  .query(
                    `UPDATE ${parsed.id} CONTENT ${appstate.activeRow.row};`
                  )
                  .then(() => {
                    appstate.update().catch(console.error);
                  })
                  .catch(console.error);
              }}
            >
              save
            </button>
          </div>
        )}
    </div>
  );
}
