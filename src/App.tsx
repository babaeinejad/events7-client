import "App.css";
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "App.routes";
import { Navigation } from "navigation/navigation";
import { AppSidebar } from "sidebar/sidebar";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import { useState } from "react";

function App() {
  const [showSideBar, setShowSideBar] = useState(true);
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#1976d2",
      },
    },
  });

  function toggleSideBar() {
    setShowSideBar(!showSideBar);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="flex flex-col w-full">
        <Navigation onToggleSideBar={toggleSideBar} />
        <div className="flex w-full h-full">
          <AppSidebar
            showSideBar={showSideBar}
            onCloseSideBar={toggleSideBar}
          />
          <RouterProvider router={AppRouter} />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
