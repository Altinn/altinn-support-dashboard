import { Card } from "@digdir/designsystemet-react";
import styles from "./styles/PolicySubjectCard.module.css"



interface PolicySubjectCardProps{
    subject: string;
    actions: string[];
}

const PolicySubjectCard: React.FC<PolicySubjectCardProps> = ({
    subject,
    actions
}) => (
    <Card data-color="neutral" className={styles.card}>
        <span className={styles.subject}>{subject}</span>
        <div className={styles.actions}>
            {actions.map((action) => (
                <span key={action} className={styles.actionTag}>
                    {action}
                </span>
            ))}
        </div>
    </Card>
);

export default PolicySubjectCard;