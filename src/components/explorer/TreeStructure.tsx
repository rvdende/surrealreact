import { useAppState } from "../../state/useAppState";
import {
  BiChevronDown,
  BiChevronUp,
  BiData,
  BiServer,
  BiShield,
  BiTable,
} from "react-icons/bi";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserCount } from "./UserCount";
import { ReactNode } from "react";
import { SurrealType } from "../../surrealdbjs/surreal_zod_info";

export function TreeStructure({ className }: { className: string }) {
  const appstate = useAppState();
  const slug = useRouter().query.slug;

  return (
    <section className={clsx("mt-0 flex flex-col", className)}>
      {appstate.info_kv?.ns &&
        Object.keys(appstate.info_kv.ns).map((ns, v) => {
          const nsinfo = appstate.info_ns.find((i) => i.ns === ns)?.nsinfo;
          if (!nsinfo) return null;

          const ns_href = `/ns/${ns}`;
          const ns_expanded = appstate.treeUIdata[ns_href]?.collapsed ?? true;

          return (
            <div key={`ns${v}${ns}`} className={"flex flex-col "}>
              <TreeItem
                active={isActive(slug, ns)}
                type="ns"
                text={ns}
                href={ns_href}
              >
                <UserCount count={nsinfo ? Object.keys(nsinfo.nl).length : 0} />
              </TreeItem>

              {ns_expanded &&
                Object.keys(nsinfo.db).map((db, i) => {
                  const dbinfo = appstate.info_db.find(
                    (i) => i.ns === ns && i.db === db
                  )?.dbinfo;

                  if (!dbinfo) return null;

                  const db_href = `/ns/${ns}/${db}`;
                  const db_expanded =
                    appstate.treeUIdata[db_href]?.collapsed ?? true;

                  return (
                    <div key={`${ns}_${db}_${i}`} className={"flex flex-col"}>
                      <TreeItem
                        text={db}
                        key={`db${i}_${ns}_${db}`}
                        href={db_href}
                        active={isActive(slug, ns, db)}
                        type="db"
                      >
                        <UserCount count={Object.keys(dbinfo.dl).length} />
                      </TreeItem>

                      {db_expanded &&
                        dbinfo &&
                        Object.keys(dbinfo.sc).map((sc, x) => (
                          <TreeItem
                            key={`sc${i}_${x}_${ns}_${db}_${sc}`}
                            active={isActive(slug, ns, db, sc)}
                            type="sc"
                            text={sc}
                            href={`/ns/${ns}/${db}/${sc}`}
                          />
                        ))}

                      {db_expanded &&
                        dbinfo &&
                        Object.keys(dbinfo.tb).map((tb, y) => (
                          <TreeItem
                            key={`tb${i}_${y}_${ns}_${db}_${tb}`}
                            type="tb"
                            active={isActive(slug, ns, db, tb)}
                            text={tb}
                            href={`/ns/${ns}/${db}/${tb}`}
                          />
                        ))}
                    </div>
                  );
                })}
            </div>
          );
        })}
    </section>
  );
}

function TreeItem({
  href,
  text,
  active,
  children,
  type,
}: {
  href: string;
  text: string;
  active: boolean;
  children?: ReactNode;
  type: SurrealType;
}) {
  // const [expanded, setExpanded] = useState(false);
  const appstate = useAppState();

  const expanded = appstate.treeUIdata[href]?.collapsed ?? false;

  const pl = {
    ns: "pl-0",
    db: "pl-3",
    tb: "pl-6",
    sc: "pl-6",
  }[type];

  const showTreeCollapseButton = {
    ns: true,
    db: true,
    tb: false,
    sc: false,
  }[type];

  return (
    <Link href={href} className={clsx(pl)}>
      <button className={clsx("mb-1 w-full", active ? "active" : " ")}>
        <TreeItemContent text={text} type={type} className="flex-1">
          {children}

          {showTreeCollapseButton && (
            <TreeCollapseButton
              value={expanded}
              onChange={() => {
                appstate.set({
                  treeUIdata: {
                    ...appstate.treeUIdata,
                    [href]: { collapsed: !expanded },
                  },
                });
              }}
            />
          )}
        </TreeItemContent>
      </button>
    </Link>
  );
}

export function TreeItemContent({
  text,
  children,
  type,
  className,
}: {
  text: string;
  children?: ReactNode;
  className?: string;
  type: SurrealType;
}) {
  const icon = {
    ns: <BiServer className="icon" />,
    db: <BiData className="icon" />,
    tb: <BiTable className="icon" />,
    sc: <BiShield className="icon" />,
  }[type];

  const color = {
    ns: "text-green-400 hover:text-green-400",
    db: "text-sky-400 hover:text-sky-300",
    tb: "text-pink-600 hover:text-pink-500",
    sc: "text-amber-500 hover:text-amber-400",
  }[type];

  return (
    <div className={clsx("flex flex-row gap-2", color, className)}>
      {icon}
      <div className="flex-1 self-center text-left text-xs">{text}</div>
      {children}
    </div>
  );
}

/////////////////

export function dbSlugs(query: string | string[] | undefined) {
  const [slug_ns, slug_db, slug_tb] = Array.isArray(query) ? query : [];
  return { ns: slug_ns, db: slug_db, tb: slug_tb };
}

export function isActive(
  query: string | string[] | undefined,
  ns?: string,
  db?: string,
  tb?: string
) {
  // const [slug_ns, slug_db, slug_tb] = Array.isArray(query) ? query : [];
  const slugs = dbSlugs(query);

  return slugs.ns === ns && slugs.db === db && slugs.tb === tb;
}

function TreeCollapseButton({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div
      className="button m-0 rounded-full bg-transparent p-0 text-gray-500"
      onClick={(e) => {
        if (value === true) e.preventDefault();
        onChange(!value);
      }}
    >
      {value ? (
        <BiChevronUp className="icon" />
      ) : (
        <BiChevronDown className="icon" />
      )}
    </div>
  );
}
