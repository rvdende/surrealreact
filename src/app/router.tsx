import { HomeRounded } from "@mui/icons-material";
import { Box, Button, Container, IconButton, Paper, Typography } from "@mui/material";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link as RouterLink,
    createRoutesFromElements,
    Outlet
} from "react-router-dom";

import { Structure } from "./components/structure";

import { NamespaceViewComponent } from "./components/namespace";
import { DatabaseViewComponent } from "./components/database";
import { TableViewComponent } from "./components/table";

import { Navbar } from "./navbar";
import { KVComponent } from "./components/kv";


export const Router = () => {
    return <RouterProvider
        router={createBrowserRouter(createRoutesFromElements(
            <Route
                path="/"
                errorElement={<ErrorElement />}
                element={<>
                    <Navbar />
                    <Paper sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' }
                    }}>
                        <Box sx={{ pr: { sm: 0, md: 0.5 } }}>
                            <Structure />
                        </Box>

                        <Box sx={{ borderRadius: 0, width: '100%', p: 0 }}>
                            <Outlet />
                        </Box>
                    </Paper>
                </>}>
                {/* <Route path="/:ns" element={<ViewNameSpace />} /> */}
                <Route path="/" element={<KVComponent />} />
                <Route path="/admin" element={<div>admin</div>} />
                <Route path="/ns/:ns" element={<NamespaceViewComponent />} />
                <Route path="/ns/:ns/:db" element={<DatabaseViewComponent />} />
                <Route path="/ns/:ns/:db/:tb" element={<TableViewComponent />} />

            </Route>))} />
}


const ErrorElement = () => {
    return <Container sx={{ mt: 4, textAlign: 'center' }} disableGutters>
        <Typography>404 not found!</Typography>
        <Button component={RouterLink} to="/">HOME</Button>
    </Container>
}