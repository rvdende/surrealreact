import { Router } from "./router"
import Surreal from "../surrealdbjs";
import { connectDBSurreal, getSession, Signin } from "./signin";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Container, CssBaseline, IconButton, LinearProgress, ThemeProvider, Typography } from "@mui/material";
import { themeMUIDark } from "./theme";
import { GitHub } from "@mui/icons-material";
import packageJson from '../../package.json'
/** Handles signin */
const SurrealReactMain = () => {
    const [logged, setLogged] = useState<boolean>();

    useEffect(() => {
        // reconnect on load
        connectDBSurreal().then((logged) => { setLogged(logged); }).catch( err => { localStorage.clear(); window.location.reload(); });
    }, [])

    if (logged) return <Router />

    if (logged === false) return <Signin onConnect={() => {
        console.log('success');
        connectDBSurreal().then((logged) => { setLogged(logged); })
    }} />

    return <LinearProgress />
}

/** Main wrapper for theme */
export const App = () => {
    return <ThemeProvider theme={themeMUIDark}>
        <CssBaseline />
        <Box>
            <SurrealReactMain />
            <FooterDisplay />
        </Box>
    </ThemeProvider>
}

export const FooterDisplay = () => <Container sx={{ textAlign: 'center', mt: 4, pb: 4 }}>
    <Button color="inherit"
        href="https://github.com/rvdende/surrealreact"
        target="_blank"
        sx={{ opacity: 0.25, transition: 'opacity linear 0.1s', ':hover': { opacity: 1 } }}
        startIcon={<GitHub />}>{packageJson.name} {packageJson.version}</Button>
</Container>