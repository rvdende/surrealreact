import { Box, LinearProgress, Paper } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SelectAllFromDb } from "../surrealhelpers";

// https://mui.com/x/react-data-grid/#commercial-version
import {
    useGridApiRef,
    DataGridPro,
    GridApi,
    GridColumns,
    GridRowParams,
    MuiEvent,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridEvents,
    GridRowId,
    GridRowModel,
    LicenseInfo,
    GridSortModel,
    GridSortItem,
    GridFilterModel,
    GridLinkOperator
} from '@mui/x-data-grid-pro';

LicenseInfo.setLicenseKey('11dfa392be05d10d58887edf4f20e775T1JERVI6NDE2MjgsRVhQSVJZPTE2ODEzMzgwODU1NTIsS0VZVkVSU0lPTj0x');

export const TableViewComponent = () => {
    const params = useParams() as { ns: string, db: string, tb: string};
    const [rows, setRows] = useState<any[]>();

    useEffect(() => {
        SelectAllFromDb<any>(params).then( (rows) => { setRows(rows); console.log(rows); })
    }, [params])

    if (!rows) return <LinearProgress />

    let columns: GridColumns = deriveColumnsFromRows(rows);

    return <Paper sx={{ width: '100%', p: 0 }} elevation={0}>
        <DataGridPro density="compact" autoHeight rows={rows} columns={columns} />
    </Paper>
}

const deriveColumnsFromRows = (rows: any[]) => {
    let keys:any = { id: true };
    
    rows.forEach( r => {
        Object.keys(r).forEach(k => { keys[k] = true })
    })

    const columns: GridColumns = Object.keys(keys).map( k => { 
        return { field: k, flex: 1 }
    })

    return columns;

}