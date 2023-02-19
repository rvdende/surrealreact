import Link from "next/link";
import { useRouter } from "next/router";
import { FaTimes } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { useAppState, getSurreal } from "../../state/useAppState";
import { Table } from "./Table";
import { dbSlugs, TreeItemContent } from "./TreeStructure";

export function ViewTB() {
  const appstate = useAppState();
  const router = useRouter();
  const slugs = dbSlugs(router.query.slug);

  const nsinfo = appstate.info_ns.find((i) => i.ns === slugs.ns)?.nsinfo;

  if (!slugs.ns || !slugs.db || !slugs.tb) return null;

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
        <button
          className="delete"
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
          <HiXMark className="icon" />
        </button>
      </section>

      <Table />
    </div>
  );
}
