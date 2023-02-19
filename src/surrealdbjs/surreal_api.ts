import type { SurrealResult } from "./surrealhelpers";
import {
  surreal_zod_info_for_db,
  surreal_zod_info_for_sc,
  surreal_zod_info_for_tb,
  TBInfo,
} from "./surreal_zod_info";
import type { NSInfo, KVInfo, DBInfo, SCInfo } from "./surreal_zod_info";

type WithID = { id: string };
export type AuthType = "root" | "ns" | "db" | "sc";
export class SurrealClient {
  host = "";
  Authorization = "";
  ns: string | undefined;
  db: string | undefined;
  sc: string | undefined;
  authtype: AuthType = "root";

  constructor(props?: {
    host: string;
    Authorization: string;
    ns?: string;
    db?: string;
    sc?: string;
    authtype?: AuthType;
  }) {
    if (props) {
      this.host = props.host;
      this.Authorization = props.Authorization;
      this.ns = props.ns;
      this.db = props.db;
      this.sc = props.sc;
      if (props.authtype) this.authtype = props.authtype;
    }
  }

  // info_for_db = async () => {
  //   const result = await fetch(`${this.host}/sql`, {
  //     method: "post",
  //     headers: {
  //       Accept: "application/json",
  //       NS: this.ns,
  //       DB: this.db,
  //       Authorization: "Basic " + btoa("root:pass"),
  //     },
  //     body: "INFO FOR DB;",
  //   }).then((r) => r.json());

  //   return { test: "foo3", this: this, result };
  // };

  use = (ns: string, db?: string) => {
    return new SurrealClient({
      host: this.host,
      Authorization: this.Authorization,
      ns,
      db: db || this.db,
    });
  };

  create = async <T extends object>(
    table: string,
    query: { data: T }
  ): Promise<WithID & T> => {
    const surresult = await this.query<[SurrealResult<(T & WithID)[]>]>(
      `CREATE ${table} CONTENT ${JSON.stringify(query.data)};`
    );

    // fetch(`${this.host}/sql`, {
    //   method: "post",
    //   headers: {
    //     Accept: "application/json",
    //     NS: this.ns,
    //     DB: this.db,
    //     Authorization: this.Authorization,
    //   },
    //   body: `CREATE ${table} CONTENT ${JSON.stringify(query.data)};`,
    // }).then((r) => r.json());

    const oneWrap = surresult[0];
    const one = oneWrap.result[0];
    return one as WithID & T;
  };

  findUnique = async <T extends Partial<WithID>>(
    table: string,
    query: { where: Partial<T> }
  ): Promise<T & WithID> => {
    const sql = `SELECT * FROM ${generateTarget(table, query)}${generateWhere(
      query
    )};`;

    const surresult = await this.query<[SurrealResult<T & WithID[]>]>(sql);

    console.log(sql);
    console.log("select where", surresult);

    const oneWrap = surresult[0];
    const one = oneWrap.result[0];
    return one as T & WithID;
  };

  findMany = async <T extends Partial<WithID>>(
    table: string,
    query: { where: Partial<T> }
  ): Promise<(T & WithID)[]> => {
    const sql = `SELECT * FROM ${generateTarget(table, query)}${generateWhere(
      query
    )};`;

    const surresult = await this.query<[SurrealResult<(T & WithID)[]>]>(sql);

    console.log(sql);
    console.log("select where", surresult);

    const oneWrap = surresult[0];

    console.log("============================");
    console.log(oneWrap);

    const many = oneWrap.result;
    return many;
  };

  update = async <T extends Partial<WithID>>(
    table: string,
    query: { where: Partial<T>; data: Partial<T> }
  ): Promise<T & WithID> => {
    // const target = query.where.id ? `${table}:${query.where.id}` : table;
    const sql = `UPDATE ${generateTarget(table, query)}${generateSet(
      query
    )}${generateWhere(query)};`;

    const surresult = await this.query<[SurrealResult<(T & WithID)[]>]>(sql);

    console.log(sql);
    console.log("select where", surresult);

    const oneWrap = surresult[0];
    const one = oneWrap.result[0];

    return one as T & WithID;
  };

