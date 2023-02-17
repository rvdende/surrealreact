import { useAppState } from "../../state/useAppState";
import { BiData, BiServer, BiShield, BiTable } from "react-icons/bi";
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
    <section className={clsx("panel mt-0 flex flex-col gap-0.5", className)}>
      {appstate.info_kv?.ns &&
        Object.keys(appstate.info_kv.ns).map((ns, v) => {
          const nsinfo = appstate.info_ns.find((i) => i.ns === ns)?.nsinfo;
          if (!nsinfo) return null;
          return (
            <div key={`ns${v}${ns}`} className={"flex flex-col gap-0.5 "}>
              <TreeItem
                active={isActive(slug, ns)}
                type="ns"
                text={ns}
                href={`/ns/${ns}`}
              >
                <UserCount count={nsinfo ? Object.keys(nsinfo.nl).length : 0} />
              </TreeItem>

              {Object.keys(nsinfo.db).map((db, i) => {
                const dbinfo = appstate.info_db.find(
                  (i) => i.ns === ns && i.db === db
                )?.dbinfo;

                if (!dbinfo) return null;

                return (
                  <div
                    key={`${ns}_${db}_${i}`}
                    className={"flex flex-col gap-0.5"}
                  >
                    <TreeItem
                      text={db}
                      key={`db${i}_${ns}_${db}`}
                      href={`/ns/${ns}/${db}`}
                      classNameWrap="ml-3.5"
                      active={isActive(slug, ns, db)}
                      type="db"
                    >
                      <UserCount count={Object.keys(dbinfo.dl).length} />
                    </TreeItem>

                    {dbinfo &&
                      Object.keys(dbinfo.sc).map((sc, x) => (
                        <TreeItem
                          key={`sc${i}_${x}_${ns}_${db}_${sc}`}
                          active={isActive(slug, ns, db, sc)}
                          type="sc"
                          classNameWrap="ml-7"
                          text={sc}
                          href={`/ns/${ns}/${db}/${sc}`}
                        />
                      ))}

                    {dbinfo &&
                      Object.keys(dbinfo.tb).map((tb, y) => (
                        <TreeItem
                          key={`tb${i}_${y}_${ns}_${db}_${tb}`}
                          type="tb"
                          active={isActive(slug, ns, db, tb)}
                          classNameWrap="ml-7"
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
  classNameWrap,
  type,
}: {
  href: string;
  text: string;
  active: boolean;
  children?: ReactNode;
  classNameWrap?: string;
  type: SurrealType;
}) {
  return (
    <Link href={href} className={classNameWrap}>
      <button
        className={clsx(
          "flex w-full flex-row justify-start",
          active ? "active" : " "
        )}
      >
        <TreeItemContent text={text} type={type}>
          {children}
        </TreeItemContent>
      </button>
    </Link>
  );
}

export function TreeItemContent({
  text,
  children,
  className,
  type,
}: {
  text: string;
  children?: ReactNode;
  classNameWrap?: string;
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
    <div
      className={clsx(
        "flex flex-row justify-start gap-1 self-center",
        color,
        className
      )}
    >
      {icon}
      <div className="self-center text-xs">{text}</div>
      <div className="flex-1" />
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
