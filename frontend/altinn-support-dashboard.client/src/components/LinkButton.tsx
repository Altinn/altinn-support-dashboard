import styles from "./EntityLink.module.css";

interface LinkButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  onClick,
  className,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`${styles.link} ${styles.linkButton} ${className ?? ""}`}
  >
    {children}
  </button>
);
