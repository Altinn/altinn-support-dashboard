import React, { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import whiteLogo from "/asd_128_white.png";
import { useSidebarDrag } from "./hooks/useSidebarDrag";
import NavItem from "./NavItem";
import SideBarDateTime from "./SidebarDateTime";
import SidebarEnvToggle from "./SidebarEnvToggle";
import { useUserDetails } from "../../hooks/hooks";
import { initiateSignOut } from "../../utils/ansattportenApi";
import {
  Buildings3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CogIcon,
} from "@navikt/aksel-icons";

// design system imports
import { Button, Divider, Label } from "@digdir/designsystemet-react";

import classes from "./styles/SideBarComponent.module.css";
import { useAuthDetails } from "../../hooks/ansattportenHooks";

const Sidebar: React.FC = () => {
  const { isCollapsed, toggleCollapse, handleDragStart } = useSidebarDrag();

  //old user details (will be removed in the future)
  const { userName, userEmail } = useUserDetails();

  const [newUsername, setNewUsername] = useState("");
  const authDetails = useAuthDetails();

  const handleLogout = () => {
    initiateSignOut("/signin");
  };

  useEffect(() => {
    if (authDetails?.data?.isLoggedIn) {
      setNewUsername(authDetails.data.name);
    }
  }, [authDetails.data?.isLoggedIn, authDetails.data?.name]);

  if (authDetails.isLoading || !authDetails.data.isLoggedIn) {
    return;
  }

  return (
    <div className={classes.sidebarWrapper}>
      <div className={classes.dragHandle} onMouseDown={handleDragStart} />
      <div
        className={`${classes.sidebar} ${
          isCollapsed ? classes.collapsed : classes.expanded
        }`}
      >
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

          {/* Collapse button */}
          <div className={classes.collapseContainer}>
            <Button
              data-color="accent"
              onClick={toggleCollapse}
              className={classes.collapseButton}
            >
              {isCollapsed ? (
                <ChevronRightIcon className={classes.icons} />
              ) : (
                <>
                  <ChevronLeftIcon className={classes.icons} /> Minimer
                  sidepanel
                </>
              )}
            </Button>
          </div>

          <Divider className={classes.divider} />

          <nav className={classes.nav}>
            <NavItem
              to="/dashboard"
              title="Oppslag"
              icon={<Buildings3Icon className={classes.icons} />}
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/manualrolesearch"
              title="Manuelt rollesøk"
              icon={<MagnifyingGlassIcon className={classes.icons} />}
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/new-org"
              title="Ny Organisasjon"
              icon={<PlusIcon className={classes.icons} />}
              isCollapsed={isCollapsed}
            />
            <NavItem
              to="/settings"
              title="Innstillinger"
              icon={<CogIcon className={classes.icons} />}
              isCollapsed={isCollapsed}
            />
          </nav>
        </div>
        <div className={classes.envToggleContainer}>
          {!isCollapsed && <SidebarEnvToggle />}
        </div>
        <div>
          <Divider className={classes.divider} />

          {/* Extra info when expanded */}
          {!isCollapsed && (
            <>
              <SideBarDateTime />
              <Button
                variant="primary"
                onClick={handleLogout}
                className={classes.logoutButton}
              >
                Logg ut
              </Button>
              <div className={classes.userInfo}>
                <Label>
                  {authDetails?.data?.name ? newUsername : userName}
                </Label>
                <Label>{userEmail}</Label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
