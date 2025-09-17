import React, { ReactElement } from "react";
import { Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";

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
      className={({ isActive }) => `nav-button ${isActive ? "selected" : ""}`}
      style={{
        textDecoration: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: isCollapsed ? "0 0 10px 0" : undefined,
      }}
    >
      {isCollapsed ? (
        <Tooltip title={title} placement="right" arrow>
          {icon}
        </Tooltip>
      ) : (
        title
      )}
    </NavLink>
  );
};

export default NavItem;
