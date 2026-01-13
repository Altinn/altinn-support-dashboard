import { Heading } from "@digdir/designsystemet-react"
import InputComponent from "../components/Correspondence/CorrespondenceInput"
import CorrespondenceCheckbox from "../components/Correspondence/CorrespondenceCheckbox"
import style from "./styles/CorrespondencePage.module.css"
import MessageBody from "../components/Correspondence/MessageBody"





export const CorrespondencePage = () => {

    return (
        <div>
            <Heading className={style["heading"]} level={1} data-size="sm">
                Opprett melding for test
            </Heading>

            <InputComponent title="Mottaker"/>
            <InputComponent title="Meldingstittel"/>
            <InputComponent title="Meldingsoppsummering"/>
            <MessageBody/>

            <CorrespondenceCheckbox />
        </div>
    )
}