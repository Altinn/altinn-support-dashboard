import { Label, Textarea } from "@digdir/designsystemet-react";


type MessageBodyProps = {
    value?: string;
    onChange: (value: string) => void;
}

const MessageBody: React.FC<MessageBodyProps> = ({
    value,
    onChange
}) => {

    return (
        <div>
            <Label>Meldingstekst</Label>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default MessageBody;