import { useRouter } from "next/router";
import { useState } from "react";
import { getSurreal, useAppState } from "../../state/useAppState";

export function DefineNamespace() {
  const appstate = useAppState();
  const router = useRouter();

  const [ns, set_ns] = useState<string>("");

  return (
    <section id="dbcreate" className="px-4">
      <label>Namespace name</label>
      <div className="grid grid-cols-12 gap-4">
        <input
          value={ns}
          className="col-span-9"
          onChange={(e) => set_ns(e.target.value)}
        />

        <button
          className="primary col-span-3"
          onClick={() => {
            getSurreal()
              .use(ns)
              .query(`DEFINE NAMESPACE ${ns};`)
              .then(async () => {
                await appstate.update().catch(console.error);
                await router.push(`/ns/${ns}`);
              })
              .catch(console.error);
          }}
        >
          Create NS
        </button>
      </div>
    </section>
  );
}
