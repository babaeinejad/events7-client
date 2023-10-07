import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext } from "react";
import { MaterialContext } from "material-context/materialContext";
import { useTheme } from "@mui/material";

export type IProps = {
  onToggleSideBar: () => void;
};
export function Navigation({ onToggleSideBar }: IProps) {
  const theme = useTheme();
  const materialUtils = useContext(MaterialContext);
  return (
    <AppBar
      position="static"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <div className="md:hidden">
          <IconButton
            className="md:hidden"
            onClick={onToggleSideBar}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <strong className="text-white font-fantasy font-fa text-3xl">
            EVENtS7
          </strong>
        </Typography>
        <div>
          <Toolbar>
            <IconButton
              sx={{ fontSize: "1rem" }}
              onClick={materialUtils.toggleColorMode}
              color="inherit"
              disableTouchRipple
              disableRipple
              aria-label="toggle-dark-mode"
            >
              {theme.palette.mode === "dark" ? (
                <span role="img" aria-label="sun">
                  ☀️
                </span>
              ) : (
                <span role="img" aria-label="moon">
                  🌚
                </span>
              )}
            </IconButton>
          </Toolbar>
        </div>
      </Toolbar>
    </AppBar>
  );
}
