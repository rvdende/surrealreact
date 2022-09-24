import { Box, LinearProgress, Paper } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DBInfo, InfoForDB, IScope } from "../surrealhelpers";
import { JsonViewer } from "./jsonViewer";
import { InfoComponent } from "./info";

export const DatabaseViewComponent = () => {
    const params = useParams() as { ns: string, db: string };

    const [dbInfo, setDbInfo] = useState<DBInfo>();

    useEffect(() => {
        InfoForDB(params.ns, params.db).then(setDbInfo);
    }, [params])

    if (!dbInfo) return <LinearProgress />

    return <Paper sx={{}} elevation={0}>
        <JsonViewer data={dbInfo} />
    </Paper>
}