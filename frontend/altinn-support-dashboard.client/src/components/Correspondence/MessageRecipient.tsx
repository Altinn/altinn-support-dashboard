import { Textfield } from "@digdir/designsystemet-react";
import style from "./styles/InputComponent.module.css";



const MessageRecipient = () => {

    return (
        <div className={style["input-container"]}>
            <Textfield label="Mottaker" rows={10} />
        </div>
    )
}

export default MessageRecipient;
