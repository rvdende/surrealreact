import { createTheme, Typography } from "@mui/material";

import { StickyNote2TwoTone } from "@mui/icons-material";

export const DocsIcon = StickyNote2TwoTone;

export const themeMUIDark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff1787",

    },
    secondary: {
      main: "#0de2d0",
      contrastText: "rgba(0,0,0,0.75)",
    },
    background: {
      default: "#353941",
      paper: "#161b27",
    },
    text: {
      primary: "#ffffff",
    },
  },
});

export const MiniTitle = (props: { label: string }) => {
  return <Typography sx={{ opacity: 0.5, fontSize: '0.75em' }}>
    {props.label}
  </Typography>
}