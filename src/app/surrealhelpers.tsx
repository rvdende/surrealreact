import { GridSortModel } from "@mui/x-data-grid-pro";
import Surreal from "../surrealdbjs";

export const InfoForKV = async () => {
    let result = await Surreal.Instance.query<SurrealResult<NamespaceResponse>[]>("INFO FOR KV;")
    let r = result[0].result.ns;
    return Object.keys(result[0].result.ns).map(ns => ({ ns, definition: r[ns] } as NamespaceListItem))
}

export const GetNamespace = async (ns: string) => {
    let r = await InfoForKV();
    return r.filter(i => i.ns === ns)[0]
}

export const InfoForNS = async (ns: string) => {
    let r = await Surreal.Instance.query<[SurrealResult<null>, SurrealResult<NSInfo>]>(`USE NS ${ns}; INFO FOR NS;`)
    return r[1].result;
}

export const InfoForDB = async (ns: string, db: string) => {
    let r = await Surreal.Instance.query(`USE NS ${ns} DB ${db}; INFO FOR DB;`);
    const output = r[1].result as DBInfo;
    return output;
}

export interface DBInfo {
    dl: {},
    dt: {},
    sc: {},
    tb: { [index: string]: string } // todo array ?
}

export const GetStructure = async () => {
    let kv = await InfoForKV();

    let queries = kv.map(GetStructureForNS);

    let result = await Promise.all(queries);

    return result;
}

export const GetStructureForNS = async (n: NamespaceListItem) => {
    let nsinfo = await InfoForNS(n.ns);
    let dbnames = Object.keys(nsinfo.db)

    let db: IDatabase[] = await Promise.all(dbnames.map(async dbname => {
        let dbinfo = await InfoForDB(n.ns, dbname);
        let o: IDatabase = { dbname, dbinfo }
        return o
    }))

    let output: INamespace = { ns: n.ns, define: n.definition, db }
    return output
}

export interface INamespace {
    /** namespace */
    ns: string
    define: string
    db: IDatabase[]
}

export interface IDatabase {
    dbname: string
    dbinfo: DBInfo
}



export interface NSInfo {
    db: { [index: string]: string }
    nl: { [index: string]: string }
    nt: { [index: string]: string }
}


export interface NamespaceListItem {
    ns: string
    definition: string
}

export interface SurrealResult<T> {
    result: T
    status: "OK" | string
    time: string
}


export interface NamespaceResponse {
    ns: {
        /** "DEFINE NAMESPACE namespace" */
        [index: string]: string
    }
}


export type Await<T> = T extends PromiseLike<infer U> ? U : T

export async function SelectAllFromDb<T>(params: {
    ns: string,
    db: string,
    tb: string,
    limit?: number,
    start?: number,
    sort?: GridSortModel
}) {

    let q = `USE NS ${params.ns} DB ${params.db}; SELECT * FROM ${params.tb}`;

    if (params.sort && params.sort[0]) {
        q += ` ORDER BY ${params.sort[0].field} ${params.sort[0].sort?.toUpperCase()}`
    }

    if (params.limit !== undefined) q += ` LIMIT ${params.limit}`;
    if (params.start) q += ` START ${params.start}`;
    q += '; ';
    q += `SELECT count(id) FROM ${params.tb} GROUP BY NONE;`

    const o = await Surreal.Instance.query<any>(q);
    const rows = o[1].result as T[];
    const rowCount = o[2].result.length > 0 ? o[2].result[0].count as number : 0;

    let result: RowPagination<T> = {
        rows,
        rowCount
    }

    return result;
}

export const clone = (input: any) => {
    return JSON.parse(JSON.stringify(input));
}

export interface RowPagination<T> {
    rows: T[],
    rowCount: number
}
