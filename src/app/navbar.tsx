import { LogoutRounded, HomeRounded, LogoutTwoTone, StickyNote2 } from "@mui/icons-material";
import { IconButton, Paper, Button, Box, Typography, Divider, Tooltip, Dialog, DialogActions } from "@mui/material";
import { useState } from "react";
import {
    Link as RouterLink
} from "react-router-dom";
import { QueryComponent } from "./components/query";
import { DocsIcon } from "./theme";

export const Navbar = () => {

    const [showLogoutConfirmDialog, setShowLogoutConfirmDialog] = useState(false);

    return <Paper sx={{ p: 1, display: 'flex', flexDirection: 'row' }}>
        <IconButton component={RouterLink} to="/">
            <HomeRounded />
        </IconButton>

        {/* <Typography sx={{ mt: 1, ml: 1, opacity: 0.75 }}>{localStorage.getItem('url')}</Typography> */}

        <Divider orientation="vertical" sx={{ mx: 1 }} flexItem />

        <QueryComponent />

        <Divider orientation="vertical" sx={{ mx: 1 }} flexItem />

        {/* <Box sx={{ flex: 1 }} /> */}

        <Button
            startIcon={<DocsIcon />}
            target="_blank"
            href="https://surrealdb.com/docs"
        >Docs</Button>

        <Divider orientation="vertical" sx={{ mx: 1 }} flexItem />

        <Tooltip title="Logout">
            <IconButton
                onClick={() => {
                    setShowLogoutConfirmDialog(true);

                }}
            >
                <LogoutRounded />
            </IconButton>
        </Tooltip>

        {/* LOGOUT CONFIRM DIALOG */}
        <Dialog
            open={showLogoutConfirmDialog}
            onClose={() => { setShowLogoutConfirmDialog(false); }}
        >
            <DialogActions>
                <Button color={"info"} autoFocus onClick={() => { setShowLogoutConfirmDialog(false); }}>
                    CANCEL
                </Button>
                <Button color={"error"} variant="contained" onClick={() => {
                    // LOG OUT THE USER
                    localStorage.clear();
                    window.location.replace('/')
                }}>CONFIRM LOGOUT</Button>
            </DialogActions>
        </Dialog>

    </Paper>
}