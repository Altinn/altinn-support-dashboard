import { Textfield } from "@digdir/designsystemet-react";
import style from "./styles/InputComponent.module.css";


type InputComponentProps = {
    title: string;
};


const InputComponent: React.FC<InputComponentProps> = ({ 
    title 
}) => {

    return (
        <div className={style["input-container"]}>
            <Textfield label={title}  rows={10} />
        </div>
    )
}

export default InputComponent;
