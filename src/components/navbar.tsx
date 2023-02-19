import Link from "next/link";
import { HiOutlineHome } from "react-icons/hi2";
import { IoMdLogOut, IoMdRefresh } from "react-icons/io";
import { authtype_calc, useAppState } from "../state/useAppState";
import { QueryComponent } from "./querycomponent";

import { BiBookHeart } from "react-icons/bi";
import { SourceLink } from "./footer";
import clsx from "clsx";

export function Navbar() {
  const appstate = useAppState();

  const authtype = authtype_calc(appstate.credentials);

  return (
    <section className="mb-0 grid grid-cols-12 gap-3 rounded-b-none border-b-0 pt-3 pb-3">
      <div className="col-span-full flex flex-row gap-3 px-3">
        <Link href="/" className="self-center">
          <button>
            <HiOutlineHome className="icon" />
          </button>
        </Link>

        <SourceLink />

        <Link target="_blank" href="https://surrealdb.com/docs">
          <button className="self-center px-3 text-pink-600">
            <BiBookHeart className="icon self-center" />
            <span>DOCS</span>
          </button>
        </Link>

        <div className="flex-1" />

        <button
          className={clsx(
            "self-center",
            {
              root: "text-[#f33]",
              ns: "text-green-400",
              db: "text-sky-400",
              sc: "text-yellow-400",
            }[authtype],
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
      </div>

      <div className="col-span-full flex flex-row gap-3 px-3">
        <button
          onClick={() => {
            appstate.update().catch(console.error);
          }}
        >
          <IoMdRefresh className="icon" />
        </button>

        <QueryComponent />
      </div>
    </section>
  );
}
