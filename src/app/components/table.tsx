import { Box, Button, Divider, FormControlLabel, LinearProgress, Paper, Switch, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigation, useParams } from "react-router-dom";
import { DBInfo, InfoForTable, RowPagination, SelectAllFromDb, TBInfo } from "../surrealhelpers";

// https://mui.com/x/react-data-grid/#commercial-version
import {
    DataGridPro,
    GridColumns,
    GridSortModel,
    LicenseInfo
} from '@mui/x-data-grid-pro';

import { DeleteTwoTone } from "@mui/icons-material";
import Surreal from "../../surrealdbjs";
import { JsonViewer } from "./jsonViewer";
import { InfoComponent } from "./info";

LicenseInfo.setLicenseKey('11dfa392be05d10d58887edf4f20e775T1JERVI6NDE2MjgsRVhQSVJZPTE2ODEzMzgwODU1NTIsS0VZVkVSU0lPTj0x');

export const getModel = (params: { ns: string, db: string, tb: string }): GridSortModel => {
    let query = JSON.stringify({ ns: params.ns, db: params.db, tb: params.tb });

    let item = localStorage.getItem(query);

    if (item) {
        return JSON.parse(item);
    }
    // JSON.parse(localStorage.getItem(JSON.stringify({ ns: params.ns, db: params.db, tb: params.tb }))
    return [];
}

export const TableViewComponent = () => {
    const params = useParams() as { ns: string, db: string, tb: string };

    const [tbInfo, setTbInfo] = useState<TBInfo>();

    const [data, setData] = useState<RowPagination<any>>();
    const navigation = useNavigation();
    // const [isLoading, setIsLoading] = useState(false);
    const [sortModel, setSortingModel] = useState<GridSortModel>(getModel(params));
    /** limit how many rows we get at a time */
    const [limit, onPageSizeChange] = useState(25)

    /** the page number starting at page 0 */
    const [page, onPageChange] = useState(0);
    const [liverefresher, triggerLiveRefresh] = useState(0);

    const [dolive, setDoLive] = useState<boolean>(localStorage.getItem('doLiveRefresh') !== 'false')

    useEffect(() => {

        const timer = setTimeout(() => {
            if (dolive) triggerLiveRefresh(liverefresher + 1);
        }, 1000)

        InfoForTable(params.ns, params.db, params.tb).then(setTbInfo);

        SelectAllFromDb<any>({
            ns: params.ns,
            db: params.db,
            tb: params.tb,
            limit,
            start: page * limit,
            sort: sortModel
        }).then((data) => { setData(data); })

        return () => clearInterval(timer);
    }, [liverefresher, params, page, limit, sortModel])

    if (!data) return <LinearProgress />

    let columns: GridColumns = deriveColumnsFromRows(data.rows);

    return <Paper sx={{ width: '100%', p: 0 }} elevation={0}>

        <Box sx={{ display: 'flex', flexDirection: 'row', p: 0.5 }}>

            <FormControlLabel control={<Switch onChange={(e) => { setDoLive(e.target.checked); if (e.target.checked) triggerLiveRefresh(1); localStorage.setItem('doLiveRefresh', e.target.checked.toString()) }} />}
                label="Live Polling" sx={{ ml: 1 }} checked={dolive} />

            {/* <Divider sx={{ mr: 1 }} orientation="vertical" flexItem /> */}
            <Box sx={{ flex: 1 }} />
            <Button
                startIcon={<DeleteTwoTone />}
                color="error"
                onClick={async () => {
                    const r = await Surreal.Instance.query(`USE NS ${params.ns} DB ${params.db}; REMOVE TABLE ${params.tb};`);
                    console.log(r);

                }}
            >DELETE TABLE</Button>
        </Box>

        <TableInfoComponent tbInfo={tbInfo} ns={params.ns} db={params.db} tb={params.tb} />

        <DataGridPro
            // key={JSON.stringify(params)}
            density="compact"
            autoHeight
            page={page}
            pageSize={limit}
            rows={data.rows}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            columns={columns}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            rowCount={data.rowCount}
            pagination
            paginationMode="server"
            keepNonExistentRowsSelected
            sortingMode="server"
            initialState={{
                sorting: { sortModel }
            }}
            sortModel={sortModel}
            onSortModelChange={(model) => {
                setSortingModel(model);
                // save the sorting for this table.
                localStorage.setItem(JSON.stringify({
                    ns: params.ns,
                    db: params.db,
                    tb: params.tb,
                }), JSON.stringify(model));
            }}
        // loading={isLoading}
        />



    </Paper>
}

const deriveColumnsFromRows = (rows: any[]) => {
    let keys: any = { id: true };

    rows.forEach(r => {
        Object.keys(flatten(r)).forEach(k => { keys[k] = true });
    })

    const columns: GridColumns = Object.keys(keys).map(k => {
        return { field: k, flex: 1, valueGetter: (props) => { return objectByString(props.row,k) } }
    })

    return columns;

}

const TableInfoComponent = (props: {
    tbInfo?: TBInfo
    ns: string
    db: string
    tb: string
}) => {
    if (!props.tbInfo) return <LinearProgress />
    const tbInfo = props.tbInfo;
    const nsDbTb = { ns: props.ns, db: props.db, tb: props.tb }

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

/** turns nested json objects into dot notation format. */
export function flatten(inObj: any) {
    const res: any = {};

    (function recurse(obj, current?: any) {
        for (const key in obj) {
            if (key) {
                const value = obj[key];
                const newKey = current ? current + '.' + key : key; // joined key with dot
                if (value && typeof value === 'object') {
                    // res[newKey] = value;
                    recurse(value, newKey); // it's a nested object, so do it again
                } else {
                    res[newKey] = value; // it's not an object, so set the property
                }
            }
        }
    })(inObj);

    return res;
}

/** lookup a value from a nested object by using dotnotion */
export function objectByString(obj: any, str: string): any {
    str = str.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    str = str.replace(/^\./, ""); // strip a leading dot
    const a = str.split(".");
    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];
        if (k in obj) {
            obj = obj[k];
        } else {
            return;
        }
    }
    return obj;
}