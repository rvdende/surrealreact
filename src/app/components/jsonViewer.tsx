import { Box, Paper, Typography } from "@mui/material"

export const JsonViewer = (props: { data: any, display?: boolean }) => {

    if (props.display === false) return <></>;

    return <Box sx={{ pb: 1, pr: 1 }}>
        <Paper sx={{ p: 2, m: 2 }} elevation={1}>
            <Box sx={{ overflow: 'auto', mb: 1 }}>
                <Typography component={"pre"} sx={{ overflow: 'auto', wordWrap: 'break-word', whiteSpace: 'pre-wrap', opacity: 0.5 , fontSize: '0.75em'}}>
                    {JSON.stringify(props.data, null, 4)}
                </Typography>
            </Box>
        </Paper>
    </Box>
}