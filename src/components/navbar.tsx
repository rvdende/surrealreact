import Link from "next/link";
import { HiOutlineHome } from "react-icons/hi2";
import { IoMdLogOut } from "react-icons/io";
import { authtype_calc, useAppState } from "../state/useAppState";
import { QueryComponent } from "./querycomponent";

import { BiBookHeart } from "react-icons/bi";
import { SourceLink } from "./footer";
import clsx from "clsx";

export function Navbar() {
  const appstate = useAppState();

  const authtype = authtype_calc(appstate.credentials);

  return (
    <section className="panel mb-0 rounded-b-none border-b-0 pb-0">
      <Link href="/" className="self-center">
        <button>
          <HiOutlineHome className="icon" />
        </button>
      </Link>

      <QueryComponent />

      <Link target="_blank" href="https://surrealdb.com/docs">
        <button className="self-center px-3 text-pink-600">
          <BiBookHeart className="icon self-center" />
          <span>DOCS</span>
        </button>
      </Link>

      <SourceLink />

      <button
        className={clsx(
          "self-center",
          {
            root: "text-[#f33]",
            ns: "text-green-400",
            db: "text-sky-400",
            sc: "text-yellow-400",
          }[authtype],
          "border-2",
          {
            root: "border-[#f33]",
            ns: "border-green-400",
            db: "border-sky-400",
            sc: "border-yellow-400",
          }[authtype]
        )}
        onClick={() => {
          appstate.set({ connected: false });
        }}
      >
        {appstate.credentials.username} <IoMdLogOut className="icon" />
      </button>
    </section>
  );
}
