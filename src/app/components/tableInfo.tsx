import { LinearProgress, Paper } from "@mui/material"
import { TBInfo } from "../surrealhelpers"
import { InfoComponent } from "./info";

export const TableInfoComponent = (props: {
    tbInfo?: TBInfo
    ns: string
    db: string
    tb: string
}) => {
    if (!props.tbInfo) return <LinearProgress />
    const tbInfo = props.tbInfo;
    const nsDbTb = { ns: props.ns, db: props.db, tb: props.tb}

    return <Paper sx={{ p: 0.5 }} elevation={2}>

        {Object.entries(tbInfo.ev).map(ev => <InfoComponent
            color={"info.main"}
            key={ev[0]}
            type="EVENT"
            name={ev[0]}
            nsDbTb={nsDbTb}
            definition={ev[1]} />)}

        {Object.entries(tbInfo.fd).map(fd => <InfoComponent
            color={"success.main"}
            key={fd[0]}
            type="FIELD"
            name={fd[0]}
            nsDbTb={nsDbTb}
            definition={fd[1]} />)}

        {Object.entries(tbInfo.ix).map(ix => <InfoComponent
            color={"warning.main"}
            key={ix[0]}
            type="INDEX"
            name={ix[0]}
            nsDbTb={nsDbTb}
            definition={ix[1]} />)}
    </Paper>
}