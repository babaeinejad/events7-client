import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MouseIcon from "@mui/icons-material/Mouse";
import ListItemText from "@mui/material/ListItemText";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
export type IProps = {
  showSideBar: boolean;
  onCloseSideBar: () => void;
};
export function AppSidebar({ showSideBar, onCloseSideBar }: IProps) {
  const drawerWidth = 240;

  const drawer = (
    <div className="pt-14">
      <div className="flex justify-end sm:hidden">
        <IconButton onClick={onCloseSideBar}>{<ChevronLeftIcon />}</IconButton>
      </div>
      <Divider />
      <List>
        <ListItem key="Events Manager" disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <MouseIcon />
            </ListItemIcon>
            <ListItemText primary="Events Manager" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={showSideBar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
