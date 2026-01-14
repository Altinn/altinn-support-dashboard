import { Heading } from "@digdir/designsystemet-react"
import CorrespondenceCheckbox from "../components/Correspondence/CorrespondenceCheckbox"
import style from "./styles/CorrespondencePage.module.css"
import MessageBody from "../components/Correspondence/MessageBody"
import MessageSummary from "../components/Correspondence/MessageSummary"
import MessageTitle from "../components/Correspondence/MessageTitle"
import MessageRecipient from "../components/Correspondence/MessageRecipient"





export const CorrespondencePage = () => {

    return (
        <div>
            <Heading className={style["heading"]} level={1} data-size="sm">
                Opprett melding for test
            </Heading>

            <MessageRecipient />
            <MessageTitle />
            <MessageSummary />
            <MessageBody/>

            <CorrespondenceCheckbox />
        </div>
    )
}