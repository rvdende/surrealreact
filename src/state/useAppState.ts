import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthType, SurrealClient, TBInfo } from "../surrealdbjs";
import { DBInfo, KVInfo, NSInfo } from "../surrealdbjs/surreal_zod_info";

type Credentials = {
  hostname: string;
  username: string;
  password: string;
  scope_email: string;
  scope_pass: string;
  ns: string;
  db: string;
  sc: string;
  token: string;
};

type Provider = {
  connection_screen_tab: number;
  credentials: Credentials;
  credentialsList: Credentials[];
  connected: boolean;
  treeHidden: boolean;
  /** store stuff like collapse/expanded state */
  treeUIdata: { [index: string]: { collapsed: boolean } };
  querytext: string;
  queryResult: string;
  set: (prop: Partial<Provider>) => void;
  info_kv: KVInfo | null;
  info_ns: { ns: string; nsinfo: NSInfo }[];
  info_db: { ns: string; db: string; dbinfo: DBInfo }[];
  info_tb: { ns: string; db: string; tb: string; tbinfo: TBInfo }[];
  update: () => Promise<void>;
  /** Keep track of table row clicks used for editor maybe other stuff in future */
  activeRow: {
    ns: string;
    db: string;
    tb: string;
    row: string;
  } | null;
  /** we're going to use this to force an update on the table, could be useful elsewhere... */
  latestData: Date;
};

export const useAppState = create<Provider>()(
  devtools(
    persist(
      (set, get) => ({
        connection_screen_tab: 0,
        credentials: {
          hostname: "http://yourserver:8000",
          username: "root",
          password: "root",
          scope_email: "testuser",
          scope_pass: "testpass",
          ns: "test",
          db: "test",
          sc: "account",
          token: "",
        },
        credentialsList: [],
        connected: false,
        treeHidden: false,
        treeUIdata: {},
        /// default query in the navbar
        querytext: `USE NS test DB cool; CREATE somedata CONTENT ${JSON.stringify(
          {
            foo: Math.random(),
          }
        )};`,
        queryResult: "",
        ///
        set: (props) => {
          // check if there is a difference
          let diff = false;
          for (const key in props) {
            const existing = get()[key as keyof Provider];
            if (
              JSON.stringify(existing) !==
              JSON.stringify(props[key as keyof Provider])
            ) {
              diff = true;
            }
          }

          if (diff) set(props);
        },
        info_kv: null,
        info_ns: [],
        info_db: [],
        info_tb: [],
        update: async () => {
          const result = await getSurreal().getFullInfo();
          set({
            info_kv: result.kvinfo,
            info_ns: result.nsinfos,
            info_db: result.dbinfos,
            info_tb: result.tbinfos,
            latestData: new Date(),
          });
        },
        // new stuff
        activeRow: null,
        ///////////
        latestData: new Date(),
      }),
      {
        name: "surrealreact",
      }
    )
  )
);

// singleton connection
let surreal: SurrealClient | undefined;

export function disconnectSurreal(options?: { silent: boolean }) {
  surreal = undefined;

  if (!options)
    useAppState
      .getState()
      .set({ connected: false, info_kv: null, info_db: [] });
}

export function authtype_calc(props: {
  ns?: string;
  db?: string;
  sc?: string;
}) {
  let authtype: AuthType = "root";

  if (props.ns) authtype = "ns";
  if (props.db) authtype = "db";
  if (props.sc) authtype = "sc";

  return authtype;
}

export function getSurreal() {
  if (surreal) return surreal;

  const authtype: AuthType = authtype_calc(useAppState.getState().credentials);

  console.log({ authtype });

  surreal = new SurrealClient({
    Authorization: `Basic ${Buffer.from(
      `${useAppState.getState().credentials.username}:${
        useAppState.getState().credentials.password
      }`,
      "ascii"
    ).toString("base64")}`,
    host: useAppState.getState().credentials.hostname,
    ns: useAppState.getState().credentials.ns,
    db: useAppState.getState().credentials.db,
    authtype,
  });

  return surreal;
}

export async function getSurrealSignup(props: {
  host: string;
  email?: string;
  pass?: string;
  NS: string;
  DB: string;
  SC: string;
}) {
  console.log("signin up", props);
  useAppState.getState().set({ treeHidden: false, querytext: undefined });

  const newsurrealconnection = new SurrealClient();
  const result = await newsurrealconnection.signup(props);
  console.log(result);
  surreal = newsurrealconnection;
  return result;
}

export async function getSurrealToken(props: {
  host: string;
  token: string;
  ns: string;
  db: string;
  sc: string;
}) {
  console.log("connect with token to scope", props);
  useAppState.getState().set({ treeHidden: false, querytext: undefined });

  const newsurrealconnection = new SurrealClient({
    Authorization: `Bearer ${props.token}`,
    host: props.host,
    ns: props.ns,
    db: props.db,
    sc: props.sc,
  });

  const result = await newsurrealconnection.query(
    `INFO FOR SCOPE ${props.sc};`
  );
  console.log(result);
  return newsurrealconnection;
}
