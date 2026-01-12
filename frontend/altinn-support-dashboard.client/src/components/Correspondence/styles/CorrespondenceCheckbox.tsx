import { Checkbox, Heading } from "@digdir/designsystemet-react";




const CorrespondenceCheckbox = () => {

    return (
        <div>
            <Heading level={1} data-size="sm">
                Trengs det bekreftelse?
            </Heading>
            <Checkbox label="Ja" />
        </div>
    )
}

export default CorrespondenceCheckbox;