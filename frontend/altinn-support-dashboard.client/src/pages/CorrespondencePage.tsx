import { Button, Heading } from "@digdir/designsystemet-react"
import CorrespondenceCheckbox from "../components/Correspondence/CorrespondenceCheckbox"
import style from "./styles/CorrespondencePage.module.css"
import MessageBody from "../components/Correspondence/MessageBody"
import MessageSummary from "../components/Correspondence/MessageSummary"
import MessageTitle from "../components/Correspondence/MessageTitle"
import MessageRecipient from "../components/Correspondence/MessageRecipient"
import { useState } from "react"
import { getLocalStorageValue, setLocalStorageValue } from "../components/ManualRoleSearch/utils/storageUtils"



export const CorrespondencePage = () => {
    const [recipient, setRecipient] = useState<string>(getLocalStorageValue("recipient"))
    const [title, setTitle] = useState<string>(getLocalStorageValue("title"))
    const [summary, setSummary] = useState<string>(getLocalStorageValue("summary"))
    const [body, setBody] = useState<string>(getLocalStorageValue("body"))

    return (
        <div>
            <Heading className={style["heading"]} level={1} data-size="sm">
                Opprett melding for test
            </Heading>

            <MessageRecipient
                value={recipient}
                onChange={(value) => {
                    setRecipient(value);
                    setLocalStorageValue("recipient", value);
                }}
            />
            <MessageTitle  
                value={title}
                onChange={(value) => {
                    setTitle(value);
                    setLocalStorageValue("title", value);
                }}
            />
            <MessageSummary 
                value={summary}
                onChange={(value) => {
                    setSummary(value);
                    setLocalStorageValue("summary", value);
                }}
            />
            <MessageBody
                value={body}
                onChange={(value) => {
                    setBody(value);
                    setLocalStorageValue("body", value);
                }}
            />

            <CorrespondenceCheckbox />

            <Button className={style["send-button"]} variant="primary">
                Send melding
            </Button>
        </div>
    )
}