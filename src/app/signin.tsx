import { AlertColor, Box, Typography, Alert, TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import Surreal from "../surrealdbjs";

export const Signin = (props: { onConnect?: () => void }) => {
    const [url, setUrl] = useState<string>(localStorage.getItem('url') || "");
    const [user, setUser] = useState<string>(localStorage.getItem('user') || "");
    const [pass, setPass] = useState<string>(localStorage.getItem('pass') || "");
    const [alert, setAlert] = useState<{ message: string, severity: AlertColor }>();

    const connectDB = async () => {
        try {
            setAlert(undefined); // clear

            // validation
            if (url == '') throw Error('Url can not be empty!');
            if (!url.endsWith('/rpc')) throw Error('Url must end with /rpc');
            if (user == '') throw Error('user can not be empty!');
            if (pass == '') throw Error('pass can not be empty!');

            await Surreal.Instance.connect(url)

            const result = await Surreal.Instance.signin({ user, pass })

            if (result === undefined) throw Error('Could not signin, something went wrong.');

            if (result === '') {
                setAlert({ message: 'Success', severity: 'success' });
                localStorage.setItem('url', url);
                localStorage.setItem('user', user);
                localStorage.setItem('pass', pass);
                if (props.onConnect) props.onConnect();
            };
        } catch (err:any) {
            setAlert({ message: err.message, severity: 'error' })
        }
    }

    return <Box sx={{ mt: 2 }}>
        <Typography variant="h4">Surreal DB Explorer</Typography>

        {alert && <Alert severity={alert.severity}>{alert.message}</Alert>}

        <TextField
            label="url"
            value={url}
            autoFocus
            onChange={(e) => { setUrl(e.target.value); }}
            placeholder="https://yourserverurl/rpc"
            fullWidth
            margin="normal"
        />

        <TextField
            label="user"
            value={user}
            onChange={(e) => { setUser(e.target.value); }}
            fullWidth
            margin="normal"
        />

        <TextField
            label="pass"
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); }}
            fullWidth
            margin="normal"
        />

        <Button variant="contained" onClick={() => { connectDB(); }}>Connect</Button>
    </Box>
}


export const getSession = () => {
    const url = localStorage.getItem('url');
    if (!url) return undefined;
    const user = localStorage.getItem('user');
    if (!user) return undefined;
    const pass = localStorage.getItem('pass');
    if (!pass) return undefined;
    return { url, user, pass };
}

export const connectDBSurreal = async () => {
    let session = getSession();
    if (!session) return false;
    await Surreal.Instance.connect(session.url);
    const result = await Surreal.Instance.signin({
        user: session.user,
        pass: session.pass
    });

    if (result === '') return true;
    return false;
}