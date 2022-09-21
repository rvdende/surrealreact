import {
    ExpandLessTwoTone,
    ExpandMoreTwoTone,
    FolderRounded,
    Inventory2Rounded,
    ListAltRounded
} from "@mui/icons-material";
import {
    Button,
    Divider,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Paper,
    Typography
} from "@mui/material"

import {
    useEffect,
    useState
} from "react"

import {
    Await,
    GetStructure,
    IDatabase,
    INamespace
} from "../surrealhelpers"


export const Structure = () => {
    let [showdata, setShowData] = useState<boolean>(false);
    let [nsList, setNsList] = useState<Await<ReturnType<typeof GetStructure>>>();

    useEffect(() => {
        GetStructure().then(setNsList)
    }, [])

    if (!nsList) return <LinearProgress />

    return <>
        <List subheader={<ListSubheader>Namespaces</ListSubheader>}>
            {nsList.map((item) => <NamespaceListItemComponent
                key={item.ns}
                namespace={item}
            />)}
        </List>

        <Button color="success"
            variant={showdata ? 'text' : "outlined"}
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => { setShowData(!showdata); }}
        >Toggle Data</Button>

        {showdata && <Paper sx={{ p: 2, overflow: 'auto' }}>
            <Typography component="pre" sx={{ fontSize: '0.75em' }}>
                <pre>{JSON.stringify(nsList, null, 2)}</pre>
            </Typography>
        </Paper>}
    </>
}


const NamespaceListItemComponent = (props: { namespace: INamespace }) => {
    const [open, setOpen] = useState<boolean>(true);
    return <Paper elevation={0}>
        <ListItem
            disableGutters
            color="primary.main"
            sx={{ p: 0, m: 0 }}
            secondaryAction={<IconButton onClick={() => {
                setOpen(!open);
            }}>
                {open ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
            </IconButton>}
        >
            <ListItemButton >
                <ListItemIcon sx={{ p: 0, m: 0 }} >
                    <Inventory2Rounded color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={props.namespace.ns} primaryTypographyProps={{ color: 'success.main' }} />
            </ListItemButton>
        </ListItem>

        {open && props.namespace.db.map(db => <DatabaseListItemComponent
            key={db.dbname}
            namespace={props.namespace}
            db={db} />)}
        <Divider />
    </Paper>
}


const DatabaseListItemComponent = (props: { db: IDatabase, namespace: INamespace }) => {
    const [open, setOpen] = useState<boolean>(true);

    return <Paper elevation={1} sx={{ ml: 2 }}>
        <ListItem
            key={`${props.namespace.ns}_${props.db.dbname}`}
            disableGutters
            secondaryAction={<IconButton onClick={() => {
                setOpen(!open);
            }}>
                {open ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
            </IconButton>}
            sx={{ m: 0, p: 0 }}>
            <ListItemButton>
                <ListItemIcon>
                    <FolderRounded color="info" />
                </ListItemIcon>
                <ListItemText primary={props.db.dbname} primaryTypographyProps={{ color: 'info.main' }} />
            </ListItemButton>
        </ListItem>

        {open && Object.entries(props.db.dbinfo.tb).map((v, i) => <TableListItemComponent
            key={v[0]}
            definition={v[1]}
            tablename={v[0]} />)}
    </Paper>
}


const TableListItemComponent = (props: { tablename: string, definition: string }) => {
    return <Paper sx={{ ml: 2 }} elevation={2}>
        <ListItem
            key={props.tablename}
            disableGutters
            sx={{ m: 0, p: 0 }}>
            <ListItemButton>
                <ListItemIcon>
                    <ListAltRounded color="primary" />
                </ListItemIcon>
                <ListItemText
                    primary={props.tablename}
                    primaryTypographyProps={{ color: 'primary.main' }}
                    secondary={props.definition}
                />
            </ListItemButton>
        </ListItem>
    </Paper>
}