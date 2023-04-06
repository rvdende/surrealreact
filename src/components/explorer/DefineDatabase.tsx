import { useRouter } from "next/router";
import { useState } from "react";
import { getSurreal, useAppState } from "../../state/useAppState";

export function DefineDatabase({ ns }: { ns: string }) {
  const appstate = useAppState();
  const router = useRouter();

  const [dbname, setDbname] = useState<string>("");

  return (
    <section id="dbcreate" className="px-4">
      <label>Database name</label>
      <div className="grid grid-cols-12 gap-4">
        <input
          value={dbname}
          className="col-span-9"
          onChange={(e) => setDbname(e.target.value)}
        />

        <button
          className="primary col-span-3"
          onClick={() => {
            getSurreal()
              .use(ns)
              .query(`DEFINE DATABASE ${dbname};`)
              .then(async () => {
                await appstate.update().catch(console.error);
                await router.push(`/ns/${ns}/${dbname}`);
              })
              .catch(console.error);
          }}
        >
          Create DB
        </button>
      </div>
    </section>
  );
}