  delete = async <T extends Partial<WithID>>(
    table: string,
    query: { where: Partial<T> }
  ): Promise<T & WithID> => {
    const sql = `DELETE ${generateTarget(table, query)}${generateWhere(
      query
    )};`;

    const surresult = await this.query<[SurrealResult<(T & WithID)[]>]>(sql);

    console.log(sql);
    console.log("delete where", surresult);

    const oneWrap = surresult[0];
    const one = oneWrap.result[0];

    return one as T & WithID;
  };

  // replaced by query
  // sql = async <T extends Partial<WithID>>(sql: string): Promise<T & WithID> => {
  //   const surresult = await fetch(`${this.host}/sql`, {
  //     method: "post",
  //     headers: {
  //       Accept: "application/json",
  //       NS: this.ns,
  //       DB: this.db,
  //       Authorization: this.Authorization,
  //     },
  //     body: sql,
  //   }).then((r) => r.json());

  //   return surresult;
  // };

  INFO_FOR_KV = async () => {
    const surresult = await this.query<[SurrealResult<KVInfo>]>("INFO FOR KV;");
    if (!surresult || !surresult[0]) throw new Error("INTERNAL_SERVER_ERROR");
    if (surresult[0].status !== "OK") throw Error("could not get kv");
    return surresult[0].result;
  };

  INFO_FOR_NS = async () => {
    const surresult = await this.query<[SurrealResult<NSInfo>]>("INFO FOR NS;");
    if (!surresult || !surresult[0]) throw new Error("INTERNAL_SERVER_ERROR");
    if (surresult[0].status !== "OK") throw Error("could not get ns");
    return surresult[0].result;
  };

  INFO_FOR_DB = async () => {
    const surresult = await this.query<[SurrealResult<DBInfo>]>("INFO FOR DB;");
    if (!surresult[0]) throw new Error("INTERNAL_SERVER_ERROR");
    const info_for_db = surreal_zod_info_for_db.parse(surresult[0].result);
    return info_for_db;
  };

  INFO_FOR_SCOPE = async (scope: string) => {
    const res = await this.query<[SurrealResult<SCInfo>]>(
      `INFO FOR SCOPE ${scope};`
    );
    if (!res[0]) throw new Error("INTERNAL_SERVER_ERROR");
    const info_for_sc = surreal_zod_info_for_sc.parse(res[0].result);
    return info_for_sc; //todo typed zod
  };

  INFO_FOR_TABLE = async (table: string) => {
    const res = await this.query<[SurrealResult<TBInfo>]>(
      `INFO FOR TABLE ${table};`
    );
    if (!res[0]) throw new Error("INTERNAL_SERVER_ERROR");
    const info_for_tb = surreal_zod_info_for_tb.parse(res[0].result);
    return info_for_tb;
  };

  getFullInfo = async () => {
    const kvinfo: KVInfo =
      this.authtype === "root"
        ? await this.INFO_FOR_KV()
        : {
            ns: { [this.ns ?? "err"]: `DEFINE NAMESPACE ${this.ns ?? "err"}` },
          };

    const nsinfos = await Promise.all(
      Object.keys(kvinfo.ns).map(async (ns) => {
        return {
          ns,
          nsinfo: await this.use(ns).INFO_FOR_NS(),
        };
      })
    );

    // dbinfos
    const dbinfosTemp: { ns: string; db: string }[] = [];
    nsinfos.forEach((nsinfo) => {
      Object.keys(nsinfo.nsinfo.db).map((db) => {
        dbinfosTemp.push({ ns: nsinfo.ns, db });
      });
    });

    const dbinfos = await Promise.all(
      dbinfosTemp.map(async (dbi) => {
        return {
          ns: dbi.ns,
          db: dbi.db,
          dbinfo: await this.use(dbi.ns, dbi.db).INFO_FOR_DB(),
        };
      })
    );

    // tbinfos
    const tbinfosTemp: { ns: string; db: string; tb: string }[] = [];
    dbinfos.forEach((dbinfo) => {
      Object.keys(dbinfo.dbinfo.tb).map((tb) => {
        tbinfosTemp.push({ ns: dbinfo.ns, db: dbinfo.db, tb });
      });
    });

    const tbinfos = await Promise.all(
      tbinfosTemp.map(async (tbi) => {
        return {
          ns: tbi.ns,
          db: tbi.db,
          tb: tbi.tb,
          tbinfo: await this.use(tbi.ns, tbi.db).INFO_FOR_TABLE(tbi.tb),
        };
      })
    );

    const output = {
      kvinfo,
      nsinfos,
      dbinfos,
      tbinfos,
    };

    // TBS

    // console.log(JSON.stringify(output, null, 2));

    return output;
  };

