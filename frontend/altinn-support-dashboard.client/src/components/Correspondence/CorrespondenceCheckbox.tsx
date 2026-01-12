import { Checkbox, Fieldset } from "@digdir/designsystemet-react";
import style from "./styles/CheckBox.module.css";



const CorrespondenceCheckbox = () => {

    return (
        <Fieldset>
            <Fieldset.Legend>Trengs det bekreftelse?</Fieldset.Legend>
            <Checkbox label="Ja" />
        </Fieldset>
    )
}

export default CorrespondenceCheckbox;