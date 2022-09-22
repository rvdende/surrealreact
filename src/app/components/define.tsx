/** https://surrealdb.com/docs/surrealql/statements/define */

import { AddTwoTone, ArrowBackTwoTone, CloseTwoTone, PlayArrowRounded, PlayArrowTwoTone } from "@mui/icons-material"
import { Box, Dialog, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, TextField, Tooltip, Typography } from "@mui/material"
import { useState } from "react";
import Surreal from "../../surrealdbjs";
import { clone } from "../surrealhelpers";
import { DocsIcon } from "../theme";

/** DEPRECATED */
export const DefineComponent = () => {
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
                <DefineForm />
            </Paper>

        </Dialog>
    </>
}

const DefineForm = (props: {}) => {

    const [query, setQuery] = useState<string[]>(["NAMESPACE", ""]);
    const [result, setResult] = useState<any>();

    let querystring = 'DEFINE ' + query.join(' ') + `;`;

    return <>

        <Paper sx={{ borderRadius: 0, display: 'flex', flexDirection: 'row' }} elevation={0} >
            <Box sx={{ flex: 1, p: 1.5 }}>
                <Typography sx={{ opacity: 0.5, fontSize: '0.75em' }}>QUERY:</Typography>
                <Typography component={"pre"}>{querystring}</Typography>

                {result && <>
                    <Typography sx={{ opacity: 0.5, fontSize: '0.75em' }}>RESULT:</Typography>
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
            <DefineKeywordDropdown
                value={query[0]}
                onChange={(value) => {
                    let q = clone(query);
                    q[0] = value;
                    setQuery(q);
                }} />

            <Box sx={{ flex: 1}}>
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

const DefineKeywordDropdown = (props: { value: string, onChange: (value: string) => void }) => {
    // https://mui.com/material-ui/react-select/
    const options = ["NAMESPACE", "DATABASE", "LOGIN", "TOKEN", "SCOPE", "TABLE", "EVENT", "FIELD", "INDEX"]

    return <FormControl variant="filled" sx={{ width: 150 }} >
        <InputLabel>DEFINE</InputLabel>
        <Select
            color="primary"
            value={props.value}
            onChange={(e) => { props.onChange(e.target.value); }}
        >
            {options.map(o => <MenuItem value={o}>{o}</MenuItem>)}
        </Select>
    </FormControl>
}


const DEFINEstatementsyntax = `
DEFINE [
	NAMESPACE @name
	| DATABASE @name
	| LOGIN @name ON [ NAMESPACE | DATABASE ] [ PASSWORD @pass | PASSHASH @hash ]
	| TOKEN @name ON [ NAMESPACE | DATABASE ] TYPE @type VALUE @value
	| SCOPE @name
	| TABLE @name
		[ DROP ]
		[ SCHEMAFULL | SCHEMALESS ]
		[ AS SELECT @projections
			FROM @tables
			[ WHERE @condition ]
			[ GROUP [ BY ] @groups ]
		]
		[ PERMISSIONS [ NONE | FULL
			| FOR select @expression
			| FOR create @expression
			| FOR update @expression
			| FOR delete @expression
		] ]
	| EVENT @name ON [ TABLE ] @table WHEN @expression THEN @expression
	| FIELD @name ON [ TABLE ] @table
		[ TYPE @type ]
		[ VALUE @expression ]
		[ ASSERT @expression ]
		[ PERMISSIONS [ NONE | FULL
			| FOR select @expression
			| FOR create @expression
			| FOR update @expression
			| FOR delete @expression
		] ]
	| INDEX @name ON [ TABLE ] @table [ FIELDS | COLUMNS ] @fields [ UNIQUE ]
]
`;