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
import { Namespace } from "./components/namespace";
import { Structure } from "./components/structure";
import { Navbar } from "./navbar";


export const Router = () => {
    return <RouterProvider
        router={createBrowserRouter(createRoutesFromElements(
            <Route
                path="/"
                errorElement={<ErrorElement />}
                element={<>
                    <Navbar />
                    <Outlet />
                </>}>
                <Route index element={<Structure />} />
                {/* <Route path="/:ns" element={<ViewNameSpace />} /> */}
                <Route path="/admin" element={<div>admin</div>} />
                <Route path="/ns/:ns" element={<Namespace />} />

            </Route>))} />
}


const ErrorElement = () => {
    return <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>404 not found!</Typography>
        <Button component={RouterLink} to="/">HOME</Button>
    </Container>
}