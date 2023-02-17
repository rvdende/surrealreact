import { z } from "zod";

const types = [
  "ns",
  "db",
  "tb",
  // "fd",
  // "ix",
  // "ev",
  // "nl",
  // "nt",
  // "dl",
  // "dt",
  "sc",
] as const;

export type SurrealType = (typeof types)[number];

export const surreal_zod_info_for_kv = z.object({
  ns: z.record(z.string()),
});

export const surreal_zod_info_for_ns = z.object({
  db: z.record(z.string()),
  nl: z.record(z.string()),
  nt: z.record(z.string()),
});

export const surreal_zod_info_for_db = z.object({
  dl: z.record(z.string()),
  dt: z.record(z.string()),
  sc: z.object({
    account: z.string().optional(),
  }),
  tb: z.record(z.string()),
});

export const surreal_zod_info_for_tb = z.object({
  ev: z.record(z.string()),
  fd: z.record(z.string()),
  ft: z.record(z.string()),
  ix: z.record(z.string()),
});

export const surreal_zod_info_for_sc = z.object({
  st: z.record(z.string()),
});

export type KVInfo = z.infer<typeof surreal_zod_info_for_kv>;
export type NSInfo = z.infer<typeof surreal_zod_info_for_ns>;
export type DBInfo = z.infer<typeof surreal_zod_info_for_db>;
export type TBInfo = z.infer<typeof surreal_zod_info_for_tb>;
export type SCInfo = z.infer<typeof surreal_zod_info_for_sc>;
