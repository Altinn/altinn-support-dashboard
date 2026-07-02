import React, { ReactElement, ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tooltip } from "@digdir/designsystemet-react";
import { ChevronDownIcon } from "@navikt/aksel-icons";
import navItemClasses from "./styles/NavItem.module.css";
import classes from "./styles/NavGroup.module.css";

interface NavGroupProps {
  title: string;
  icon: ReactElement;
  isCollapsed: boolean;
  paths: string[];
  children: ReactNode;
}

const NavGroup: React.FC<NavGroupProps> = ({
  title,
  icon,
  isCollapsed,
  paths,
  children,
}) => {
  const location = useLocation();
  const isChildActive = paths.some((path) =>
    location.pathname.startsWith(path)
  );
  const [isOpen, setIsOpen] = useState(isChildActive);

  return (
    <div className={classes.group}>
      {isCollapsed ? (
        <button
          type="button"
          className={`${navItemClasses.navButton} ${navItemClasses.navButtonCollapsed} ${classes.groupButtonReset}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          <Tooltip content={title} placement="right">
            {icon}
          </Tooltip>
        </button>
      ) : (
        <button
          type="button"
          className={`${navItemClasses.navButton} ${classes.groupButtonReset}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
        >
          {title}
          <ChevronDownIcon
            className={`${classes.chevron} ${isOpen ? classes.chevronOpen : ""}`}
          />
        </button>
      )}
      <div
        className={`${classes.groupChildren} ${
          isOpen ? classes.groupChildrenOpen : ""
        }`}
      >
        <div
          className={`${classes.groupChildrenInner} ${
            isCollapsed ? classes.groupChildrenInnerCollapsed : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default NavGroup;
