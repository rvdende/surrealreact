import { Box, LinearProgress, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { InfoForNS, GetNamespace, NamespaceListItem, NSInfo } from "../surrealhelpers";

export const Namespace = () => {
    const [namespace, setNs] = useState<NamespaceListItem>();
    const [nsinfo, setNSInfo] = useState<NSInfo>();

    let params = useParams<"ns">();

    useEffect(() => {
        if (!params.ns) return;
        // GetNamespace(params.ns).then(setNs);
        InfoForNS(params.ns).then(setNSInfo)
    }, [])

    if (!namespace) return <LinearProgress />

    return <Box>
        <Typography variant="h5">{namespace.ns}</Typography>
        <Typography sx={{ opacity: 0.5, fontSize: '0.75em' }}>{namespace.definition}</Typography>

        <Paper>
            <Typography component="pre">
                <pre>{JSON.stringify(nsinfo, null, 2)}</pre>
            </Typography>
        </Paper>
    </Box>
}