import { useState } from "react";
import { BsPlayFill } from "react-icons/bs";
import { FaChevronUp } from "react-icons/fa";
import { getSurreal, useAppState } from "../state/useAppState";

export function QueryComponent() {
  const appstate = useAppState();

  const [queryResult, setQueryResult] = useState<unknown>(null);

  return (
    <section className="w-full">
      <div className="group flex w-full flex-row gap-3">
        <div className="relative w-full">
          <input
            className="w-full"
            value={appstate.querytext ?? ""}
            onChange={(e) => appstate.set({ querytext: e.target.value })}
          />

          {!!queryResult && (
            <div className="panel absolute right-0 left-0 m-0 flex flex-col rounded rounded-t-none border border-t-0 border-zinc-700 bg-zinc-800/90 p-4 text-xs text-zinc-200 shadow-2xl backdrop-blur">
              <button
                className="absolute top-2 right-2 justify-end text-pink-500"
                onClick={() => {
                  setQueryResult(null);
                }}
              >
                <FaChevronUp className="icon" />
              </button>
              <pre>{JSON.stringify(queryResult, null, 2)}</pre>
            </div>
          )}
        </div>

        <button
          className="text-sky-400"
          onClick={() => {
            getSurreal()
              .query(appstate.querytext)
              .then((r) => {
                setQueryResult(r);
                appstate.update().catch(console.error);
              })
              .catch(console.error);
          }}
        >
          <span className="flex flex-row gap-2 self-center">
            <BsPlayFill className="icon" />
          </span>
        </button>
      </div>
    </section>
  );
}
