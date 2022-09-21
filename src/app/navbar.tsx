import { HomeRounded } from "@mui/icons-material";
import { IconButton, Paper, Button, Box, Typography } from "@mui/material";
import {
    Link as RouterLink
} from "react-router-dom";

export const Navbar = () => {
    return <Paper sx={{ p: 1, display: 'flex', flexDirection: 'row' }}>
        <IconButton component={RouterLink} to="/">
            <HomeRounded />
        </IconButton>

        <Typography sx={{ mt: 1, ml: 1, opacity: 0.75 }}>{localStorage.getItem('url')}</Typography>

        <Box sx={{ flex: 1 }} />

        <Button color="primary" onClick={() => {
            localStorage.clear();
            window.location.replace('/')
        }}>Disconnect</Button>
    </Paper>
}