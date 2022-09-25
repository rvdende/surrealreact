import { Box, Button, LinearProgress, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { DBInfo, InfoForDB, IScope } from "../surrealhelpers";
import { JsonViewer } from "./jsonViewer";
import { InfoComponent } from "./info";
import { DeleteTwoTone, FolderRounded, Inventory2Rounded } from "@mui/icons-material";
import Surreal from "../../surrealdbjs";

export const DatabaseViewComponent = () => {
    const params = useParams() as { ns: string, db: string };

    const [dbInfo, setDbInfo] = useState<DBInfo>();

    useEffect(() => {
        InfoForDB(params.ns, params.db).then(setDbInfo);
    }, [params])

    if (!dbInfo) return <LinearProgress />

    return <Paper sx={{ width: '100%', p: 0 }} elevation={0}>

        <Box sx={{ display: 'flex', flexDirection: 'row', p: 0.5 }}>

            <Box sx={{ width: 100, display: 'flex', flexDirection: 'row', p: 1 }}>
                <Inventory2Rounded color="success" fontSize="small" /> <Typography color="success.main" sx={{ ml: 1 }}>{params.ns}</Typography> 
                <Typography  sx={{ ml: 1, opacity: 0.5  }}>{"/"}</Typography> 
                <FolderRounded color="info" fontSize="small" sx={{ ml: 1 }} /> <Typography color="info.main" sx={{ ml: 1 }}>{params.db}</Typography>
            </Box>

            {/* <Divider sx={{ mr: 1 }} orientation="vertical" flexItem /> */}
            <Box sx={{ flex: 1 }} />

            <Button
                startIcon={<DeleteTwoTone />}
                color="error"
                onClick={async () => {
                    const r = await Surreal.Instance.query(`USE NS ${params.ns} DB ${params.db}; REMOVE DATABASE ${params.db};`);
                    console.log(r);

                }}
            >DELETE DATABASE</Button>
        </Box>

        <DatabaseInfoComponent dbInfo={dbInfo} ns={params.ns} db={params.db} />

        <JsonViewer data={dbInfo} />
    </Paper>
}


const DatabaseInfoComponent = (props: {
    dbInfo?: DBInfo
    ns: string
    db: string
}) => {
    if (!props.dbInfo) return <LinearProgress />
    const dbInfo = props.dbInfo;
    const nsDbTb = { ns: props.ns, db: props.db }

    return <Paper sx={{ p: 0.5 }} elevation={2}>

        {Object.entries(dbInfo.dl).map(dl => <InfoComponent
            color={"info.main"}
            key={dl[0]}
            type="dlENT"
            name={dl[0]}
            nsDbTb={nsDbTb}
            definition={dl[1]} />)}

        {Object.entries(dbInfo.dt).map(dt => <InfoComponent
            color={"success.main"}
            key={dt[0]}
            type="FIELD"
            name={dt[0]}
            nsDbTb={nsDbTb}
            definition={dt[1]} />)}

        {Object.entries(dbInfo.sc).map(sc => <InfoComponent
            color={"warning.main"}
            key={sc[0]}
            type="SCOPE"
            name={sc[0]}
            nsDbTb={nsDbTb}
            definition={sc[1]} />)}

        {Object.entries(dbInfo.tb).map(tb => <InfoComponent
            color={"primary"}
            key={tb[0]}
            type="TABLE"
            name={tb[0]}
            nsDbTb={nsDbTb}
            definition={tb[1]} />)}
    </Paper>
}