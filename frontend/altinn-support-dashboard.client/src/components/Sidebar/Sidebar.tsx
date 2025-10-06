import React from "react";
import {
  Dashboard,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Add,
} from "@mui/icons-material";
import logo from "../../assets/logo.png";
import whiteLogo from "/asd_128_white.png";
import { useSidebarDrag } from "./hooks/useSidebarDrag";
import NavItem from "./NavItem";
import SideBarDateTime from "./SidebarDateTime";
import SidebarEnvToggle from "./SidebarEnvToggle";
import { useUserDetails } from "../../hooks/hooks";

// design system imports
import { Button, Divider, Label } from "@digdir/designsystemet-react";

import classes from "./styles/SideBarComponent.module.css";

const Sidebar: React.FC = () => {
  const { isCollapsed, toggleCollapse, handleDragStart } = useSidebarDrag();
  const { userName, userEmail } = useUserDetails();

  return (
    <div
      data-color="brand3"
      className={`${classes.sidebar} ${
        isCollapsed ? classes.collapsed : classes.expanded
      }`}
    >
      <div className={classes.dragHandle} onMouseDown={handleDragStart} />

      <div>
        <div className={classes.logoBox}>
          <img
            src={isCollapsed ? whiteLogo : logo}
            alt="logo"
            className={`${classes.logoImg} ${
              isCollapsed ? classes.logoCollapsed : classes.logoExpanded
            }`}
          />
        </div>

        <nav className={classes.nav}>
          <NavItem
            to="/dashboard"
            title="Oppslag"
            icon={<Dashboard />}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/manualrolesearch"
            title="Manuelt rollesøk"
            icon={<Search />}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/new-org"
            title="Ny Organisasjon"
            icon={<Add />}
            isCollapsed={isCollapsed}
          />
          <NavItem
            to="/settings"
            title="Innstillinger"
            icon={<Settings />}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      <div>
        {/* Collapse button */}
        <div className={classes.collapseContainer}>
          <Button
            data-color="accent"
            onClick={toggleCollapse}
            className={classes.collapseButton}
          >
            {isCollapsed ? (
              <ChevronRight />
            ) : (
              <>
                <ChevronLeft /> Minimer sidepanel
              </>
            )}
          </Button>
        </div>

        <Divider className={classes.divider} />

        {/* Extra info when expanded */}
        {!isCollapsed && (
          <>
            <SideBarDateTime />
            <SidebarEnvToggle />
            <div className={classes.userInfo}>
              <Label>{userName}</Label>
              <Label>{userEmail}</Label>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
