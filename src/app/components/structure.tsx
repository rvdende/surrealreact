import {
    ExpandLessTwoTone,
    ExpandMoreTwoTone,
    FolderRounded,
    Inventory2Rounded,
    ListAltRounded
} from "@mui/icons-material";
import {
    Box,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper} from "@mui/material"

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

import { Link as RouterLink, useParams } from 'react-router-dom';
import { QueryComponent } from "./query";
import { JsonViewer } from "./jsonViewer";


export const Structure = () => {
    let [nsList, setNsList] = useState<Await<ReturnType<typeof GetStructure>>>();

    useEffect(() => {
        GetStructure().then(setNsList)
    }, [])

    if (!nsList) return <LinearProgress />

    return <Paper sx={{ minWidth: 350, m: 0, p: 0, borderRadius: 0 }} >
        <Box sx={{ m: 1 }}>
            <QueryComponent />
        </Box>
        <List sx={{ m: 0, p: 0 }}
        // subheader={<ListSubheader>Namespaces</ListSubheader>}
        >
            {nsList.map((item) => <NamespaceListItemComponent
                key={item.ns}
                namespace={item}
            />)}
        </List>

        <JsonViewer data={nsList} display={false} />
    </Paper>
}


const NamespaceListItemComponent = (props: { namespace: INamespace }) => {
    const params = useParams();
    const [open, setOpen] = useState<boolean>(true);

    return <Paper elevation={0}>
        <ListItem
            component={RouterLink}
            to={`/ns/${props.namespace.ns}`}
            disableGutters
            color="primary.main"
            sx={{ p: 0, m: 0 }}
            secondaryAction={<IconButton sx={{ opacity: 0.5 }} onClick={() => {
                setOpen(!open);
            }}>
                {open ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
            </IconButton>}
        >
            <ListItemButton
                selected={(params.ns === props.namespace.ns) && !params.db && !params.tb}
            >
                <ListItemIcon sx={{ p: 0, m: 0 }} >
                    <Inventory2Rounded color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={props.namespace.ns} primaryTypographyProps={{ color: 'success.main' }} />
            </ListItemButton>
        </ListItem>

        {open && <DatabaseList ns={props.namespace} />}

    </Paper>
}

export const DatabaseList = (props: { ns: INamespace }) => {
    return <>{props.ns.db.map(db => <DatabaseListItemComponent
        key={db.dbname}
        namespace={props.ns}
        db={db} />)}
    </>
};

export const DatabaseListItemComponent = (props: { db: IDatabase, namespace: INamespace }) => {
    const [open, setOpen] = useState<boolean>(true);
    const params = useParams();

    return <Paper elevation={1} sx={{ m: 0.1, ml: 1 }}>
        <ListItem
            key={`${props.namespace.ns}_${props.db.dbname}`}
            disableGutters
            component={RouterLink}
            to={`/ns/${props.namespace.ns}/${props.db.dbname}`}
            secondaryAction={<IconButton sx={{ opacity: 0.5 }} onClick={() => {
                setOpen(!open);
            }}>
                {open ? <ExpandLessTwoTone /> : <ExpandMoreTwoTone />}
            </IconButton>}
            sx={{ m: 0, p: 0 }}>
            <ListItemButton
                selected={(params.ns === props.namespace.ns) && (params.db === props.db.dbname) && !params.tb}
            >
                <ListItemIcon>
                    <FolderRounded color="info" />
                </ListItemIcon>
                <ListItemText primary={props.db.dbname} primaryTypographyProps={{ color: 'info.main' }} />
            </ListItemButton>
        </ListItem>

        {open && Object.entries(props.db.dbinfo.tb).map((v, i) => <TableListItemComponent
            key={v[0]}
            ns={props.namespace.ns}
            db={props.db.dbname}
            definition={v[1]}
            tablename={v[0]} />)}
    </Paper>
}


export const TableListItemComponent = (props: { tablename: string, definition: string, ns: string, db: string }) => {
    const params = useParams();

    const selected = (params.ns === props.ns) && (params.db === props.db) && (params.tb === props.tablename)

    return <Paper sx={{ ml: 2 }} elevation={2}>
        <ListItem
            key={props.tablename}
            disableGutters
            component={RouterLink}
            to={`/ns/${props.ns}/${props.db}/${props.tablename}`}
            sx={{ m: 0, p: 0, mb: 0.5 }}>
            <ListItemButton
                selected={selected}
                sx={{ m: 0, px: 1, py: 0.5 }}>
                <ListItemIcon>
                    <ListAltRounded color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                    primary={props.tablename}
                    primaryTypographyProps={{
                        color: 'primary.main',
                        m: 0, p: 0
                    }}
                // secondary={props.definition}
                />
            </ListItemButton>
        </ListItem>
    </Paper>
}