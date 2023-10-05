import {
  PaletteMode,
  ThemeProvider,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { createContext, useMemo, useState } from "react";

export const MaterialContext = createContext({
  toggleColorMode: () => {},
});

export default function MaterialWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<PaletteMode>(
    prefersDarkMode ? "dark" : "light"
  );
  const materialUtils = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <MaterialContext.Provider value={materialUtils}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </MaterialContext.Provider>
  );
}
