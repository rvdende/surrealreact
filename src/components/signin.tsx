import Link from "next/link";
import {
  authtype_calc,
  disconnectSurreal,
  getSurreal,
  getSurrealSignup,
  getSurrealToken,
  useAppState,
} from "../state/useAppState";
import { Footer } from "./footer";
import { Tab } from "@headlessui/react";
import { CredentialsList } from "./explorer/CredentialsList";
import { unique } from "moderndash";
import { useState } from "react";

function curlSignUp(host: string, data: unknown) {
  return `curl --request POST --url ${host}/signup --header 'content-type: application/json' --header 'Accept: application/json' --data '${JSON.stringify(
    data
  )}'`;
}

export function SigninRoot() {
  const appstate = useAppState();

  const [errormessage, setErrormessage] = useState<string>();

  return (
    <section className="flex w-full flex-col">
      <label>user</label>
      <input
        value={appstate.credentials.username}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              username: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">pass</label>
      <input
        value={appstate.credentials.password}
        type="password"
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              password: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">namespace</label>
      <input
        value={appstate.credentials.ns}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              ns: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">database</label>
      <input
        value={appstate.credentials.db}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              db: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">scope</label>
      <input
        value={appstate.credentials.sc}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              sc: e.target.value,
            },
          })
        }
      />

      <pre className="mt-4">
        authtype: {authtype_calc(appstate.credentials)}
      </pre>

      <button
        className="primary mt-4 py-3"
        onClick={() => {
          setErrormessage(undefined);
          console.log("connecting to", appstate.credentials);
          appstate.set({ treeHidden: false, querytext: undefined });
          disconnectSurreal();
          getSurreal()
            .getFullInfo()
            .then(() => {
              let credentialsList = structuredClone(appstate.credentialsList);
              credentialsList.push(appstate.credentials);
              credentialsList = unique(
                credentialsList,
                (a, b) => a.hostname === b.hostname
              );

              appstate.set({ connected: true, credentialsList });
              appstate.update().catch(console.error);
            })
            .catch((err) => {
              console.error(err);
              setErrormessage(`Could not connect.`);
            });
        }}
      >
        CONNECT
      </button>

      {errormessage && (
        <div
          className="relative mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
          role="alert"
        >
          <span className="block sm:inline">{errormessage}</span>
        </div>
      )}
    </section>
  );
}

export function SigninScope() {
  const appstate = useAppState();
  return (
    <section className="flex w-full flex-col">
      <label>email</label>
      <input
        value={appstate.credentials.scope_email}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              scope_email: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">pass</label>
      <input
        value={appstate.credentials.scope_pass}
        type="password"
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              scope_pass: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">namespace</label>
      <input
        value={appstate.credentials.ns}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              ns: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">database</label>
      <input
        value={appstate.credentials.db}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              db: e.target.value,
            },
          })
        }
      />

      <label className="mt-4">scope</label>
      <input
        value={appstate.credentials.sc}
        onChange={(e) =>
          appstate.set({
            credentials: {
              ...appstate.credentials,
              sc: e.target.value,
            },
          })
        }
      />

      <div className="flex flex-row gap-4">
        <button
          className="primary mt-4 flex-1 py-3"
          onClick={() => {
            getSurrealSignup({
              host: appstate.credentials.hostname,
              NS: appstate.credentials.ns,
              DB: appstate.credentials.db,
              SC: appstate.credentials.sc,
              email: appstate.credentials.scope_email,
              pass: appstate.credentials.scope_pass,
            })
              .then((result) => {
                console.log(result);
              })
              .catch(console.error);
          }}
        >
          SIGNUP
        </button>
        <button
          className="primary mt-4 flex-1 py-3"
          onClick={() => {
            console.log("connecting to", appstate.credentials);
            appstate.set({ treeHidden: false, querytext: undefined });
            disconnectSurreal();
            getSurreal().getFullInfo().catch(console.error);
          }}
        >
          SIGNIN
        </button>
      </div>
      <p className="py-4">
        If you get a CORS permission error you can run this command locally to
        get the authorization token instead, or use&nbsp;
        <Link href="https://github.com/Rob--W/cors-anywhere">
          https://github.com/Rob--W/cors-anywhere
        </Link>{" "}
        to run a local dev proxy that allows cross origin requests. And then use
        a host url like: http://localhost:8080/http://localhost:8000
      </p>

      <label className="mt-4">manual signup</label>
      <pre>
        {curlSignUp(appstate.credentials.hostname, {
          ns: appstate.credentials.ns,
          db: appstate.credentials.db,
          sc: appstate.credentials.sc,
          email: appstate.credentials.scope_email,
          pass: appstate.credentials.scope_pass,
        })}
      </pre>

      <label className="mt-4">token</label>
      <input
        value={appstate.credentials.token}
        onChange={(e) => {
          appstate.set({
            credentials: {
              ...appstate.credentials,
              token: e.target.value,
            },
          });
        }}
      />
      <button
        className="primary mt-4 flex-1 py-3"
        onClick={() => {
          getSurrealToken({
            host: appstate.credentials.hostname,
            token: appstate.credentials.token,
            ns: appstate.credentials.ns,
            db: appstate.credentials.db,
            sc: appstate.credentials.sc,
          })
            .then((result) => {
              console.log(result);
            })
            .catch(console.error);
        }}
      >
        CONNECT
      </button>
    </section>
  );
}

export function Signin() {
  const appstate = useAppState();

  const className = `flex-1 rounded-b-none bg-black/20 data-[headlessui-state="selected"]:bg-white/5 data-[headlessui-state="selected"]:pt-4 data-[headlessui-state="selected"]:mt-0 pt-2 mt-2 outline-none`;

  return (
    <section className="paper mx-auto mt-16 flex w-[500px] ">
      <h2 className="mb-8">
        <Link href="https://surrealdb.com/">
          <span className="text-white">Surreal</span>
          <span className="font-bold text-pink-600">DB</span>
        </Link>
        &nbsp; Explorer
      </h2>

      <CredentialsList />

      <div className="mt-5" />

      <Tab.Group
        onChange={(connection_screen_tab) => {
          appstate.set({ connection_screen_tab });
        }}
        selectedIndex={appstate.connection_screen_tab}
      >
        <Tab.List className={"flex flex-row gap-1"}>
          <Tab className={className}>Admin</Tab>
          <Tab className={className}>Scoped</Tab>
        </Tab.List>

        <section className="paper flex w-full flex-col">
          <label>url</label>
          <input
            autoFocus
            value={appstate.credentials.hostname}
            onChange={(e) =>
              appstate.set({
                credentials: {
                  ...appstate.credentials,
                  hostname: e.target.value,
                },
              })
            }
          />

          <span className="w-full text-right">
            Need <Link href="http://137.66.15.177/">http</Link> or{" "}
            <Link href="https://surrealreact.fly.dev/">https</Link>?
          </span>

          <Tab.Panels>
            <Tab.Panel>
              <SigninRoot />
            </Tab.Panel>
            <Tab.Panel>
              <SigninScope />
            </Tab.Panel>
          </Tab.Panels>
        </section>
      </Tab.Group>

      <p className="mt-6 px-4">
        This is a browser only app, so your login credentials are safe and at no
        point sent to our servers. Feel free to look at the code or clone the
        github repo and run the explorer on your own if you prefer.
      </p>

      <Footer />
    </section>
  );
}
