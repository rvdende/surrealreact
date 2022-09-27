import { Box, LinearProgress } from "@mui/material"
import { useEffect, useState } from "react"
import Surreal, { Result } from "../../surrealdbjs"
import { KVInfo } from "../surrealhelpers";
import { InfoComponent } from "./info";

export const KVComponent = () => {
    const [nsData, setNSData] = useState<any>({ ns : {} });
    useEffect(() => { 
        Surreal.Instance.query<Result<KVInfo>[]>("INFO FOR KV;").then( result => {
            let ns = result[0].result;
            if (ns) setNSData(ns);
        })
    }, [])

    if (!nsData || !nsData.ns) return <LinearProgress />

    return <Box>
        {Object.entries(nsData.ns).map(ns => <InfoComponent
            color={"success.main"}
            key={ns[0]}
            type="NAMESPACE"
            name={ns[0]}
            definition={ns[1] as string} />)}

    </Box>
}