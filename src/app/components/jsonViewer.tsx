import { Box, Paper, Typography } from "@mui/material"

export const JsonViewer = (props: { data: any, display?: boolean }) => {

    if (props.display === false) return <></>;

    return <Paper sx={{ p: 2, maxWidth: 800, m: 2 }} elevation={1}>
        <Box sx={{ overflow: 'auto' }}>
            <Typography component={"pre"} sx={{ overflow: 'auto' }}>
                {JSON.stringify(props.data, null, 4)}
            </Typography>
        </Box>
    </Paper>
}