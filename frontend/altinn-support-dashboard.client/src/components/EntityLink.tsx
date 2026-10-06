import { Link } from "react-router-dom";
import styles from "./EntityLink.module.css";

interface EntityLinkProps {
  to: string;
  state?: unknown;
  className?: string;
  children: React.ReactNode;
}

export const EntityLink: React.FC<EntityLinkProps> = ({
  to,
  state,
  className,
  children,
}) => (
  <Link to={to} state={state} className={`${styles.link} ${className ?? ""}`}>
    {children}
  </Link>
);
