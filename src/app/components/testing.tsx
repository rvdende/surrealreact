import { Button, Paper, Typography } from "@mui/material"
import Surreal from "../../surrealdbjs"

export const Testing = () => {
    return <Paper>
        <Typography>Testing</Typography>

        <Button onClick={async () => {
            const db = Surreal.Instance;
            await db.use('testing', 'testing').then(r => {
                console.log({ r });
            });

            // let created = await db.create("person", {
            //     title: 'Founder & CEO',
            //     name: {
            //         first: 'Tobie',
            //         last: 'Morgan Hitchcock',
            //     },
            //     marketing: true,
            //     identifier: Math.random().toString(36).substr(2, 10),
            // });

            let updated = await db.change("person:jaime", {
                marketing: true,
            });


        }}>
            TEST
        </Button>
    </Paper>
}