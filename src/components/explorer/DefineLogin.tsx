import { useState } from "react";
import { getSurreal, useAppState } from "../../state/useAppState";
import { Alert } from "./Alert";

export function DefineLogin({ ns, db }: { ns: string; db?: string }) {
  const appstate = useAppState();
  const [name, setname] = useState<string>("");
  const [password, setpassword] = useState<string>("");
  const on = db ? `DATABASE` : "NAMESPACE";

  const [errormessage, seterrormessage] = useState<string | null>(null);

  return (
    <section>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <input
            value={name}
            placeholder="username"
            className="w-full"
            onChange={(e) => setname(e.target.value)}
          />
        </div>

        <div className="col-span-6">
          <input
            value={password}
            placeholder="password"
            className="w-full"
            onChange={(e) => setpassword(e.target.value)}
          />
        </div>

        <div className="col-span-3">
          <button
            className="primary w-full"
            onClick={() => {
              getSurreal()
                .use(ns, db)
                .querySimple(
                  `DEFINE LOGIN ${name} ON ${on} PASSWORD '${password}';`
                )
                .catch((err) => {
                  if (err instanceof Error) seterrormessage(err.message);
                  console.error(err);
                })
                .finally(() => {
                  appstate.update().catch(console.error);
                });
            }}
          >
            CREATE USER
          </button>
        </div>
      </div>
      <Alert message={errormessage} />
    </section>
  );
}
