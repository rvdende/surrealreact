import { useEffect, useState } from "react";
import { TypeOf, z } from "zod";
import { getSurreal, useAppState } from "../../state/useAppState";
import { buildScopeScript, Duration, durations } from "../../surrealdbjs";
import { SelectStyled } from "../SelectStyled";

export function DefineScopes({ ns, db }: { ns: string; db: string }) {
  const appstate = useAppState();
  const [scopeName, setname] = useState<string>("account");
  const [durationNum, setDurationNum] = useState(1);
  const [duration, durationSet] = useState<Duration>(durations[4]);

  const [scriptSignup, setScriptSignup] = useState<string>(
    `CREATE scopeusers SET email = $email, pass = crypto::argon2::generate($pass)`
  );
  const [scriptSignin, setScriptSignin] = useState<string>(
    `SELECT * FROM scopeusers WHERE email = $email AND crypto::argon2::compare(pass, $pass)`
  );

  const generated_script = buildScopeScript({
    ns,
    db,
    scopeName,
    duration,
    durationNum,
    scriptSignup,
    scriptSignin,
  });

  return (
    <section id="define_scopes" className="paper">
      <h3>Define Scopes</h3>

      <div className="flex flex-row gap-4">
        <div>
          <label>name</label>

          <input
            value={scopeName}
            className="w-full"
            onChange={(e) => setname(e.target.value)}
          />
        </div>

        <div>
          <label className="whitespace-nowrap pt-4">Session valid for:</label>
          <div className="flex flex-row gap-1 rounded">
            <input
              type="number"
              value={durationNum}
              onChange={(e) => setDurationNum(e.target.valueAsNumber)}
            />

            <SelectStyled
              value={duration}
              options={durations.map((i) => ({ name: i.name }))}
              onChange={(value) => {
                const d = durations.find((i) => i.name === value.name);
                if (d) durationSet(d);
              }}
            />
          </div>
        </div>
      </div>

      <label className="mt-4">SIGNUP</label>
      <input
        value={scriptSignup}
        className="w-full"
        onChange={(e) => setScriptSignup(e.target.value)}
      />

      <label className="mt-4">SIGNIN</label>
      <input
        value={scriptSignin}
        className="w-full"
        onChange={(e) => setScriptSignin(e.target.value)}
      />

      <button
        className="primary mt-4"
        onClick={() => {
          getSurreal()
            .use(ns, db)
            .query(generated_script)
            .then((response) => {
              console.log(response);
            })
            .catch(console.error);
        }}
      >
        Define Scope
      </button>

      <pre>{generated_script}</pre>
    </section>
  );
}
