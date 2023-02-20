import Link from "next/link";
import { HiBookOpen, HiOutlineHome } from "react-icons/hi2";
import { IoMdLogOut, IoMdRefresh } from "react-icons/io";
import { authtype_calc, useAppState } from "../state/useAppState";
import { QueryComponent } from "./querycomponent";

import { BiBookHeart } from "react-icons/bi";
import { SourceLink } from "./footer";
import clsx from "clsx";
import { CredentialsList } from "./explorer/CredentialsList";

import { unique } from "moderndash";
import { BsBook } from "react-icons/bs";
import { FaBook, FaGithub } from "react-icons/fa";

export function Navbar() {
  const appstate = useAppState();

  const authtype = authtype_calc(appstate.credentials);

  return (
    <section className="mb-0 grid grid-cols-12 gap-3 p-3">
      <div className="col-span-full flex flex-row gap-3">
        <Link href="/" className="self-center">
          <button>
            <HiOutlineHome className="icon" />
          </button>
        </Link>

        <Link
          href="https://github.com/rvdende/surrealreact"
          target="_blank"
          className="self-center"
        >
          <button className="self-center">
            <FaGithub className="icon" />
          </button>
        </Link>

        <Link target="_blank" href="https://surrealdb.com/docs">
          <button className="self-center">
            <FaBook className="icon self-center" />
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
            let credentialsList = structuredClone(appstate.credentialsList);
            credentialsList.push(appstate.credentials);
            credentialsList = unique(
              credentialsList,
              (a, b) => a.hostname === b.hostname
            );

            appstate.set({ connected: false, credentialsList });
          }}
        >
          {appstate.credentials.username} <IoMdLogOut className="icon" />
        </button>
      </div>

      <div className="col-span-full flex flex-row gap-3 md:col-span-6">
        <button
          onClick={() => {
            appstate.update().catch(console.error);
          }}
        >
          <IoMdRefresh className="icon" />
        </button>

        <QueryComponent />
      </div>

      <div className="col-span-full flex flex-row gap-3 md:col-span-6">
        <CredentialsList />
      </div>
    </section>
  );
}
