import React, { ReactElement } from "react";
import { Tooltip } from "@digdir/designsystemet-react";
import { NavLink } from "react-router-dom";
import classes from "./styles/NavItem.module.css";

interface NavItemProps {
  to: string;
  title: string;
  icon: ReactElement;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, title, icon, isCollapsed }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${classes.navButton} ${isActive ? classes.navButtonSelected : ""}`
      }
    >
      {isCollapsed ? (
        <Tooltip content={title} placement="right">
          {icon}
        </Tooltip>
      ) : (
        title
      )}
    </NavLink>
  );
};

export default NavItem;
