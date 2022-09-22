import { createTheme } from "@mui/material";

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