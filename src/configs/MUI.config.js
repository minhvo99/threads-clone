import { createTheme } from "@mui/material";

const theme = {
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#246AA3",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
  },
};

export default createTheme(theme);
