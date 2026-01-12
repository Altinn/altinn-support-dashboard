import { Textfield } from "@digdir/designsystemet-react";



type InputComponentProps = {
    title: string;
};


const InputComponent: React.FC<InputComponentProps> = ({ 
    title 
}) => {

    return (
        <div>
            <Textfield label={title}  rows={10} />
        </div>
    )
}

export default InputComponent;
