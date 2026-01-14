import { Textfield } from "@digdir/designsystemet-react";
import style from "./styles/InputComponent.module.css";



type MessageRecipientProps = {
    value?: string;
    onChange: (value: string) => void;
}

const MessageRecipient: React.FC<MessageRecipientProps> = ({
    value,
    onChange, 
}) => {

    return (
        <div className={style["input-container"]}>
            <Textfield
                label="Mottaker"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default MessageRecipient;
