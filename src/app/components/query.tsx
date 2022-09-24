/** https://surrealdb.com/docs/surrealql/statements/define */

import { AddTwoTone, ArrowBackTwoTone, CloseTwoTone, PlayArrowRounded, PlayArrowTwoTone } from "@mui/icons-material"
import { Box, Dialog, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Tooltip, Typography } from "@mui/material"
import { useState } from "react";
import Surreal from "../../surrealdbjs";
import { clone } from "../surrealhelpers";
import { DocsIcon, MiniTitle } from "../theme";
import { sqldefinitions } from "./query_definitions";

export const QueryComponent = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');


    return <>
        <IconButton color="success" onClick={() => { setOpen(true); }}>
            <AddTwoTone fontSize="small" />
        </IconButton>

        <Dialog
            open={open}

            onClose={() => { setOpen(false); }}
            sx={{ m: 6 }}
        >
            <DialogTitle sx={{ p: 0, m: 0 }}>
                <Paper sx={{ p: 1, m: 0, flexDirection: 'row', display: 'flex', borderRadius: 0 }}>
                    <Box>
                        <IconButton
                            aria-label="close"
                            onClick={() => { setOpen(false); }}
                            sx={{
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <ArrowBackTwoTone />
                        </IconButton>
                    </Box>

                    <Typography sx={{ p: 1 }}>QUERY</Typography>

                    <Box sx={{ flex: 1 }} />

                    <Box>
                        <Tooltip title="Documentation for DEFINE">
                            <IconButton
                                color="primary"
                                href="https://surrealdb.com/docs/surrealql/statements/define"
                                target="_blank"
                                aria-label="docs"
                                onClick={() => { setOpen(false); }}
                            >
                                <DocsIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>



                </Paper>
            </DialogTitle>

            <Paper sx={{ height: '100%' }}>
                <QueryForm />
            </Paper>

        </Dialog>
    </>
}

const QueryForm = (props: {}) => {

    const [query, setQuery] = useState<string[]>(["DEFINE", ""]);
    const [result, setResult] = useState<any>();

    let querystring = query.join(' ') + `;`;

    return <>

        <Paper sx={{ borderRadius: 0, display: 'flex', flexDirection: 'row' }} elevation={0} >
            <Box sx={{ flex: 1, p: 1.5 }}>

                <MiniTitle label="QUERY:" />
                <Typography component={"pre"}>{querystring}</Typography>

                {result && <>
                    <MiniTitle label="RESULT:" />
                    <Typography component={"pre"}>{JSON.stringify(result)}</Typography>
                </>}
            </Box>
            <Box sx={{ p: 1 }}>
                <IconButton
                    color="success"
                    aria-label="docs"
                    onClick={async () => {
                        const result = await Surreal.Instance.query(querystring);
                        setResult(result);
                    }}
                >
                    <PlayArrowRounded />
                </IconButton>
            </Box>
        </Paper>




        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <QueryKeywordDropdown
                value={query[0]}
                onChange={(value) => {
                    let q = clone(query);
                    q[0] = value;
                    setQuery(q);
                }} />

            <Box sx={{ flex: 1 }}>
                <TextField
                    autoFocus
                    label="@name"
                    variant="filled"
                    fullWidth
                    color="warning"
                    value={query[1]}
                    onChange={(e) => {
                        let q = clone(query);
                        q[1] = e.target.value;
                        setQuery(q);
                    }}
                />
            </Box>
        </Box>

    </>
}

const QueryKeywordDropdown = (props: { value: string, onChange: (value: string) => void }) => {
    // https://mui.com/material-ui/react-select/
    const options = sqldefinitions.map(s => s.statement)// ["NAMESPACE", "DATABASE", "LOGIN", "TOKEN", "SCOPE", "TABLE", "EVENT", "FIELD", "INDEX"]

    return <FormControl variant="filled" sx={{ width: 150 }} >
        <InputLabel>Statement</InputLabel>
        <Select
            color="primary"
            value={props.value}
            onChange={(e) => { props.onChange(e.target.value); }}
        >
            {options.map(o => <MenuItem value={o}>{o}</MenuItem>)}
        </Select>
    </FormControl>
}
