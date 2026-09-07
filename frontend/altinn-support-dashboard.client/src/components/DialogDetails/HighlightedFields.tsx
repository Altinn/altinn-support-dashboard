import { Card } from "@digdir/designsystemet-react";
import styles from "./HighlightedFields.module.css";


export type HighlightedField = {
  label: string;
  value: unknown;
};

type HighlightedFieldsProps = {
  fields: HighlightedField[];
};

const formatFieldValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
};

const HighlightedFields: React.FC<HighlightedFieldsProps> = ({ fields }) => (
    <Card data-color="neutral" className={styles.highlightedFields}>
        {fields.map((field) => (
            <div key={field.label} className={styles.fieldRow}>
                <span className={styles.fieldLabel}>{field.label}:</span>
                <span className={styles.fieldValue}>{formatFieldValue(field.value)}</span>
            </div>
        ))}
    </Card>
);

export default HighlightedFields;