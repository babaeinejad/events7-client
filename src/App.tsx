import "App.css";
import { RouterProvider } from "react-router-dom";
import { AppRouter } from "App.routes";
import { Navigation } from "navigation/navigation";
import { AppSidebar } from "sidebar/sidebar";
import { useState } from "react";
import MaterialWrapper from "material-context/materialContext";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [showSideBar, setShowSideBar] = useState(true);

  function toggleSideBar() {
    setShowSideBar(!showSideBar);
  }

  return (
    <MaterialWrapper>
      <CssBaseline enableColorScheme />
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
    </MaterialWrapper>
  );
}

export default App;
