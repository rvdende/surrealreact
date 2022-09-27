/** https://surrealdb.com/docs/surrealql/statements/define */

import { AddTwoTone, ArrowBackTwoTone, CloseTwoTone, PlayArrowRounded, PlayArrowTwoTone } from "@mui/icons-material"
import { Alert, Box, Button, Dialog, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Snackbar, TextField, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import Surreal, { Result } from "../../surrealdbjs";
import { appEvents } from "../events";
import { DocsIcon, MiniTitle } from "../theme";
import { sqldefinitions } from "./query_definitions";

const getCommandHistory = () => {
    let commandsRaw = localStorage.getItem('commandHistory');
    if (commandsRaw !== null) {
        let commandHistory: string[] = JSON.parse(commandsRaw);
        let b = commandHistory.filter(c => c !== "");
        // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
        let uniq = [...new Set(b)]
        localStorage.setItem("commandHistory", JSON.stringify(uniq));
        return uniq;
    } else return [];
}

export const QueryComponent = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<void | Result<unknown>[] | undefined>(undefined);
    const [runState, setRunState] = useState<"success" | "error" | "info">("info");
    const [runMessage, setRunMessage] = useState<string>();
    const [focusBlur, setFocusBlur] = useState(false);
    const [commandHistory, setCommandHistory] = useState<string[]>(getCommandHistory());
    const [commandHistoryIndex, setCommandHistoryIndex] = useState(0);

    const runQuery = async () => {
        setRunState("info")



        const result = await Surreal.Instance.query(query.split("\n").join("")).catch(err => {
            console.log(err)
            setRunState("error");
            setRunMessage(err.message);
        });
        setResult(result);
        if (result) {
            if (result.length === result.filter(i => i.status === 'OK').length) {

                // add to commandHistory;
                commandHistory.push(query);
                setCommandHistory(commandHistory)
                localStorage.setItem('commandHistory', JSON.stringify(commandHistory));
                // end add to commandHistory

                setRunState("success");
                setQuery("");
                appEvents.emit("querySuccess", result);
            }
        }
    }

    function downHandler(ev: KeyboardEvent) {
        const key = ev.key;
        if (key === "ArrowUp") {
            // show previous query.
            let indexnum = commandHistoryIndex - 1;
            if (indexnum === 0) {
                setQuery("");
            } else {
                setQuery(commandHistory.at(indexnum) || "");
            }
            setCommandHistoryIndex(indexnum);
        }

        if (key === "ArrowDown") {
            // show previous query.
            let indexnum = commandHistoryIndex + 1;
            if (indexnum === 0) {
                setQuery("");
            } else {
                setQuery(commandHistory.at(indexnum) || "");
            }

            setCommandHistoryIndex(indexnum);
        }

        if (key === "Enter" && focusBlur && ev.ctrlKey) {
            console.log('runQuery!')
            runQuery();
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, [focusBlur, query]);

    return <>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
            <Button
                color={runState}
                sx={{ height: '100%' }}
                onClick={() => { setOpen(true); }}
            >Query</Button>
            <TextField size="small"
                color={runState}
                fullWidth
                multiline
                onFocus={() => { setFocusBlur(true); }}
                onBlur={() => { setFocusBlur(false); }}
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                }}
            />
            <IconButton color={runState} sx={{ ml: 0.5 }} onClick={runQuery}>
                <PlayArrowRounded />
            </IconButton>
        </Box>

        <Snackbar
            open={!!runMessage}
            autoHideDuration={6000}
            onClose={() => {
                setRunState("info");
                setRunMessage(undefined);
            }}
        >
            <Alert severity={runState}>{runMessage}</Alert>
        </Snackbar>

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

                    <Typography sx={{ p: 1 }}>Query</Typography>

                    <Box sx={{ flex: 1 }} />

                    <Box>
                        <Tooltip title="SurrealQL">
                            <IconButton
                                color="primary"
                                href="https://surrealdb.com/docs/surrealql"
                                target="_blank"
                                aria-label="docs"
                            >
                                <DocsIcon />
                            </IconButton>
                        </Tooltip>

                        <IconButton
                            color="success"
                            aria-label="docs"
                            onClick={runQuery}
                        >
                            <PlayArrowRounded />
                        </IconButton>

                    </Box>



                </Paper>
            </DialogTitle>

            <Paper sx={{ height: '100%', minWidth: '50vw' }}>
                <QueryForm onQueryChange={(query) => { setQuery(query); }} result={result} />
            </Paper>

        </Dialog>
    </>
}

const QueryForm = (props: { onQueryChange: (query: string) => void, result: any }) => {
    const [query, setQuery] = useState<string>("");
    // const [result, setResult] = useState<any>();

    // let querystring = query.join(' ') + `;`;

    return <>

        <Paper sx={{ borderRadius: 0, display: 'flex', flexDirection: 'column' }} elevation={0} >

            <TextField
                size="small"
                fullWidth
                label="query"
                sx={{ pt: 0.5 }}
                multiline
                value={query}
                onChange={(e) => { setQuery(e.target.value); props.onQueryChange(e.target.value); }}
            />

            <Box sx={{ flex: 1 }}>
                <Box sx={{ px: 1 }}>

                </Box>

                <Box sx={{ width: 50 }}>
                    <MiniTitle label="RESULT:" />
                    {props.result && <>
                        <Typography component={"pre"} sx={{ whiteSpace: 'wrap', wordWrap: 'break-word' }}>{JSON.stringify(props.result)}</Typography>
                    </>}
                </Box>
            </Box>
        </Paper>




        {/* <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
        </Box> */}

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
