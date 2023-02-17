import clsx from "clsx";
import { HiXMark } from "react-icons/hi2";
import { RiUser3Line } from "react-icons/ri";
import { getSurreal, useAppState } from "../../state/useAppState";

export function User({
  username,
  className,
  ns,
  db,
}: {
  username: string;
  className: string;
  ns: string;
  db?: string;
}) {
  const appstate = useAppState();
  return (
    <div className="flex flex-row">
      <button
        className={clsx("w-full justify-start gap-2 rounded-r-none", className)}
      >
        <RiUser3Line className={"icon"} /> {username}
      </button>
      <button
        className="delete rounded-l-none"
        onClick={() => {
          getSurreal()
            .use(ns, db)
            .querySimple(
              `REMOVE LOGIN ${username} ON ${db ? "DATABASE" : "NAMESPACE"};`
            )
            .catch(console.error)
            .finally(() => {
              appstate.update().catch(console.error);
            });
        }}
      >
        <HiXMark />
      </button>
    </div>
  );
}