  getHeaders = () => {
    const headers: {
      Accept: string;
      Authorization: string;
      NS?: string;
      DB?: string;
      SC?: string;
    } = {
      Accept: "application/json",
      Authorization: this.Authorization,
    };

    if (this.db) headers.DB = this.db;
    if (this.ns) headers.NS = this.ns;
    if (this.sc) headers.SC = this.sc;
    return headers;
  };

  /** does a sql fetch */
  query = async <T>(sql: string): Promise<T> => {
    const result = (await fetch(`${this.host}/sql`, {
      method: "post",
      headers: this.getHeaders(),
      body: sql,
    }).then((r) => r.json())) as Promise<T>;
    return result;
  };

  /** does a sql fetch */
  queryBatch = async <T>(sql: string): Promise<SurrealResult<T>[]> =>
    fetch(`${this.host}/sql`, {
      method: "post",
      headers: this.getHeaders(),
      body: sql,
    }).then((r) => r.json()) as Promise<SurrealResult<T>[]>;

  /** does a sql fetch */
  querySimple = async <T>(sql: string) =>
    fetch(`${this.host}/sql`, {
      method: "post",
      headers: this.getHeaders(),
      body: sql,
    })
      .then((r) => r.json())
      .then((r) => {
        const response = r as SurrealResult<T>[];

        if (response.length > 1)
          throw new Error("too many results. Use .queryBatch() instead.");

        if (!response[0]) throw new Error("INTERNAL_SERVER_ERROR");

        if (response[0].status !== "OK") throw Error(response[0]?.detail);

        return response[0].result;
      });

  /** creates an account and recieves a token */
  signup = async <T>(props: {
    host: string;
    email?: string;
    pass?: string;
    NS: string;
    DB: string;
    SC: string;
  }): Promise<SurrealResult<T>[]> => {
    this.host = props.host;
    this.ns = props.NS;
    this.db = props.DB;
    this.sc = props.SC;

    const result = (await fetch(`${props.host}/signup`, {
      method: "post",
      headers: {
        Accept: "application/json",
        NS: props.NS,
        DB: props.DB,
        SC: props.SC,
      },
      body: JSON.stringify(props),
    }).then((r) => r.json())) as Promise<SurrealResult<T>[]>;

    return result;
  };
}

//////////////////

/** tablename or table:idstring */
function generateTarget<T extends Partial<WithID>>(
  table: string,
  query: { where: Partial<T> }
): string {
  return query.where.id ? `${query.where.id}` : table;
}

/** "" or " WHERE (...conditions)" */
function generateWhere<T>({ where }: { where: Partial<T> }): string {
  const output = Object.entries(where)
    .filter((i) => i[0] != "id")
    .filter((i) => i[1] !== undefined)
    .map((k) => {
      return `${k[0]} = ${JSON.stringify(k[1])}`;
    });

  if (output.length > 0) return ` WHERE (${output.join(" AND ")})`;
  return "";
}

function generateSet<T>({ data }: { data: Partial<T> }): string {
  const output = Object.entries(data)
    .filter((i) => i[0] != "id")
    .filter((i) => i[1] !== undefined)
    .map((k) => {
      return `${k[0]} = ${JSON.stringify(k[1])}`;
    });

  if (output.length > 0) return ` SET ${output.join(", ")}`;
  return "";
}

// USE NS devns DB devdb; SELECT * FROM user WHERE (marketing = true AND name.first = "Tobie");
// USE NS devns DB devdb; UPDATE user:s92z7ty3m9ooweqqykv6 SET altered = 1, cool = "foo" WHERE (marketing = true AND name.first = "Tobie");
