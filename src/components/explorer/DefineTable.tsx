import { useRouter } from "next/router";
import { useState } from "react";
import { getSurreal, useAppState } from "../../state/useAppState";

export function DefineTable({ ns, db }: { ns: string; db: string }) {
  const appstate = useAppState();
  const router = useRouter();
  const [name, setname] = useState<string>("");

  return (
    <section id="dbcreate" className="paper">
      <h3>Define Table</h3>

      <label>name</label>
      <div className="flex flex-row gap-4">
        <input
          value={name}
          className="w-full"
          onChange={(e) => setname(e.target.value)}
        />

        <button
          className="primary"
          onClick={() => {
            getSurreal()
              .use(ns, db)
              .query(`DEFINE TABLE ${name};`)
              .then(async () => {
                await appstate.update().catch(console.error);
                await router.push(`/ns/${ns}/${db}/${name}`);
              })
              .catch(console.error);
          }}
        >
          Define table
        </button>
      </div>
    </section>
  );
}
