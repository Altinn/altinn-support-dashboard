import { Card } from "@digdir/designsystemet-react";
import styles from "./styles/PolicySubjectCard.module.css"



interface PolicySubjectCardProps{
    subject: string;
    actions: string[];
}

const PolicySubjectCard: React.FC<PolicySubjectCardProps> = ({
    subject,
    actions
}) => {

    const ACTION_TEXT_COLORS: Record<string, string> = {
        read: "var(--ds-color-info-text-subtle)",
        write: "var(--ds-color-success-text-subtle)",
        delete: "var(--ds-color-danger-text-subtle)",
        instantiate: "var(--ds-color-accent-text-subtle)",
        confirm: "var(--ds-color-success-text-subtle)",
        reject: "var(--ds-color-danger-text-subtle)",
        sign: "var(--ds-color-warning-text-subtle)",
    };

    return (
        <Card data-color="neutral" className={styles.card}>
            <span className={styles.subject}>{subject}</span>
            <div className={styles.actions}>
                {actions.map((action) => (
                    <span 
                    key={action} 
                    className={styles.actionTag}
                    style={{
                        color: ACTION_TEXT_COLORS[action] ?? "var(--ds-color-neutral-text-subtle)",
                    }}
                    >
                        {action}
                    </span>
                ))}
            </div>
        </Card>
    );
}

export default PolicySubjectCard;