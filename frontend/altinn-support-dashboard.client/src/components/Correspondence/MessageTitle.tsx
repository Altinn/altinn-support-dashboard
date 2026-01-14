import { Textfield } from "@digdir/designsystemet-react";


type MessageTitleProps = {
    value?: string;
    onChange: (value: string) => void;
}

const MessageTitle: React.FC<MessageTitleProps> = ({
    value,
    onChange
}) => {
    return (
        <div>
            <Textfield
                label="Meldingstittel"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default MessageTitle;