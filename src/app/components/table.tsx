import { Box, Button, Divider, FormControlLabel, LinearProgress, Paper, Switch, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigation, useParams } from "react-router-dom";
import { RowPagination, SelectAllFromDb } from "../surrealhelpers";

// https://mui.com/x/react-data-grid/#commercial-version
import {
    DataGridPro,
    GridColumns,
    GridSortModel,
    LicenseInfo
} from '@mui/x-data-grid-pro';

import { DeleteTwoTone } from "@mui/icons-material";
import Surreal from "../../surrealdbjs";

LicenseInfo.setLicenseKey('11dfa392be05d10d58887edf4f20e775T1JERVI6NDE2MjgsRVhQSVJZPTE2ODEzMzgwODU1NTIsS0VZVkVSU0lPTj0x');

export const getModel = (params: { ns: string, db: string, tb: string }): GridSortModel => {
    let query = JSON.stringify({ ns: params.ns, db: params.db, tb: params.tb });

    let item = localStorage.getItem(query);

    if (item) {
        console.log(item);
        return JSON.parse(item);
    }
    // JSON.parse(localStorage.getItem(JSON.stringify({ ns: params.ns, db: params.db, tb: params.tb }))
    return [];
}

export const TableViewComponent = () => {
    const params = useParams() as { ns: string, db: string, tb: string };
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

        <Box sx={{ display: 'flex', flexDirection: 'row' }}>

            <FormControlLabel control={<Switch onChange={(e) => { setDoLive(e.target.checked); if (e.target.checked) triggerLiveRefresh(1); localStorage.setItem('doLiveRefresh', e.target.checked.toString()) }} />}
                label="Live Polling" sx={{ ml: 1 }} checked={dolive} />

            <Divider sx={{ mr: 1 }} orientation="vertical" flexItem />

            <Button
                startIcon={<DeleteTwoTone />}
                onClick={async () => {
                    const r = await Surreal.Instance.query(`USE NS ${params.ns} DB ${params.db}; REMOVE TABLE ${params.tb};`);
                    console.log(r);

                }}
            >DELETE TABLE</Button>



        </Box>

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

        {/* <Paper>
            <Typography>
                <pre>{JSON.stringify(data, null,2)}</pre>
            </Typography>
        </Paper> */}
    </Paper>
}

const deriveColumnsFromRows = (rows: any[]) => {
    let keys: any = { id: true };

    rows.forEach(r => {
        Object.keys(r).forEach(k => { keys[k] = true })
    })

    const columns: GridColumns = Object.keys(keys).map(k => {
        return { field: k, flex: 1 }
    })

    return columns;

}