import { CloseRounded } from "@mui/icons-material"
import { Box, Divider, IconButton, Paper, Typography } from "@mui/material"
import { useState } from "react"
import Surreal from "../../surrealdbjs"

export const InfoComponent = (props: {
    type: string
    name: string,
    definition: string,
    color?: any,
    nsDbTb: { ns: string, db: string, tb: string }
}) => {
    const [deleted, setDeleted] = useState<boolean>();

    let fontSize = '0.75em';

    if (deleted) return <></>

    return <Paper sx={{
        display: 'flex',
        flexDirection: 'row',
        mb: "2px",
        p: 0.5,
        transition: "opacity linear 0.2s",
        opacity: 0.75,
        ":hover": {
            opacity: 1,
            "#delete": { opacity: 1 },
            "#definition": { opacity: 1 }
        }
    }}
        elevation={0}>

        <Paper sx={{ width: 70, pl: 0.5 }} elevation={0}>
            <Typography color={props.color} sx={{ fontSize }}>{props.type}</Typography>
        </Paper>

        <Divider orientation="vertical" sx={{ mx: 1 }} flexItem />

        <Box sx={{ width: 100 }}>
            <Typography color={props.color} sx={{ fontSize }}>
                {props.name}
            </Typography>
        </Box>

        <Divider orientation="vertical" sx={{ mx: 1 }} flexItem />

        <Box sx={{ flex: 1 }}>
            <Typography id="definition" sx={{
                opacity: 0.5,
                fontSize
            }}>{props.definition}</Typography>
        </Box>


        <Box id="delete" sx={{ opacity: 0, transition: "opacity linear 0.2s" }}>
            <IconButton size="small" color="error" onClick={async () => {
                const result = await Surreal.Instance.query(`USE NS ${props.nsDbTb.ns} DB ${props.nsDbTb.db}; REMOVE ${props.type} ${props.name} ON TABLE ${props.nsDbTb.tb};`);
                console.log(result);
                if (result[1].status === "OK") setDeleted(true);
            }} >
                <CloseRounded fontSize="small" />
            </IconButton>
        </Box>

    </Paper>
}