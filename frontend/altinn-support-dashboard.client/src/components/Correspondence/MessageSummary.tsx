import { Textfield } from "@digdir/designsystemet-react"

type MessageSummaryProps = {
    value?: string;
    onChange: (value: string) => void;
}

const MessageSummary: React.FC<MessageSummaryProps> = ({
    value,
    onChange
}) => {

    return (
        <div>
            <Textfield
                label="Meldingsoppsummering"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default MessageSummary;